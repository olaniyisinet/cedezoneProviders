sideProfile = {
    CONSTANTS: {
    },

    init: function () {
        Cedezone.checkToken();
        sideProfile.getProfile();
    },

    getProfile: function () {
        $.ajax({
           // url: App.api + '/' + Route.PROFILE,
            url: Cedezone.CONSTANTS.BASE_URL + '/profile',
            data: {
                token: Cedezone.getToken()
            },
            error: function () {
                Cedezone.hideLoadingGif();
                Cedezone.showNotification('error', 'Error occurred while making connection', 'Error')
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                sideProfile.populateProfile(data)
            },
            type: 'GET',
            beforeSend: function () {
                Cedezone.showLoadingGif();
            },
        });
    },
    
    populateProfile: function (data) {
        // console.log(data);
        // sideProfile.CONSTANTS.profile = data;

         $('#photos').find('#profileNameTop').text(data.data.name);

        if(data.data.avatar!='') {
            $('#photos').find('#avatar').attr('src', data.data.avatar); //
            $('#photos').attr('data-default-file',data.data.avatar);
            // $('#photo').dropify();
        }
    },
}

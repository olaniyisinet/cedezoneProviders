Profile = {
    CONSTANTS: {
        route: Route.PROFILE,
        profile: '',
        location_route: '/location/',
        myorders_route: '/myorders',
        address_route: '/address',
        avatar: '/update/avatar',
        card_linking: '/profile/show',
        change_route: 'change/password',
    },

    init: function () {
        Cedezone.checkToken();
        Profile.getProfile();
    },

    getProfile: function () {
        $.ajax({
            // url: App.api + '/' + Route.PROFILE,
            url: Cedezone.CONSTANTS.BASE_URL + Profile.CONSTANTS.card_linking,
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
                Profile.populateProfile(data)
            },
            type: 'GET',
            beforeSend: function () {
                Cedezone.showLoadingGif();
            },
        });
    },

    populateProfile: function(data){
        providerProfile.CONSTANTS.profile = data;
        
    },
    populateProfile: function (data) {

        Profile.CONSTANTS.profile = data;
        $('#profileTab').find('#providerType').text(data.data.provider.type.name);
        $('#profileTab').find('#profileService').text(data.data.provider.service.service_name);
        $('#profileTab').find('#serviceCategory').text(data.data.provider.service.category_name);
        $('#profileTab').find('#profileName').text(data.data.name);
        $('#profileTab').find('#profilePhone').text(data.data.phone);
        $('#profileTab').find('#profileLocation').text(data.data.country + ', ' +data.data.state+ ', '+data.data.location);
        $('#profileTab').find('#profileAddress').text(data.data.address);

        if (data.data.avatar != '') {
            $('.img-uplod').find('#avatar').attr('src', data.data.avatar); //
            // $('#photo').attr('data-default-file',data.data.avatar);
            // $('#photo').dropify();
        }

        Cedezone.storeName(Profile.CONSTANTS.profile.data.name);
        //        Dashboard.init();
    },

    ProcessError: function (data) {
        Cedezone.hideLoadingGif();
        console.log(data);
        try {
            var errorKeys = Object.keys(data.responseJSON);

            errorKeys.forEach(function (record) {
                console.log(record);
                $('#' + record).addClass('parsley-error').parent().append(
                    '<ul class="parsley-errors-list filled"><li class="parsley-required">' + data.responseJSON[record] + '</li></ul>'
                )
            });
        } catch (err) {
            showDialog({
                title: 'Error',
                text: 'Unable to Connect, ',
            })
        }
    },
}
Profile = {
    CONSTANTS: {
        route: '/profile',
        profile: '',
    },

    init: function () {
        Cedezone.checkToken();
        Profile.getProfile();
    },

    getProfile: function () {
        $.ajax({
            // url: App.api + '/' + Route.PROFILE,
            url: Cedezone.CONSTANTS.BASE_URL + Profile.CONSTANTS.route,
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
                 if (data.msg == "Token has expired") {
                    window.location = "index.html";
                }
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
        //  alert(JSON.stringify(data.data.provider.service));
        $('#profileTab').find('#providerType').text(data.data.provider.type.name);
        // $('#profileTab').find('#providerService').text(JSON.stringify(data.data.provider.service));
        // $('#profileTab').find('#providerCategory').text(JSON.stringify(data.data.provider.service));

        $('#profileTab').find('#providerService').text(Profile.processService(data.data.provider.service));
        $('#profileTab').find('#providerCategory').text(Profile.processServiceCategory(data.data.provider.service));

        $('#profileTab').find('#profileName').text(data.data.name);
        $('#profileTab').find('#profilePhone').text(data.data.phone);
        $('#profileTab').find('#profileLocation').text(data.data.country + ', ' +data.data.state+ ', '+data.data.location);
        $('#profileTab').find('#profileAddress').text(data.data.address);
        $('#photos').find('#profileNameTop').text(data.data.name);

        if(data.data.avatar!='') {
            $('#photos').find('#avatar').attr('src', data.data.avatar); //
            $('#photos').attr('data-default-file',data.data.avatar);
            // $('#photo').dropify();
        }    },

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
    processService: function (data) {
        if (data == null) {
            return 'None';
        }
        $html = ''
        $.each(data, function (i, value) {
            $html = value.service_name 
        });
        return $html;
        alert($html)
    },
    
    processServiceCategory: function (data) {
        if (data == null) {
            return 'None';
        }
        $html = ''
        $.each(data, function (i, value) {
            $html += value.category_name + ","
        });
        $html += '';
        return $html;
         alert($html)
    },
}
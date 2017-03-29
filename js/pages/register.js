/**
 * Created by Samuel.James on 7/18/2016.
 */
/**
 * Created by Samuel.James on 7/17/2016.
 */
Register_Provider = {

    CONSTANTS: {
        route: 'provider/register',
        country_route: 'country/all',
        state_route: 'country/states/',
        provider_type: 'provider/types',
        message: '<div class="alert alert-success"><p>Your registration was successful</p> Please login</div>',
        template: '',
    },

    init: function () {
        $(document).ready(function () {
            Register_Provider.getCountries();
            Register_Provider.getProviderTypes();

        })
        $('#provider_register').submit(function (e) {
            e.preventDefault();
            var instance = $(this).parsley();
            if (instance.isValid()) {
                $(this).ajaxSubmit(Register_Provider.setAjaxOptions());
            } else {
                return (false);
            }
        });
        $('#country_id').change(function () {
            var value = $('#country_id').val();
            Register_Provider.getStatesInCountry(value);
        })
    },

    setAjaxOptions: function () {
        return {
            target: '#message', // target element(s) to be updated with server response
            beforeSubmit: Cedezone.showLoadingGif, // pre-submit callback
            success: function (data) {
                Register_Provider.SuccessResponse(data);
            }, // post-submit callback
            type: 'post', // 'get' or 'post', override for form's 'method' attribute
            dataType: 'json', // 'xml', 'script', or 'json' (expected server response type)
            clearForm: false, // clear all form fields after successful submit
            resetForm: false,
            url: Cedezone.CONSTANTS.BASE_URL + '/' + Register_Provider.CONSTANTS.route,
            // reset the form after successful submit
            // $.ajax options can be used here too, for example:
            //timeout:   3000
            error: function (data) {
                Register_Provider.ProcessError(data);
            }
        };
    },

    getCountries: function () {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + '/' + Register_Provider.CONSTANTS.country_route,
            data: {
                format: 'json'
            },
            error: function () {
                alert('Sorry error occured while fetching available countries');
            },
            dataType: 'json',
            success: function (data) {
                //console.log(data);
                Register_Provider.populateCountryDropdown(data);
            },
            type: 'GET'
        });
    },

    populateCountryDropdown: function (data) {
        var $country = $("#country_id");
        $country.empty();
        $country.append("<option>Select your country</option>")
        $.each(data, function (index, value) {
            //console.log(data)
            $country.append("<option value=" + value.id + ">" + value.name + "</option>");
        });
    },

    getStatesInCountry: function (countryid) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + '/' + Register_Provider.CONSTANTS.state_route + countryid,
            data: {
                format: 'json'
            },
            error: function () {
                alert('Sorry error occured while fetching available states in your country ');
            },
            dataType: 'json',
            success: function (data) {
                // console.log(data);
                Register_Provider.populateStateDropdown(data);
            },
            type: 'GET'
        });
    },
    populateStateDropdown: function (data) {
        var $state = $("#state_id");
        $state.empty();
        $state.append("<option>Select your state</option>");
        $.each(data, function (index, value) {
            $state.append("<option value=" + value.id + ">" + value.name + "</option>");
        });
    },
    getProviderTypes: function () {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + '/' + Register_Provider.CONSTANTS.provider_type,
            error: function () {
                alert('Sorry error occured while fetching provider types ');
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                Register_Provider.populateProviderTypeDropdown(data);
            },
            type: 'GET'
        });
    },
    populateProviderTypeDropdown: function (data) {
        var $type = $("#providertype_id");
        $type.empty();
        $type.append("<option>Select provider type</option>");
        $.each(data, function (index, value) {
            $type.append("<option value=" + value.id + ">" + value.name + "</option>");
        });
    },
    SuccessResponse: function (data) {
        Cedezone.hideLoadingGif();
        if (data.status == true) {
            console.log('registration successful');
            Register_Provider.ReplaceView();
        }
    },

    ReplaceView: function () {
        window.location = 'reg_successful.html'
    },

    ProcessError: function(data){
        Cedezone.hideLoadingGif();
        try{
        var errorKeys = Object.keys(data.responseJSON);
       // $('#register-message').append();
        Cedezone.showNotification('error','Registration not successful','Invalid inputs');
        errorKeys.forEach(function(record){
            // console.log(record);
            $('#' + record).addClass('parsley-error').parent().append(
                '<ul class="parsley-errors-list filled"><li class="parsley-required">' + data.responseJSON[record] + '</li></ul>'
            )
        });
        } catch (err) {
            showDialog({
                    title: 'Error',
                    text: 'Unable to Connect',
                })
        }
    },
}
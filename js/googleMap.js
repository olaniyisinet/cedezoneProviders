(function (global) {
    "use strict";
 
    function onDeviceReady () {
        document.addEventListener("online", onOnline, false);
        document.addEventListener("resume", onResume, false);
        loadMapsApi();

        // alert('google map is online');
    }
 
    function onOnline () {
        loadMapsApi();
    }
 
    function onResume () {
        loadMapsApi();
    }
 
    function loadMapsApi () {
        if(navigator.connection.type === Connection.NONE || google.maps) {
            return;
        }
        $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCo5ZL-WiJduobYz12lxRsPdHS2oC-rIHw&sensor=true&callback=onMapsApiLoaded');
    }
 
    global.onMapsApiLoaded = function () {
        // Maps API loaded and ready to be used.
        var lat = '62553.3';
			var lang = '33309.0';

			//Google Maps
			var myLatlng = new google.maps.LatLng(lat, lang);
			var mapOptions = {
				zoom: 4,
				center: myLatlng
			}
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
			var marker = new google.maps.Marker({
				position: myLatlng,
				map: map
			});

            function onError(error) {
			alert('code: ' + error.code + '\n' +
				'message: ' + error.message + '\n');
		}
		google.maps.event.addDomListener(window, 'load', onSuccess);
    };
    
    document.addEventListener("deviceready", onDeviceReady, false);
})(window);
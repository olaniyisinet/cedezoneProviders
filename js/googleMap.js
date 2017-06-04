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
        var map = new google.maps.Map(document.getElementById("map"), {});
    };
 
    document.addEventListener("deviceready", onDeviceReady, false);
})(window);
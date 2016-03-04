/**
 * Created by YX on 7/23/2014.
 */
var initMap,resultMap,
    directionsDisplay,
    directionsService;

/*
*   Factory
* */
var geoInfo = function(){
    this.startingLocation = {currentLocation:null,locatable:false};
    this.destination = null;
}
geoInfo.prototype = {};
//YO

function getStartingLocation(startingLocation){
    console.log(JSON.stringify(startingLocation));
    if(startingLocation.locatable == true){
        console.log("Locatable ");
        return startingLocation.currentLocation.K+','+startingLocation.currentLocation.G;
    }else{
        console.log("Not Locatable ");
        return startingLocation.currentLocation;
    }
}

/*
 *   END -> Factory
 * */

//function handles calculating distance and display in the map
function calcDisplay(map,serviceRequest,fn){
    resizeMap(map);
    console.log('after zoom: ' + map.getZoom())
    calculateRoute($("#target-dest").val(),$('#target-origin').val(),serviceRequest,fn);
}
function resizeMap(map){
    console.log('-> Resize map' +map);
    google.maps.event.trigger(map, 'resize'); // for result map
    map.setZoom(13);
}
/* Initialize the map*/
function initialize(lat, lon,geo)
{

    var myLocation =
    {
        "geometry": {
            "type": "Point",
            "coordinates": [
                -114.099011940211,
                50.9712938584368,
                0
            ]
        },
        "properties": {
            "ADDRESS": "1607 90 AV SW",
            "TYPE": "Indoor Pool",
            "NAME": "Calgary Jewish Centre"
        }
    }

    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsService = new google.maps.DirectionsService();
    geo.startingLocation.currentLocation = new google.maps.LatLng(lat, lon);
    resultMap = new google.maps.Map(document.getElementById('map_result'), {
        zoom: 11,
        center: geo.startingLocation.currentLocation,
        disableDefaultUI:true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // the map that display the result
    directionsDisplay.setMap(resultMap);
    //Locate the current location
    var currentResultPositionMarker = new google.maps.Marker({
        position: geo.startingLocation.currentLocation,
        map: resultMap,
        title: "Current position"
    });

    var infowindowInit = new google.maps.InfoWindow();
    // add listener to make the map shows after everything has changed


    // move the map to current location
    google.maps.event.addListener(currentResultPositionMarker, 'click', function() {
        infowindowInit.setContent("<div>您在这里</div>");//("Current position: latitude: " + lat +" longitude: " + lon);
        infowindowInit.open(resultMap, currentResultPositionMarker);
    });

    // Add listener for recentering map after navigate to the map_page. But only once so user can move the map around.
    /**/

    /*********************************************************************************************************************
        Initlize iniMap

     ***********************************************************************************************************************************/
    initMap = new google.maps.Map(document.getElementById('map_init'), {
        zoom: 13,
        center: geo.startingLocation.currentLocation,
        disableDefaultUI:true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var currentInitPositionMarker = new google.maps.Marker({
        position: geo.startingLocation.currentLocation,
        map: initMap,
        title: "Current position"
    });




    //START PLAYING WITH GMAPS





    //TODO: resolve shape
    //var myShape = new google.maps.Marker
    //TODO: test these markers out with JSON locations



    var testLocationMapMarker = new google.maps.Marker({
        position: {lat: myLocation.geometry.coordinates[1], lng: myLocation.geometry.coordinates[0]},
        map: initMap,
        title: myLocation.properties.NAME
        //shape:
        //animation: google.maps.Animation.BOUNCE   //maybe use bounce for selected location
    });



    //END PLAYING WITH GMAPS

    //input: JSON object
    function addLocationToMap(){

    }

    function addLocationToMapImportant(){

    }



    google.maps.event.addListener(initMap, 'idle', function() {
        $('#get_directions').removeClass("ui-disabled")
        console.log("-> map idle resize map");
        google.maps.event.trigger(initMap, 'resize'); // for result map
    });

    google.maps.event.addListenerOnce(initMap, 'center_changed', function() {
        // 1 second after the center of the map has changed, pan back to the
        // marker.
        window.setTimeout(function() {
            initMap.panTo(currentInitPositionMarker.getPosition());
        }, 800);
    });
} // END of initialization

// Force UI hide useCurrent location
function locError(error) {
    // initialize map with a static predefined latitude, longitud
    var geo = new geoInfo();
    console.log('loc fail: geoInfo locatable stays as '+geo.startingLocation.locatable);
    initialize(51.013117,-114.0741556,geo); // calgary by default
}

function locSuccess(position) {
    var geo = new geoInfo();
    geo.startingLocation.locatable = true;
    console.log('locSuccess: geoInfo locatable changed to '+geo.startingLocation.locatable);
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        // some code..
        console.log('Mobile!');
    }else{
        console.log('PC!');
    }

    initialize(position.coords.latitude, position.coords.longitude,geo);
}


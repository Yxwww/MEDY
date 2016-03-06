/**
 * Created by YX on 7/23/2014.
 */
var map,satelliteMap,
    directionsDisplay,
    directionsService,initialLocation;

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


//TODO: delete these after we're finished testing
var myTestGeoJSON = {
    "type":"Feature",
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
    },
    "style":{
        //all SVG styles allowed
        "fill":"red",
        "stroke-width":"3",
        "fill-opacity":0.6
    }
}

var myTestGeoJSONList  = [
    {
        "type":"Feature",
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
    },
    {
        "type":"Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                -114.048140771305,
                51.0746812009129,
                0
            ]
        },
        "properties": {
            "ADDRESS": "2502 6 ST NE",
            "TYPE": "Golf Course",
            "NAME": "Calgary Elks Lodge & Golf Club"
        }
    },
    {
        "type":"Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                -114.110141192693,
                51.080359150233,
                0
            ]
        },
        "properties": {
            "ADDRESS": "19 ST NW & CHICOUTIMI DR NW",
            "TYPE": "City Park",
            "NAME": "North Capitol Hill Park (Canmore Park)"
        }
    }
]



/* Initialize the map*/
//TODO: a callback to "initialize()" occurs when google maps api loads
function initMap() {

    //create our secondary satellite map
    satelliteMap = new google.maps.Map(document.getElementById('satelliteMap'), {
        zoom: 16,
        center: {lat: 51.0486151, lng: -114.0708459},
        disableDefaultUI:false,
        mapTypeId: google.maps.MapTypeId.SATELLITE,     //NOTE: HYBRID shows roads, might be worthwhile

        //if we're having this map be (at least somewhat) interactable
        zoomControl: true,
        //zoomControlOptions: {
        //    style: google.maps.ZoomControlStyle.LARGE     //doesn't have anything to do with size of control
        //},

        streetViewControl: true,
        scrollwheel: false,                   //disable if we only want the user to zoom using the zoom controls
        disableDoubleClickZoom: true,         //disable if we only want the user to zoom using the zoom controls

        mapTypeControl:false,
        panControl: true,                      //disable if we decide to keep tilt controls
        scaleControl: false,
        draggable: false,
        minZoom: 14,
        maxZoom: 18
        //set max zoom, min zoom?
    });

    satelliteMap.setTilt(45)                //to set the tilt or not? that is the question

    //update div height of map
    //alert($("#testing").height() )
    $("#map").height($(window).height() - 130)
    $("#map").width($(window).width())

    $("#positionWindow").width($(window).width() - 75)


    //create our base map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {lat: 51.0486151, lng: -114.0708459},
        disableDefaultUI:true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scaleControl:true,

        //not supported as of current API (3.22)
        scaleControlOptions:{
            position: google.maps.ControlPosition.TOP_CENTER
        }
    });

    //set map center to user location
    //if we have user's geolocation
    if (navigator.geolocation) {

        //set map view to user's location
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);

            var icon = {
                url: "../medy/themes/images/icons-png/user-big.png",
                scaledSize: new google.maps.Size(25, 25), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(0, 0) // anchor
            };

            //place a marker at user's location
            var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var currentResultPositionMarker = new google.maps.Marker({
                position: userLatLng,
                map: map,
                title: "Current position",
                icon: icon
            });

            map.setZoom(15)

        });
    }

    // Set event listener for each feature.
    map.data.addListener('click', function(event) {
        console.log(event);
        console.log(event.latLng.lat(),event.latLng.lng());
        //alert("clicked on marker!")


        $("#positionWindow").popup("open");
        getFeatureByURL(event.feature.R.URL,function(feature){
            updateLandmarkWithFeature(feature)
        })
        featureRefURL = event.feature.R.URL
        setSatelliteMapCenter(event.latLng.lat(), event.latLng.lng())








        //infowindow.setContent(event.feature.getProperty('name')+"<br>"+event.feature.getProperty('description'));
        //infowindow.setPosition(event.latLng);
        //infowindow.setOptions({pixelOffset: new google.maps.Size(0,-34)});
        //infowindow.open(map);
    });

}

//draw a list of GeoJSON objects
function drawJSONList(list){
    list.forEach(function (obj) {
        obj.properties["URL"] = obj.URL
        map.data.addGeoJson(obj);
    })
}


//moves satelliteMap's view to a lat,long
function setSatelliteMapCenter(lat,lng){
    google.maps.event.trigger(satelliteMap, 'resize');
    satelliteMap.setZoom(16)
    satelliteMap.setCenter(new google.maps.LatLng(lat, lng))
}


//input: p1, p2 are google.maps.LatLang objects
//tested as working correctly between calgary & edmonton, and calgary & vancouver (based on google maps' distance search)
function getDistance(p1, p2){
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
}

//get estimated travel time
function getTravelTime(p1, p2){

    return new Promise(function(resolve, reject) {

        var directionsService = new google.maps.DirectionsService();
        var request = {
            origin: p1, // LatLng|string
            destination: p2, // LatLng|string
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };


        directionsService.route( request, function(response, status) {

            if (status === "OK") {
                var point = response.routes[0].legs[0];
                //$( '#travel_data' ).html( 'Estimated travel time: ' + point.duration.text + ' (' + point.distance.text + ')' );
                //alert("estimate travel time = " + point.duration.text + ' (' + point.distance.text + ")" )

                if (point != undefined){
                    //alert("success: " + point.duration.text)
                    resolve(point.duration.text)
                }
                else{
                    reject(Error("Point is undefined"))
                }
            }
            else{
                reject(Error("No route available"))
            }
        });
    })

}
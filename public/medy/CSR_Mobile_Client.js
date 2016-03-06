/**
 * Created by YX on 7/23/2014.
 */
var map,satelliteMap,
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
        //zoom: 13,
        //center: {lat: 51.0486151, lng: -114.0708459},
        //disableDefaultUI:true,
        //mapTypeId: google.maps.MapTypeId.ROADMAP
    });


    //create our base map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {lat: 51.0486151, lng: -114.0708459},
        disableDefaultUI:true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    //set map center to user location
    //if we have user's geolocation
    if (navigator.geolocation) {

        //set map view to user's location
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);

            //var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

            //place a marker at user's location
            var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var currentResultPositionMarker = new google.maps.Marker({
                position: userLatLng,
                map: map,
                title: "Current position",
                //for custom icons: (temp flag icon for now)
                //icon: image
                //icon: "https://image.freepik.com/free-icon/map-marker-with-a-person-shape_318-50581.jpg"
                //icon: "images/icons-png/beachflag.png"
            });

            map.setZoom(15)


            //currentResultPositionMarker.setIcon("https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png")

            //drawJSONList(myTestGeoJSONList);
        });
    }

    // Set event listener for each feature.
    map.data.addListener('click', function(event) {

        alert("clicked on marker!")
        //infowindow.setContent(event.feature.getProperty('name')+"<br>"+event.feature.getProperty('description'));
        //infowindow.setPosition(event.latLng);
        //infowindow.setOptions({pixelOffset: new google.maps.Size(0,-34)});
        //infowindow.open(map);
    });
}

//draw a list of GeoJSON objects
function drawJSONList(list){
    list.forEach(function (obj) {
        map.data.addGeoJson(obj);
    })
}






//TODO: REALLY need to get this working so that the map ALWAYS loads before we try to access it
//initialize map immediately when page loads
google.maps.event.addDomListener(window, "load", initMap);





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
        }
    }

    var googleGeoJSON = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "letter": "G",
                    "color": "blue",
                    "rank": "7",
                    "ascii": "71"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [123.61, -22.14], [122.38, -21.73], [121.06, -21.69], [119.66, -22.22], [119.00, -23.40],
                            [118.65, -24.76], [118.43, -26.07], [118.78, -27.56], [119.22, -28.57], [120.23, -29.49],
                            [121.77, -29.87], [123.57, -29.64], [124.45, -29.03], [124.71, -27.95], [124.80, -26.70],
                            [124.80, -25.60], [123.61, -25.64], [122.56, -25.64], [121.72, -25.72], [121.81, -26.62],
                            [121.86, -26.98], [122.60, -26.90], [123.57, -27.05], [123.57, -27.68], [123.35, -28.18],
                            [122.51, -28.38], [121.77, -28.26], [121.02, -27.91], [120.49, -27.21], [120.14, -26.50],
                            [120.10, -25.64], [120.27, -24.52], [120.67, -23.68], [121.72, -23.32], [122.43, -23.48],
                            [123.04, -24.04], [124.54, -24.28], [124.58, -23.20], [123.61, -22.14]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "letter": "o",
                    "color": "red",
                    "rank": "15",
                    "ascii": "111"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [128.84, -25.76], [128.18, -25.60], [127.96, -25.52], [127.88, -25.52], [127.70, -25.60],
                            [127.26, -25.79], [126.60, -26.11], [126.16, -26.78], [126.12, -27.68], [126.21, -28.42],
                            [126.69, -29.49], [127.74, -29.80], [128.80, -29.72], [129.41, -29.03], [129.72, -27.95],
                            [129.68, -27.21], [129.33, -26.23], [128.84, -25.76]
                        ],
                        [
                            [128.45, -27.44], [128.32, -26.94], [127.70, -26.82], [127.35, -27.05], [127.17, -27.80],
                            [127.57, -28.22], [128.10, -28.42], [128.49, -27.80], [128.45, -27.44]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "letter": "o",
                    "color": "yellow",
                    "rank": "15",
                    "ascii": "111"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [131.87, -25.76], [131.35, -26.07], [130.95, -26.78], [130.82, -27.64], [130.86, -28.53],
                            [131.26, -29.22], [131.92, -29.76], [132.45, -29.87], [133.06, -29.76], [133.72, -29.34],
                            [134.07, -28.80], [134.20, -27.91], [134.07, -27.21], [133.81, -26.31], [133.37, -25.83],
                            [132.71, -25.64], [131.87, -25.76]
                        ],
                        [
                            [133.15, -27.17], [132.71, -26.86], [132.09, -26.90], [131.74, -27.56], [131.79, -28.26],
                            [132.36, -28.45], [132.93, -28.34], [133.15, -27.76], [133.15, -27.17]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "letter": "g",
                    "color": "blue",
                    "rank": "7",
                    "ascii": "103"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [138.12, -25.04], [136.84, -25.16], [135.96, -25.36], [135.26, -25.99], [135, -26.90],
                            [135.04, -27.91], [135.26, -28.88], [136.05, -29.45], [137.02, -29.49], [137.81, -29.49],
                            [137.94, -29.99], [137.90, -31.20], [137.85, -32.24], [136.88, -32.69], [136.45, -32.36],
                            [136.27, -31.80], [134.95, -31.84], [135.17, -32.99], [135.52, -33.43], [136.14, -33.76],
                            [137.06, -33.83], [138.12, -33.65], [138.86, -33.21], [139.30, -32.28], [139.30, -31.24],
                            [139.30, -30.14], [139.21, -28.96], [139.17, -28.22], [139.08, -27.41], [139.08, -26.47],
                            [138.99, -25.40], [138.73, -25.00 ], [138.12, -25.04]
                        ],
                        [
                            [137.50, -26.54], [136.97, -26.47], [136.49, -26.58], [136.31, -27.13], [136.31, -27.72],
                            [136.58, -27.99], [137.50, -28.03], [137.68, -27.68], [137.59, -26.78], [137.50, -26.54]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "letter": "l",
                    "color": "green",
                    "rank": "12",
                    "ascii": "108"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [140.14,-21.04], [140.31,-29.42], [141.67,-29.49], [141.59,-20.92], [140.14,-21.04]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "letter": "e",
                    "color": "red",
                    "rank": "5",
                    "ascii": "101"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [144.14, -27.41], [145.67, -27.52], [146.86, -27.09], [146.82, -25.64], [146.25, -25.04],
                            [145.45, -24.68], [144.66, -24.60], [144.09, -24.76], [143.43, -25.08], [142.99, -25.40],
                            [142.64, -26.03], [142.64, -27.05], [142.64, -28.26], [143.30, -29.11], [144.18, -29.57],
                            [145.41, -29.64], [146.46, -29.19], [146.64, -28.72], [146.82, -28.14], [144.84, -28.42],
                            [144.31, -28.26], [144.14, -27.41]
                        ],
                        [
                            [144.18, -26.39], [144.53, -26.58], [145.19, -26.62], [145.72, -26.35], [145.81, -25.91],
                            [145.41, -25.68], [144.97, -25.68], [144.49, -25.64], [144, -25.99], [144.18, -26.39]
                        ]
                    ]
                }
            }
        ]
    }


    map.data.loadGeoJSON(googleGeoJSON)


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

    //THIS MAY NOT BE NEEDED IF WE USE GEOJSON API

    //input: landmark : JSON object, type : String, important: bool
    //Notes: type refers to the type of landmark (based on the name of the json it was obtained from):
    //city amenities, community services, offleash areas, sport grouping areas
    //type determines the shape and the layer to which a landmark will be added
    function addLandmarkToMap(landmark, type, important){


        //complex icons: https://developers.google.com/maps/documentation/javascript/examples/icon-complex
        //this will be based on type
        //var shape = {
        //    coords: [1, 1, 1, 20, 18, 20, 18, 1],
        //    type: 'poly'
        //};

        //this will also be based on type
        //var image = {
        //    url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        //    // This marker is 20 pixels wide by 32 pixels high.
        //    size: new google.maps.Size(20, 32),
        //    // The origin for this image is (0, 0).
        //    origin: new google.maps.Point(0, 0),
        //    // The anchor for this image is the base of the flagpole at (0, 32).
        //    anchor: new google.maps.Point(0, 32)
        //};



        new google.maps.Marker({
            position: {lat: landmark.geometry.coordinates[1], lng: landmark.geometry.coordinates[1]},
            map: initMap,
            title: landmark.properties.NAME
            //shape: something to do with type
            //icon: something to do with type


            //this is also based on type, however will be used instead of shape and image if we choose to use pre-determined symbols (good idea!)
            //simple icons: https://developers.google.com/maps/documentation/javascript/examples/marker-symbol-predefined
            //icon: {
            //    path: google.maps.SymbolPath.CIRCLE,
            //        scale: 10
            //},
        })

    }

    //END PLAYING WITH GMAPS


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


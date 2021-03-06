/**
 * Created by edwinchan on 3/4/2016.
 */

var myLat = 51.046154;
var myLong = -114.057419;
var located = false;

function setLocation(successCB){
    navigator.geolocation.getCurrentPosition(successCB, error, options);
}

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
    //alert("Could not load your location.");
};

function addComment(featureURL, name, comment){
    var ref = new Firebase(featureURL);
    var featureRef = ref.child("feedback/comments");
    var package = {};
    var currentMilliseconds = new Date().getTime();
    package[currentMilliseconds] = {};
    package[currentMilliseconds]["name"] = name;
    package[currentMilliseconds]["comment"] = comment;
    featureRef.update(package);
}

function getComments(featureURL, numComments, cb){
    var ref = new Firebase(featureURL);
    var featureRef = ref.child("feedback/comments");
    featureRef.limitToLast(numComments).once("value", function(snapshot){
        var results = [];
        snapshot.forEach(function(ss) {
            results.push(ss.val());
        });
        cb(results.reverse());
    });
}

function getFeatureByURL(featureURL, cb){
    var ref = new Firebase(featureURL);
    ref.once("value", function(snapshot){
        //console.log(snapshot.val());
        cb(snapshot.val());
    });
}

function addFavourite(featureURL, UID){
    getFavourites(current_user.auth.uid, 100, function(favourites){
        if(favourites.indexOf(featureURL) != -1){
            console.log("Already exists at" + favourites.indexOf(featureURL) + ": " + featureURL)
        }
        else{
            var ref = new Firebase("https://teammedy.firebaseio.com/users/"+UID+"/");
            var favouriteRef = ref.child("favourites");

            var package = {};
            var currentMilliseconds = new Date().getTime();
            package[currentMilliseconds] = featureURL;
            favouriteRef.update(package);
            console.log("Added: " + featureURL)
        }
    });
}

function getFavourites(UID, numFavourites, cb){
    var ref = new Firebase("https://teammedy.firebaseio.com/users/"+UID+"/");
    var featureRef = ref.child("favourites");
    featureRef.limitToLast(numFavourites).once("value", function(snapshot){
        var results = [];
        snapshot.forEach(function(ss) {
            console.log("each fav")
            results.push(ss.val());
        });
        cb(results.reverse());
    });
}

function removeFavourite(featureURL, UID){
    console.log("Removing " + featureURL)
    var ref = new Firebase("https://teammedy.firebaseio.com/users/"+UID+"/");
    var featureRef = ref.child("favourites");
    featureRef.once("value", function(snapshot){
        snapshot.forEach(function(ss) {
            //console.log(ss.key())
            if(ss.val()===featureURL){
                var removeRef = featureRef.child(ss.key());
                removeRef.remove();
            }
        });
    });
}

function removeFavourite2(featureURL, UID, cb){
    //alert("whatever")
    console.log("Removing " + featureURL)
    var ref = new Firebase("https://teammedy.firebaseio.com/users/"+UID+"/");
    var featureRef = ref.child("favourites");
    featureRef.once("value", function(snapshot){
        console.log(snapshot.val())
        if(snapshot.val() == null){
            //alert("add")
            cb(featureURL, UID);
        }
        else{
            snapshot.forEach(function(ss) {
                //console.log(ss.)
                //console.log("val " + ss.val())
                if(ss.val() == featureURL){
                    //console.log("MATCH")
                    var removeRef = featureRef.child(ss.key());
                    //removeRef.remove(cb(featureURL, UID));
                    //alert("whatever2")
                    removeRef.remove(function(){
                        //alert("add2")
                        cb(featureURL, UID);
                    })
                }
            });
            cb(featureURL, UID);
        }
    });
}

function mapAllFavourites(uid){
    navToPageWithTransition("nearby", {transition : "slide"});
    getFavourites(uid, 10, function(favourites){
        favourites.forEach(function(favourite){
            clearMap();
            getFeatureByURL(favourite, function(favObject){
                drawJSONList([favObject]);
            })
        });
    });
}

function addHistory(featureURL, UID){
    getHistory(current_user.auth.uid, 100, function(history){
        if(history.indexOf(featureURL) != -1){
            removeHistory(featureURL, UID, addHistory);
            console.log("Already exists at" + history.indexOf(featureURL) + ": " + featureURL)
        }
        else{
            var ref = new Firebase("https://teammedy.firebaseio.com/users/"+UID+"/");
            var historyRef = ref.child("history");

            var package = {};
            var currentMilliseconds = new Date().getTime();
            package[currentMilliseconds] = featureURL;
            historyRef.update(package);
            console.log("Added: " + featureURL)
        }
    });
}

function getHistory(UID, numHistory, cb){
    var ref = new Firebase("https://teammedy.firebaseio.com/users/"+UID+"/");
    var featureRef = ref.child("history");
    featureRef.limitToLast(numHistory).once("value", function(snapshot){
        var results = [];
        snapshot.forEach(function(ss) {
            results.push(ss.val());
        });
        cb(results.reverse());
    });
}

function removeHistory(featureURL, UID, cb){
    console.log("Removing " + featureURL)
    var ref = new Firebase("https://teammedy.firebaseio.com/users/"+UID+"/");
    var featureRef = ref.child("history");
    featureRef.once("value", function(snapshot){
        snapshot.forEach(function(ss) {
            console.log("length: " + ss.val().length);
            console.log(ss.val())
            if(ss.val()===featureURL){
                var removeRef = featureRef.child(ss.key());
                removeRef.remove(cb(featureURL, UID));
            }
        });
    });
}

function all(optOffleash, cb){
    setLocation(function(pos){
        myLat = pos.coords.latitude;
        myLong = pos.coords.longitude;
        located = true;
        if(optOffleash){
            var myFirebaseRef = new Firebase("https://teammedy.firebaseio.com/Assets/AllServices");
            myFirebaseRef.once("value", function(snapshot) {
                cb(snapshot.val()[0]["features"].concat(snapshot.val()[1]["features"])
                    .concat(snapshot.val()[2]["features"].concat(snapshot.val()[3]["features"])));
            });
        }
        else{
            var myFirebaseRef = new Firebase("https://teammedy.firebaseio.com/");
            myFirebaseRef.child("Assets/AllServices").limitToFirst(3).once("value", function(snapshot) {
                cb(snapshot.val()[0]["features"].concat(snapshot.val()[1]["features"]).concat(snapshot.val()[3]["features"]));
            });
        }
    });
}


function filterByCategory(result, optSportsAndRecreation, optPark, optCommunity, optAttraction, cb){
    var categoryDictionary = {};
    if(optSportsAndRecreation){
        ['Indoor Pool', 'Golf Course', 'City Park', 'Outdoor Pool', 'Athletic Park', 'Arena', 'Leisure Centre',
            'Skate Park', 'SOCCER', 'BALL DIAMOND', 'SKATING RINK', 'FOOTBALL', 'TENNIS', 'FIELD HOCKEY',
            'BASKETBALL', 'RUGBY', 'CRICKET', 'TOBOGGAN HILL', 'TRACK AND FIELD', 'VOLLEYBALL', 'LAWN BOWLING',
            'HORSESHOES', 'ULTIMATE FRISBEE', 'SKATE PARK', 'LACROSSE', 'FRISBEE GOLF', 'VELODROME',
            'MULTI USE FIELD', 'SHUFFLEBOARD', 'BATTING CAGE', 'POLO FIELD'].forEach(function(category){categoryDictionary[category]=1;});
    }
    if(optPark){
        ['City Park', 'Athletic Park', 'MULTI USE FIELD'].forEach(function(category){categoryDictionary[category]=1;});
    }
    if(optCommunity){
        ['Art Centre', 'Community Centre', 'Library', 'Visitor Info'].forEach(function(category){categoryDictionary[category]=1;});
    }
    if(optAttraction){
        ['Art Centre', 'Attraction'].forEach(function(category){categoryDictionary[category]=1;});
    }

    cb(result.filter(this.checkSelectedCategory, categoryDictionary));
}

function checkSelectedCategory(value, categoryDictionary){
    if(value.hasOwnProperty("properties")){
        if(value["properties"].hasOwnProperty("ASSET_TYPE")){
            if(this.hasOwnProperty(value["properties"]["ASSET_TYPE"])){
                return true;
            }
        }
        else if(value["properties"].hasOwnProperty("PARCEL_LOCATION")){
            return true;
        }
    }
}

function filterByDistance(result, radius, cb){
    result.forEach(function(assetTable){
        if(assetTable.hasOwnProperty("features")){
            console.log("Check features for radius: " + radius)
            cb(assetTable["features"].filter(checkWithinDistance, radius));
        }
    })
}

function filterByName(result, cb){
    var typeDictionary = {};
    result.forEach(function (assetTable){
        if(assetTable.hasOwnProperty("features")){
            assetTable["features"].forEach(function (feature){
                if(feature.hasOwnProperty("properties")){
                    if(feature["properties"].hasOwnProperty("TYPE")){
                        if (typeDictionary[feature["properties"]["TYPE"]] == undefined) {
                            typeDictionary[feature["properties"]["TYPE"]] = 1;
                        }
                        else {
                            typeDictionary[feature["properties"]["TYPE"]]++;
                        }
                    }
                    else if(feature["properties"].hasOwnProperty("ASSET_TYPE")){
                        if (typeDictionary[feature["properties"]["ASSET_TYPE"]] == undefined) {
                            typeDictionary[feature["properties"]["ASSET_TYPE"]] = 1;
                        }
                        else {
                            typeDictionary[feature["properties"]["ASSET_TYPE"]]++;
                        }
                    }
                }
            });
        }
    });
    cb(typeDictionary);
}

function checkWithinDistance(value, radius){
    if(value["geometry"].hasOwnProperty("type")){
        if(value["geometry"]["type"] == "Point" && value["geometry"].hasOwnProperty("coordinates")){
            var long = value["geometry"]["coordinates"][0];
            var lat = value["geometry"]["coordinates"][1];
            return(distance(lat, long, myLat, myLong, "K") < this);
        }
        else if(value["geometry"]["type"] == "Polygon" && value["geometry"].hasOwnProperty("coordinates")){
            if(value["geometry"]["coordinates"].hasOwnProperty("0")){
                var polyPoints = value["geometry"]["coordinates"]["0"];
                var pointOne = polyPoints[0];
                var pointTwo = polyPoints[parseInt(polyPoints.length/2)];
                var pointMid = midPoint(pointOne[1], pointOne[0], pointTwo[1], pointTwo[0]);
                return(distance(pointMid[0], pointMid[1], myLat, myLong, "K")<this);
            }
        }
    }
}

function filterByNearest(result, numResults, cb){
    var sortedLandmarks = result.sort(function(a, b) {
        return parseFloat(distance(a["geometry"]["coordinates"][1], a["geometry"]["coordinates"][0], myLat, myLong, "K"))
            - parseFloat(distance(b["geometry"]["coordinates"][1], b["geometry"]["coordinates"][0], myLat, myLong, "K"));
    });
    if(sortedLandmarks < numResults){
        cb(sortedLandmarks);
    }
    else{
        cb(sortedLandmarks.slice(0, numResults));
    }
}

function addFeedbackStructure(){
    console.log("add feedback structure");
    var myFirebaseRef = new Firebase("https://teammedy.firebaseio.com/Assets/AllServices/2/features/");
    myFirebaseRef.orderByKey().startAt("0").endAt("1000").once("value", function(snapshot) {
        result = snapshot.val();
        //var path = "";
        //for(var assetTableKey in result){
        //if(result.hasOwnProperty(assetTableKey)){
        //if(result[assetTableKey].hasOwnProperty("features")) {
        //if(result.hasOwnProperty("features")) {
        for(var featureKey in result){
            if(result.hasOwnProperty(featureKey)){
                var path = featureKey + "/";
                //console.log(featureKey);

                var ref = new Firebase("https://teammedy.firebaseio.com/Assets/AllServices/2/features/" + featureKey + "/");
                var featureRef = ref.child("feedback");

                featureRef.set({
                    ratings:{},
                    meanRating: 0
                });
            }
        }
        //}
        //}
        //}
    });
}

function addFullURL(){
    console.log("add full URL path");
    var myFirebaseRef = new Firebase("https://teammedy.firebaseio.com/Assets/AllServices/1/features/");
    myFirebaseRef.orderByKey().startAt("0").endAt("1000").once("value", function(snapshot) {
        result = snapshot.val();
        //var path = "";
        //for(var assetTableKey in result){
        //if(result.hasOwnProperty(assetTableKey)){
        //if(result[assetTableKey].hasOwnProperty("features")) {
        //if(result.hasOwnProperty("features")) {
        for(var featureKey in result){
            if(result.hasOwnProperty(featureKey)){
                var path = featureKey + "/";
                //console.log(featureKey);

                var ref = new Firebase("https://teammedy.firebaseio.com/Assets/AllServices/1/features/");
                var featureRef = ref.child(featureKey);

                //console.log("https://teammedy.firebaseio.com" + ref.path + "/" + featureKey);
                featureRef.update({
                    URL: "https://teammedy.firebaseio.com" + ref.path + "/" + featureKey
                });
            }
        }
        //}
        //}
        //}
    });
}


/*
exports.replacePolygons = function(){
    var myFirebaseRef = new Firebase("https://teammedy.firebaseio.com/");
    myFirebaseRef.child("Assets/AllServices/3/features").limitToFirst(1000).once("value", function(snapshot) {
        result = snapshot.val();
        //var path = "";
        //for(var assetTableKey in result){
            //if(result.hasOwnProperty(assetTableKey)){
                //if(result[assetTableKey].hasOwnProperty("features")) {
                //if(result.hasOwnProperty("features")) {
                    for(var featureKey in result){
                        if(result.hasOwnProperty(featureKey)){
                            var path = featureKey + "/";
                            console.log(path);

                            if (result[featureKey].hasOwnProperty("geometry")) {
                                if (result[featureKey]["geometry"].hasOwnProperty("type")) {
                                    if (result[featureKey]["geometry"]["type"] == "Polygon") {
                                        //console.log("converting polygon...")
                                        if (result[featureKey]["geometry"].hasOwnProperty("coordinates")) {
                                            if (result[featureKey]["geometry"]["coordinates"].hasOwnProperty("0")) {
                                                var polyPoints = result[featureKey]["geometry"]["coordinates"]["0"];
                                                var pointOne = polyPoints[0];
                                                var pointTwo = polyPoints[parseInt(polyPoints.length / 2)];
                                                var pointMid = midPoint(pointOne[1], pointOne[0], pointTwo[1], pointTwo[0]);

                                                var ref = new Firebase("https://teammedy.firebaseio.com/Assets/AllServices/3/features/" + path);
                                                var featuresRef = ref.child("geometry");
                                                featuresRef.set({
                                                    coordinates:{
                                                        0: pointMid[1],
                                                        1: pointMid[0],
                                                        2: 0
                                                    },
                                                    type: "Point"
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                //}
            //}
        //}
    });
}
*/

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
}

function midPoint(lat1, lon1, lat2, lon2){

    var dLon = toRad(lon2 - lon1);

    //convert to radians
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);
    lon1 = toRad(lon1);

    var Bx = Math.cos(lat2) * Math.cos(dLon);
    var By = Math.cos(lat2) * Math.sin(dLon);
    var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
    var lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

    //print out in degrees
    return([toDeg(lat3), toDeg(lon3)]);
}

function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}

function toDeg(Value) {
    /** Converts radians to numeric degrees */
    return Value / Math.PI * 180;
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] == obj) {
            return true;
        }
    }
    return false;
}
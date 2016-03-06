/**
 * Created by Yuxibro on 16-03-05.
 */


$( document ).bind( 'pageinit', function(){
    $.mobile.loader.prototype.options.text = "loading";
    $.mobile.loader.prototype.options.textVisible = false;
    $.mobile.loader.prototype.options.theme = "a";
    $.mobile.loader.prototype.options.html = "";
});
// page handler
$(document).on("pageinit",function(){
    google.maps.event.addDomListener(window, "load", initMap);
    $("#checkbox-favourite").click(function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation()
        //alert(event.target.tagName)
        getFavourites(current_user.auth.uid, 100, function(favourites){
            console.log(favourites.indexOf(featureRefURL))
            if(favourites.indexOf(featureRefURL)!=-1){
                removeFavourite(featureRefURL, current_user.auth.uid);
                console.log(featureRefURL + " removed from favourites.")
                // if adding, just do nothing as favourite already exists
            }
            else{
                console.log("reached here")
                removeFavourite2(featureRefURL, current_user.auth.uid, addFavourite)
                console.log(featureRefURL + " added to favourites.")
            }
        });
    });
})



function checkUserLogin(pageId,cb){
    var ref = new Firebase("https://teammedy.firebaseio.com");
    var authData = ref.getAuth();
    if (authData) {
        console.log("login page");
        var ref = new Firebase("https://teammedy.firebaseio.com");
        var authData = ref.getAuth();
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        console.log(authData);
        current_user = new User(getEmail(authData),authData.uid,authData.token,
            authData.auth.provider,getAuthName(authData),getProfileImageURL(authData));
        if(pageId=="login" ||pageId=="sign_up" ){
            console.log("user already logged in Log in");
            navToPageWithTransition("nearby","slidedown")
        }
        if(cb!=undefined){cb()}
    } else {
        // TODO: Uesr logged out, direct to login page
        current_user = null;
        if(pageId!="login"){
            console.log("User is logged out. Navigate to Login page");
            navToPageWithTransition("login","slideup")
        }
    }

    // GPS location handle
    function initCB(pos){
        myLat = pos.coords.latitude;
        myLong = pos.coords.longitude;
        located = true;
    }
    if(located){

    }else{
        console.log("find my lat");
        navigator.geolocation.getCurrentPosition(initCB, error, options);
    }
}

$(document).on('pagecontainershow', function(e, ui) {
    var pageId = $('body').pagecontainer('getActivePage').prop('id');
    //console.log(pageId);
    switch(pageId){
        case "login":
            checkUserLogin(pageId);
            break;
        case "profile":
            checkUserLogin("profile",function(){
                if (current_user.auth.profileImageURL===null)
                    current_user.auth.profileImageURL="https://www.watch2gether.com/assets/w2guser-default-4cd04e39cfd59017ebad065028b8af9dfca8499a45a7b19ec20b1c478a751a77.png"
                else{
                    $('#profileImage').attr("src",current_user.auth.profileImageURL)
                    $(".profileName h3").html(current_user.auth.name)
                    getHistory(current_user.auth.uid, 100, function(history){
                        //console.log($($('#history_list').children()[0]).html('<a href="#">Acura</a>'))
                        //console.log($("#history_button1").children())
                        //$("#history_button1").html(history[0]);
                        //$("#history_button1").listview( "refresh" );
                       // $("#history_list").listview( "refresh" );
                        $('#history_list').empty()
                        var btnCount = 0
                        var maxBtn = Math.min(3,history.length);
                        [0,1,2].forEach(function(item,index,array){
                            if(history[index]!=undefined){
                                getFeatureByURL(history[index],function(feature){
                                    var name = ""
                                    if(feature.properties.hasOwnProperty("NAME")){
                                        name = feature.properties["NAME"]
                                    }else if(feature.properties.hasOwnProperty("ASSET_TYPE")){
                                        name = feature.properties["ASSET_TYPE"]
                                    }else if(feature.properties.hasOwnProperty("PARCEL_LOCATION")){
                                        name = feature.properties["PARCEL_LOCATION"]
                                    }
                                    var btn_html = '<li><a id="history_button'+(index)+'" data-btn-URL="'+feature.URL+'" href="#positionWindow" data-rel="popup" data-role="button"data-position-to="window" data-transition="flip" class="history_cell">'+name+'</a></li>'
                                    $("#history_list").append(btn_html);
                                    console.log(btn_html);
                                    console.log(feature);
                                    //$("#history_button1").attr("data-btn-URL","123321")
                                    $("#history_list").listview("refresh")
                                })
                            }
                        })
                    })
                }
            });


            break;
        case "mdb":
            checkUserLogin(pageId);
            /*
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981", current_user.auth.name, "life is hard01");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981", current_user.auth.name, "life is hard02");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981", current_user.auth.name, "life is hard03");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981", current_user.auth.name, "life is hard04");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981", current_user.auth.name, "life is hard05");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981", current_user.auth.name, "life is hard06");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981", current_user.auth.name, "life is hard07");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981", current_user.auth.name, "life is hard08");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981", current_user.auth.name, "life is hard09");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981", current_user.auth.name, "life is hard10");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981", current_user.auth.name, "life is hard11");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981", current_user.auth.name, "life is hard12");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981", current_user.auth.name, "life is hard13");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981", current_user.auth.name, "life is hard14");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981", current_user.auth.name, "life is hard15");
            */
            getComments("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", 10, function(comments){
                console.log(comments);
            })
            //addHistory("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1975",current_user.auth.uid);
            //addHistory("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1976",current_user.auth.uid);
            //addHistory("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1977",current_user.auth.uid);
            //addHistory("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1976",current_user.auth.uid);
            //console.log(current_user.auth.uid);
            addFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1980",current_user.auth.uid);
            //addFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1971",current_user.auth.uid);
            //addFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1964",current_user.auth.uid);
            //removeFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1980",current_user.auth.uid);
            //addFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1980",current_user.auth.uid);
            //addFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1980",current_user.auth.uid);
            //removeFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1971",current_user.auth.uid);
            //removeFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1964",current_user.auth.uid);
            getHistory(current_user.auth.uid, 100, function(history){
                console.log(history)
            })

            /*
            getFavourites(current_user.auth.uid, 100, function(favourites){
                console.log(favourites)
                console.log(favourites.indexOf("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1964"))
                if(favourites.indexOf("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1964")!=-1){
                    removeFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1964",current_user.auth.uid);
                    console.log("Feature 1964 removed.")
                    // if adding, just do nothing as favourite already exists
                }
                else{
                    addFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1964",current_user.auth.uid);
                    console.log("Feature 1964 added.")
                }
                //removeFavourite(current_user.auth.uid, favourites[0].
            });
            */

            getFavourites(current_user.auth.uid, 100, function(favourites){
                console.log(favourites);
            })

            getFeatureByURL("https://teammedy.firebaseio.com/Assets/AllServices/0/features/100", function(feature){
                console.log(feature);
            })

            //addFullURL();
            break;
        case "nearby":
            checkUserLogin(pageId);
            // Get nearest 10 locations and draw on map
            $.mobile.loading( "show", {
                text: "Loading",
                textVisible: " " ,
                theme: "b",
                textonly: false,
                html: ""
            });
            all(true, function(result){
                console.log("all results: " + result.length)
                filterByCategory(result, true, true, true, true, function(result){
                    //console.log("final " + result.length + "\n" +  result);
                    filterByNearest(result, 10, function(result){
                        console.log(result.length + " landmarks found");
                        google.maps.event.trigger(map, 'resize');
                        map.setCenter(initialLocation)
                        map.setZoom(15)
                        drawJSONList(result);
                        $.mobile.loading( "hide" );
                    })
                });
            })
            break;
        case "discover":
            checkUserLogin(pageId);
            refreshFavList()
            break;
        default :
            console.log("not handled pageid: "+pageId );
    }
});
var refreshFavList = function(){
    var el = document.getElementById("favourites-listview");
    if (el) {
        while (el.hasChildNodes()) {
            el.removeChild(el.childNodes[0]);
        }
    }
    getFavourites(current_user.auth.uid, 10, function(favourites){
        favourites.forEach(function(favourite,index,array) {
            getFeatureByURL(favourite, function(feature){
                console.log(feature);
                var name = ""
                if(feature.properties.hasOwnProperty("NAME")){
                    name = feature.properties["NAME"]
                }else if(feature.properties.hasOwnProperty("ASSET_TYPE")){
                    name = feature.properties["ASSET_TYPE"]
                }else if(feature.properties.hasOwnProperty("PARCEL_LOCATION")){
                    name = feature.properties["PARCEL_LOCATION"]
                }
                var btn_html = '<li><a id="history_button'+(index)+'" data-btn-URL="'+feature.URL+'" href="#positionWindow" data-rel="popup" data-role="button"data-position-to="window" data-transition="flip" class="history_cell">'+name+'</a></li>'
                $("#favourites-listview").append(btn_html);
                console.log(btn_html);
                console.log(feature);
                //$("#history_button1").attr("data-btn-URL","123321")
                $("#favourites-listview").listview("refresh")
                /*if(feature["properties"].hasOwnProperty("NAME")){
                 $('#favourites-listview').append(
                 '<li data-theme="c">' +
                 '<a href="#positionWindow" data-rel="popup" data-role="button" data-position-to="window" data-transition="flip" class="landmarkPopUpBtn">' +
                 feature["properties"]["NAME"] +
                 '</a>' +
                 '</li>'
                 );
                 }
                 else if(feature["properties"].hasOwnProperty("ASSET_TYPE")){
                 $('#favourites-listview').append(
                 '<li data-theme="c">' +
                 '<a href="#positionWindow" data-rel="popup" data-role="button" data-position-to="window" data-transition="flip" class="landmarkPopUpBtn">' +
                 feature["properties"]["ASSET_TYPE"] +
                 '</a>' +
                 '</li>'
                 );
                 }*/
            });
        });
    });
}

// MARK: UI Listener

$(document).ready(function() {
    $("#positionWindow").bind({
       popupafteropen: function(event, ui){setFavouriteCheckbox()}
    });
    $( function() {
        $( "#positionWindow" ).enhanceWithin().popup();
    });
    $('.FBLogin').tap(function(){
        var ref = new Firebase("https://teammedy.firebaseio.com");
        ref.authWithOAuthPopup("facebook", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                // console.log("Authenticated successfully with payload:", authData);
                var loginUser = new User("N/A",authData.uid,authData.token,authData.provider,getAuthName(authData),getProfileImageURL(authData));
                handleSignInWithUserData(loginUser);
            }
        });
    })
    $("#login_btn").tap(function(){
        login($("#un_login").val(),$("#pw_login").val())
    })
    $('#signUp_confirm_btn').tap(function(){
        signUp($("#un_signup").val(),$("#pw_signup").val())
    })
    $('#logout').tap(function(){
        var ref = new Firebase(medyRootRefURL);
        ref.unauth();
        ref.onAuth(authDataCallback);
    })
    $("#history_list").on("tap",".history_cell",function(e){
        console.log("111", e.target.getAttribute("data-btn-url"));
        popUpWithURL(e.target.getAttribute("data-btn-url"))
    })
    $( "#positionWindow" ).bind({
        popupafterclose: function(event, ui) { refreshFavList() }
    });
    $("#favourites-listview").on("tap",".history_cell",function(e){
        console.log("111", e.target.getAttribute("data-btn-url"));
        popUpWithURL(e.target.getAttribute("data-btn-url"))
    })
    $("#comment_submit").tap(function(){
        addComment(featureRefURL,current_user.auth.name,$('#comment').val())
        $("#description_block").slideToggle(resizeSatMap)
        $("#comment_block").slideToggle(resizeSatMap)
        getComments(featureRefURL,3,function(comments){
            //console.log(comments);
            var commentsHTML = ""
            comments.forEach(function(itr){
                console.log(itr);
                commentsHTML+='<b style="margin-left:2em;">'+itr.name.split(" ")[0]+'</b>: '+itr.comment+"</br>";
            })
            $('#feature_comment').html("Comments:<br/>"+commentsHTML);
        })
    })
    $("#leave_comment").tap(function(){
        //$('#description_block').html('').trigger("create");
        /*console.log($("#description_block").is(":visible"));
        console.log($("#comment_block").is(":visible"));*/
        $("#description_block").slideToggle(resizeSatMap)
        $("#comment_block").slideToggle(resizeSatMap)
    })
    var resizeSatMap = function(){
        google.maps.event.trigger(satelliteMap, 'resize');
    }
    $("#comment_cancel").tap(function(){
        $("#description_block").slideToggle(resizeSatMap)
        $("#comment_block").slideToggle(resizeSatMap)
    })

    function popUpWithURL(URL){
        //var ref = new Firebase("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1980");
        var tempURL = URL;
        featureRefURL = tempURL
        getFeatureByURL(tempURL,function(feature){
            console.log(feature);
            updateLandmarkWithFeature(feature)
            setSatelliteMapCenter(feature.geometry.coordinates["1"],feature.geometry.coordinates["0"]);
        })
    }
    $(".landmarkPopUpBtn").tap(function(){
        //var ref = new Firebase("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1980");
        var tempURL = "https://teammedy.firebaseio.com/Assets/AllServices/3/features/1981";
        featureRefURL = tempURL
        getFeatureByURL(tempURL,function(feature){
            console.log(feature);
            updateLandmarkWithFeature(feature)
            setSatelliteMapCenter(feature.geometry.coordinates["1"],feature.geometry.coordinates["0"]);
        })
    })


    $("#refreshNearby").tap(function(){
        google.maps.event.trigger(satelliteMap, 'resize');
        map.setCenter(initialLocation)
    })


    $("#directionsBtn").tap(function(){

        getFeatureByURL(featureRefURL,function(feature){

            var lat = feature.geometry.coordinates["1"]
            var lng = feature.geometry.coordinates["0"]
            var mapLink;

            // iDevice link
            if( (navigator.platform.indexOf("iPhone") != -1)
                || (navigator.platform.indexOf("iPod") != -1)
                || (navigator.platform.indexOf("iPad") != -1)){

                mapLink = "http://maps.apple.com/?saddr=" + initialLocation.lat() + "," + initialLocation.lng() + "&daddr=" + lat + "," + lng + "&dirflg=d"
                //alert("iDevice - opening link: " + mapLink)
                window.location = mapLink
            }
            else if (navigator.userAgent.match(/Android/i)){
                mapLink = "http://maps.google.com/maps?saddr=" + initialLocation.lat() + "," + initialLocation.lng() + "&daddr="+ lat + "," + lng + "&amp;ll="
                //alert("android - opening link: " + mapLink)
                window.location = mapLink
            }
            else{
                mapLink = "http://maps.google.com/maps?saddr=" + initialLocation.lat() + "," + initialLocation.lng() + "&daddr="+ lat + "," + lng + "&amp;ll="
                //alert("web - opening link: " + mapLink)
                window.open(mapLink)
            }

        })




    })



    function authDataCallback(authData) {
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
        } else {
            console.log("User is logged out manually");
            navToPageWithTransition("login","slideup");
            var ref = new Firebase(medyRootRefURL);
            ref.offAuth(authDataCallback);
        }
    }
});
function updateLandmarkWithFeature(feature){
    $('#feature_comment').html("Comments:");
    if(feature.properties.hasOwnProperty("NAME")){
        $("#feature_name").html(feature.properties["NAME"]);
    }else if(feature.properties.hasOwnProperty("ASSET_TYPE")){
        $("#feature_name").html(feature.properties["ASSET_TYPE"]);
    }else if(feature.properties.hasOwnProperty("PARCEL_LOCATION")){
        $("#feature_name").html(feature.properties["PARCEL_LOCATION"]);
    }
    addHistory(feature.URL,current_user.auth.uid);

    var featureLocation = new google.maps.LatLng(feature.geometry.coordinates["1"],feature.geometry.coordinates["0"])

    //set distance
    $("#feature_distance").text("Distance: " + getDistance(initialLocation, featureLocation) + " km")

    //set ETA
    getTravelTime(initialLocation,featureLocation).then(function(response){

        //DO WORK
        $("#feature_ETA").text("ETA: " + response)

    }, function(error){
        console.log("failed to get ETA")
    })


    getComments(feature.URL,3,function(comments){
        //console.log(comments);
        var commentsHTML = ""
        comments.forEach(function(itr){
            console.log(itr);
            commentsHTML+='<b style="margin-left:2em;">'+itr.name.split(" ")[0]+'</b>: '+itr.comment+"</br>";
        })
        $('#feature_comment').html("Comments:<br/>"+commentsHTML);
    })
}

function navToPageWithTransition(pageID,transition){
    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#"+pageID, { role: "page",transition:transition } );
}

$(function(){
    $( "#popup-outside-page" ).enhanceWithin().popup();
});
function openLandmarkDetailView(){
    $( "#popup-outside-page").popup("open");
}

function setFavouriteCheckbox(){
    getFavourites(current_user.auth.uid, 100, function(favourites){
        if(favourites.indexOf(featureRefURL)!=-1){
            console.log("feature is favourited")
            $("#checkbox-favourite").prop('checked', true).checkboxradio('refresh');
        }
        else{
            console.log("feature is NOT favourited")
            $("#checkbox-favourite").prop('checked', false).checkboxradio('refresh');
        }
    });
}

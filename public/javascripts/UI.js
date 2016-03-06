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


})



function checkUserLogin(pageId){
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
    } else {
        // TODO: Uesr logged out, direct to login page
        current_user = null;
        if(pageId!="login"){
            console.log("User is logged out. Navigate to Login page");
            navToPageWithTransition("login","slideup")
        }
    }
}

$(document).on('pagecontainershow', function(e, ui) {
    var pageId = $('body').pagecontainer('getActivePage').prop('id');
    //console.log(pageId);
    switch(pageId){
        case "login":
            checkUserLogin(pageId);
            if (current_user) {
                $.mobile.navigate("#profile");
            }
            break;
        case "profile":
            checkUserLogin();
            if (current_user.auth.profileImageURL===null)
                current_user.auth.profileImageURL="https://www.watch2gether.com/assets/w2guser-default-4cd04e39cfd59017ebad065028b8af9dfca8499a45a7b19ec20b1c478a751a77.png"

            $('#profileImage').attr("src",current_user.auth.profileImageURL)
            console.log(current_user.auth.profileImageURL)
            $(".profileName h3").html(current_user.auth.name)

            break;
        case "mdb":
            checkUserLogin(pageId);

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

            getComments("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", 10, function(comments){
                console.log(comments);
            })
            //console.log(current_user.auth.uid);
            addFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1980",current_user.auth.uid);
            addFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1971",current_user.auth.uid);
            addFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1964",current_user.auth.uid);
            //removeFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1980",current_user.auth.uid);
            //addFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1980",current_user.auth.uid);
            //addFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1980",current_user.auth.uid);
            //removeFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1971",current_user.auth.uid);
            //removeFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1964",current_user.auth.uid);
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
            break;
        case "nearby":
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
            break;
        default :
            console.log("not handled pageid: "+pageId );
    }
});


// MARK: UI Listener

$(document).ready(function() {
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

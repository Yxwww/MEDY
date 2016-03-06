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
            /*
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", "3aa66d34-f212-4d31-8743-3b528f783901", "life is hard01");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", "3aa66d34-f212-4d31-8743-3b528f783902", "life is hard02");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", "3aa66d34-f212-4d31-8743-3b528f783903", "life is hard03");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", "3aa66d34-f212-4d31-8743-3b528f783904", "life is hard04");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", "3aa66d34-f212-4d31-8743-3b528f783905", "life is hard05");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", "3aa66d34-f212-4d31-8743-3b528f783906", "life is hard06");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", "3aa66d34-f212-4d31-8743-3b528f783907", "life is hard07");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", "3aa66d34-f212-4d31-8743-3b528f783908", "life is hard08");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", "3aa66d34-f212-4d31-8743-3b528f783909", "life is hard09");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", "3aa66d34-f212-4d31-8743-3b528f783910", "life is hard10");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", "3aa66d34-f212-4d31-8743-3b528f783911", "life is hard11");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", "3aa66d34-f212-4d31-8743-3b528f783912", "life is hard12");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", "3aa66d34-f212-4d31-8743-3b528f783913", "life is hard13");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", "3aa66d34-f212-4d31-8743-3b528f783914", "life is hard14");
            addComment("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", "3aa66d34-f212-4d31-8743-3b528f783915", "life is hard15");
            */
            getComments("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985", 10, function(comments){
                console.log(comments);
            })
            //console.log(current_user.auth.uid);
            addFavourite("https://teammedy.firebaseio.com/Assets/AllServices/3/features/1985",current_user.auth.uid);
            getFavourites(current_user.auth.uid, 10, function(favourites){
                console.log(favourites);
            });
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
        default :
            console.log("not handled pageid: "+pageId );
    }
});


// MARK: UI Listener

$(document).ready(function() {
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

    //TODO: port functionality to the map popups
    $("#landmarkPopUpBtn").tap(function(){
        console.log(" ");

        //hardcoded for now
        setSatelliteMapCenter(51.0770331,-114.1380119)

        //TODO: use landmark being selected rather than the oval
        var olyOval = new google.maps.LatLng(51.0770331,-114.1380119)

        //update distance
        $("#landmarkDistance").text("Distance: " + getDistance(initialLocation, olyOval) + " km")

        //TODO: RUN THIS WHEN POPUP POPS UP
        //var calg = new google.maps.LatLng(51.0453 ,-114.0581)
        //var ed = new google.maps.LatLng(53.5333,-113.5000)

        //alert("promise result = " + getTravelTime(calg,ed))

        getTravelTime(initialLocation,olyOval).then(function(response){
            //alert("my response = " + response)

            //DO WORK
            $("#landmarkTravelTime").text("ETA: " + response)


        }, function(error){
            alert("failed")
        })


        //TODO: set landmark's name

    })

    $("#refreshNearby").tap(function(){
        google.maps.event.trigger(satelliteMap, 'resize');
        map.setCenter(initialLocation)
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
function navToPageWithTransition(pageID,transition){
    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#"+pageID, { role: "page",transition:transition } );
}

$(function(){
    $( "#popup-outside-page" ).enhanceWithin().popup();
});
function openLandmarkDetailView(){
    $( "#popup-outside-page").popup("open");
}



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
            console.log("profile page");
            // Sync with User data

            // Get nearest 10 locations and draw on map
            all(true, function(result){
                console.log("all results: " + result.length)
                filterByCategory(result, true, true, true, true, function(result){
                    //console.log("final " + result.length + "\n" +  result);
                    filterByNearest(result, 10, function(result){
                        console.log(result.length + " landmarks found");
                        drawJSONList(result);
                    })
                });
            })
            break;
        case "mdb":
            addFeedbackStructure();
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
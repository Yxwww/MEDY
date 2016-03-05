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


function checkUserLogin(){
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
        console.log("User is logged out");
        // TODO: Uesr logged out, direct to login page
        current_user = null;
        $.mobile.navigate("#login");
    }
}

$(document).on('pagecontainershow', function(e, ui) {
    var pageId = $('body').pagecontainer('getActivePage').prop('id');
    //console.log(pageId);
    switch(pageId){
        case "login":
            checkUserLogin();
            if (current_user) {
                $.mobile.navigate("#profile");
            }
            break;
        case "profile":
            checkUserLogin();
            console.log("profile page");
            // Sync with User data
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
                var loginUser = new User("N/A",authData.uid,authData.token,authData.provider,getAuthName(authData));
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
            console.log("User is logged out");
            $.mobile.navigate("#login");
        }
    }

});
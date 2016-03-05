/**
 * Created by Yuxibro on 16-03-03.
 */
var current_user;
var medyRootRefURL= "https://teammedy.firebaseio.com/"
var user_ref;
function User(email,uid,token,provider,name,profileImageURL) {
    this.auth = {};
    this.auth["email"]= email
    this.auth["uid"] = uid
    this.auth["token"] = token
    this.auth["provider"]= provider
    this.auth["name"] = name
    this.auth["profileImageURL"] = profileImageURL
    this.data = null;
}
function signUp(email,password) {
    var ref = new Firebase("https://teammedy.firebaseio.com/");
    ref.createUser({
        email: email,
        password: password
    }, function (error, userData) {
        if (error) {
            console.log("Error creating user:", error);
            alert("Error: The specified email address is invalid.");
            //if(error.contains("email"))
        } else {
            console.log("Successfully created user account with uid:", userData.uid);
            //Login this person in
            login(email,password);
        }
    });
};
function login(email,password){
    var ref = new Firebase("https://teammedy.firebaseio.com/");
    ref.authWithPassword({
        email    : email,
        password : password
    }, function(error, authData) {
        if(error!=null){
            alert("login error: "+ error)
        }else{
            // Logged In
            var loginUser = new User(getEmail(authData),authData.uid,authData.token,
                authData.auth.provider,getAuthName(authData),getProfileImageURL(authData));
            handleSignInWithUserData(loginUser)
        }
    }, {remember: "sessionOnly"});
}
//login()
function handleSignInWithUserData(user){
    user_ref = new Firebase("https://teammedy.firebaseio.com/users").child(user.auth.uid)
    user_ref.orderByKey().on("value", function(snapshot) {
        console.log(snapshot.val())
        if(snapshot.val()==null){
            // if user doesn't exist, we make a new user
            user_ref.set({
                provider: user.auth.provider,
                email: user.auth.email,
                name: user.auth.name,
                profileImageURL: user.auth.profileImageURL
            })
        }else{
            //we have user data
            user.data = snapshot.val();
            console.log(user);
        }
        $.mobile.navigate("#profile");
    });

}

//signUp("130@126.com","123")
function getAuthName(authData) {
    switch (authData.provider) {
        case 'password':
            return authData.password.email.replace(/@.*/, '');
        case 'twitter':
            return authData.twitter.displayName;
        case 'facebook':
            return authData.facebook.displayName;
    }
}
function getProfileImageURL(authData) {
    switch (authData.provider) {
        case 'password':
            return null
        case 'twitter':
            return null
        case 'facebook':
            return authData.facebook.profileImageURL;
    }
}

function getUserData(user,callback){
    var user_ref= new Firebase("https://teammedy.firebaseio.com/users").child(user.auth.uid)
    user_ref.on("value", function(snapshot) {
        console.log(snapshot.val())
        if(snapshot.val()==null){
            console.log("WHAT??");
        }else{
            //we have user data
            current_user.data = snapshot.val();
            console.log(user);
        }
    });
}

function getEmail(authData,callback){
    switch (authData.provider) {
        case 'password':
            return authData.password.email
        case 'twitter':
            return null
        case 'facebook':
            return null;
    }
}

/**
 * Created by Yuxibro on 16-03-03.
 */
var current_user;
var user_ref;
function User(email,uid,token,provider) {
    this.auth = {};
    this.auth["email"]= email
    this.auth["uid"] = uid
    this.auth["token"] = token
    this.auth["provider"]= provider
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
            console.log("login error: "+ error);
        }else{
            // Logged In
            var loginUser = new User(authData.password.email,authData.uid,authData.token,
                authData.auth.provider);
            console.log(loginUser);         // update Current User
            current_user = loginUser;       // update Current User
            user_ref = new Firebase("https://teammedy.firebaseio.com/users").child(current_user.auth.uid)
            user_ref.orderByKey().on("value", function(snapshot) {
                if(snapshot.val()==null){
                    user_ref.set({
                        provider: current_user.auth.provider,
                        email: current_user.auth.email,
                        name: getAuthName(authData)
                    })
                }else{
                    current_user.data = snapshot.val();
                    console.log(current_user);
                }
            });
        }
    }, {remember: "sessionOnly"});
}
//login()

signUp("130@126.com","123")
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

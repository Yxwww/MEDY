var express = require('express');
var router = express.Router();
var path = require("path");
var Firebase = require("firebase");
var rootRef = new Firebase("https://teammedy.firebaseio.com/");
/*var FirebaseTokenGenerator = require("firebase-token-generator");
var tokenGenerator = new FirebaseTokenGenerator("P1NNxTdiiOUiIe4NnFsBaac9G3w1zSEy7KsJ8jPv");
var token = tokenGenerator.createToken({ uid: "uniqueId1", some: "arbitrary", data: "here" });
*/
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
    res.sendFile(path.resolve(__dirname+"/../views/medy.html"));
    //console.log(__dirname+"../views/medy.html");
});

module.exports = router;

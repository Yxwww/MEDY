var express = require('express');
var router = express.Router();
var path = require("path");
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
    res.sendFile(path.resolve(__dirname+"/../views/medy.html"));
    //console.log(__dirname+"../views/medy.html");
});

module.exports = router;

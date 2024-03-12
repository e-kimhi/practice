var express = require('express');
var router = express.Router();

var login_controller = require("../controllers/loginController");
var User = require("../models/user")
var {roles} = require("../models/roles")
var {requireRole} = require("./authorization_functions");
// const admin = toString(userRoles.ADMIN);


/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('users home');
  res.render("user_home", {
    title: "User Home Page",
    message: "",
  })
});

router.get('/restricted', requireRole(roles.ADMIN), function(req, res, next) {
  // res.send('users home');
  res.render("user_home", {
    title: "User Restricted Page",
    message: "Hello Authorized User",
  })
});

router.get('/login',login_controller.login_get);

router.post('/login', login_controller.login_post);

router.get('/register', login_controller.register_get);

router.post('/register',login_controller.register_post);

module.exports = router;

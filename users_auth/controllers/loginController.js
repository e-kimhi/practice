const User = require("../models/user");
var bcrypt = require('bcrypt')
var { body, validationResult } = require("express-validator")
var asyncHandler = require("express-async-handler")
var {createAuthToken} = require("./service_functions")


exports.login_get = (req, res, next) => {
    res.render("login", { title: "Login" });
  };

exports.login_post = [
    body("user_name")
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("email")
    .trim()
    .isEmail()
    .escape()
    .withMessage("email format error"),
  body("password")
  .trim()
  .isLength({ min: 8 })
  .escape()
  .withMessage("password too short"),
  
  asyncHandler(async (req, res, next) => {
   // Extract the validation errors from a request.
   const errors = validationResult(req);

   const user = new User({
    name: req.body.user_name,
    email: req.body.email,
   })

   if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render("login", {
            title: "Login",
            user: user,
            errors: errors.array(),
        }); 
        // return;  
    }else{
    
        var password = req.body.password;
        var verified = false;

        if(user.name.length >0 || user.email.length >0)
        {
                if(password.length >7)
                {
                    try {
                        user.password = password
                        
                        const verified = await verifyUser(user)
                        if(verified){
                            const token = createAuthToken(user);
                            //res.redirect('/users').message("user login successfully");
                            res.render("user_home", {
                                title: "User Home Page",
                                message: "user login successfully",
                                token: token,
                            })
                        }
                        else{
                            user.password = '';
                            res.render("login", {
                                title: "login",
                                user: user,
                            });                    
                        }
                    } catch (err) {
                        return res.status(400).json({ message: err.message })
                    }
                }
        }
        }

  })
]

exports.register_get = (req, res, next) => {
    res.render("login", { title: "Register" });
  };

exports.register_post = [
    body("user_name")
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("email")
    .trim()
    .isEmail()
    .escape()
    .withMessage("email format error"),
  body("password")
  .trim()
  .isLength({ min: 8 })
  .escape()
  .withMessage("password too short"),
  
  asyncHandler(async (req, res, next) => {
   // Extract the validation errors from a request.
   const errors = validationResult(req);

   const user = new User({
    name: req.body.user_name,
    email: req.body.email,
   })

   if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render("login", {
            title: "Login",
            user: user,
            errors: errors.array(),
        }); 
       
    }else{

        var password = req.body.password;
        
        if(user.name.length > 2 && user.email.length > 4 && password.length > 7)
        {
            try {
                // save the user if he doesn't exist
                var foundUser = await userExists(user)
                if(!foundUser){
                    const salt = await bcrypt.genSalt(10)
                    const en_password = await bcrypt.hash(password, salt)
                    user.password = en_password
                    user.salt = salt

                    await user.save();
                    // Redirect to new author record.
                    res.redirect('/users').message("user registered successfully");
                   
                } else {
                    user.password = ''
                    user.salt = ''
                    var msg = "user already exists"

                    res.render("login", {
                        title: "Register",
                        user: user,
                        message: msg,
                    });                    
                }
            } catch (err) {
                return res.status(400).json({ message: err.message })
            }
                
        }
    }

  })
];


async function verifyUser(user)   { 
    if(user){
        var useEmail = user.email.length ? true:false;
        var useName = user.name.length >0 ? true:false;
        var passwordExiists = user.password.length ? true:false
        var foundUser = null
        
        if((useEmail || useName) && passwordExiists)
        {
            if(useName){
                foundUser = await User.findOne({name: user.name})
                if (foundUser === null)
                    foundUser = await User.findOne({email: user.email})
            }
        }

        if(foundUser != null){
            var newPW = await bcrypt.hash(user.password, foundUser.salt)
            if(newPW === foundUser.password)
                return true
        }
        
        return false
    }
}

async function userExists(user)   {
    var userFound = false 
    if(user){
        var foundUser = await User.findOne({name: user.name})
        if(foundUser != null)
            userFound = true
        else{
            foundUser = await User.findOne({email: user.email})
            if(foundUser != null)
                userFound = true
        }
    }
    return userFound
}


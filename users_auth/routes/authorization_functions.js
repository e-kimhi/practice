var User = require("../models/user")
const {roles} = require("../models/roles");
const jwt = require("jsonwebtoken");
const secretKey = process.env.TOKEN_KEY || "test1";

function requireRole(roles = []) {
  if (typeof roles === "string") {
      roles = [roles];
      console.log(roles);
    }

  return (req, res, next) => {

    // try to get the token from the Authorization header "Bearer"
    var jwttoken = req.headers['authorization'];
    if(jwttoken.startsWith("Bearer ")){
        var TokenArray = jwttoken.split(" ")
        token = TokenArray[1];
    }

    // try to get the token from the body
    if(!token)
    {
        token = req.body.token;
    }

    // If the token is present
    if(token){
        // Verify the token using jwt.verify method
        const decode = jwt.verify(token, secretKey);
        var role = decode.role;

        // check the role for access privileges
        if(role && roles.includes(role)){
            next();
        } 
        else {
            res.status(403).send('Access denied');
        }
        }else{
            res.status(403).send('Access denied');
        }
}
}



module.exports = {requireRole}
var User = require("../models/user")
const {roles} = require("../models/roles");

function requireRole(roles = []) {
  if (typeof roles === "string") {
      roles = [roles];
      console.log(roles);
    }

  return (req, res, next) => {
      if (req.body.role){
          if(roles.length && roles.includes(req.body.role) || !roles.length) {
          next();      
      } else {
          res.status(403).send('Access denied');
      }
    }else{
      res.status(403).send('Access denied');
    }
  };
}



module.exports = {requireRole}
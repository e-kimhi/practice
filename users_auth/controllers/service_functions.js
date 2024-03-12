const User = require("../models/user")
require('dotenv').config()

const jwt = require('jsonwebtoken');
const secretKey = process.env.TOKEN_KEY || "test1";


const createAuthToken = (user) => {
    const payload = { userId: user._id, role: user.role };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}



module.exports = {createAuthToken}
const mongoose = require('mongoose')
const Joi = require('joi')
const {roles} = require("./roles")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 100

    },
    salt: {
        type: String,
        required: true,
        min: 1,
        max: 100

    },
    role: {
        type: String,
        Enumerator: Object.values(roles),
        default: roles.USER
    }
});

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(100).required(),
        salt: Joi.string().min(1).max(100).required(),
        role: Joi.string().min(2).required()
    })
    return schema.validate(user)
};

function validateUser_1(user) {
    return true;
};


module.exports = mongoose.model('User', userSchema);
module.exports.vuser = validateUser;



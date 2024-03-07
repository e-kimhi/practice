const mongoose = require('mongoose')
const Joi = require('joi')

const UserRoles = {
    USER: 'user',
    ADMIN: 'admin'
};
const Permissions = {
    READ_POST: 'read_post',
    WRITE_POST: 'write_post'
};

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

    }
});

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(100).required(),
        salt: Joi.string().min(1).max(100).required()
    })
    return schema.validate(user)
}

module.exports.validate = validateUser
module.exports = mongoose.model('User', userSchema)

const Joi = require('joi');
const mongoose = require('mongoose');
// const {genreSchema} = require('./genre')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLenght: 5,
        maxLenght: 225
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLenght: 5,
        maxLenght: 225
    },
    password: {
        type: String,
        required: true,
        minLenght: 5,
        maxLenght:  1024
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    }
})
const User = mongoose.model('User', userSchema);
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(225).required(),
        email: Joi.string().min(5).max(225).required().email(),
        password: Joi.string().min(5).max(225).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().error(new Error('Confirm password must match password')),
        role: Joi.string().valid('customer','admin').empty("").default('customer')
    });
    return schema.validate(user)
    // return Joi.validate(user, schema)
}
exports.validate = validateUser;
exports.User = User
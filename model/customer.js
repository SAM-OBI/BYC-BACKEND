const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        minlength: 5,
        maxlength: 50
    },

    company: {
        type: String,
        minLength: 2,
        maxLength: 50,
        default: ""
    },

    phone: {
        type: String,
        required : true,
        minlength: 5,
        maxlength: 50,
        required : true,
    },
    address: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
    }

})

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        company: Joi.string().min(2).max(50).allow("",null),
        phone: Joi.string().min(5).max(50).required(),
        address: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        city: Joi.string().required(),
        email: Joi.string().email().optional(),
    }
    return Joi.validate(customer, schema)
}

exports.Customer = Customer;
exports.validate = validateCustomer;

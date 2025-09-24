const mongoose = require('mongoose')
const Joi  = require('joi')



const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name : String,
    image: String,
    price: Number,
    productNumber: String,
    color: [String],
    quantity:{
        type: Number,
        required: true,
        min: 1
    },
    subtotal: Number
});

const cartSchema = new  mongoose.Schema({
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    customerSnapshot:{
        name: String,
        email: String,
        phone: String,
        country: String,
        state: String,
        address: String,
        city: String,
        company: String
    },
    items:[
       cartItemSchema 
    ],
    totalAmount:{
        type: Number,
        required: true,
        default: 0
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    updatedAt:{
        type:Date,
        default: Date.now
    }

});

cartSchema.pre('save', function(next){
    this.totalAmount = this.items.reduce((acc,item) => acc + (item.price * item.quantity), 0);
    next();
});

const Cart = mongoose.model("cart", cartSchema)

function validateCart(cart){
    const schema = Joi.object({
        customerId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        customerSnapshot: Joi.object().keys({
            name:Joi.string().min(5).max(50).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().required(),
            country: Joi.string().required(),
            state: Joi.string().required(),
            address: Joi.string().required(),
            city: Joi.string().required(),
            company: Joi.string().allow(""),
        }),
        items: Joi.array().items(
            Joi.object().keys({
            productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            name: Joi.string().required(),
            image: Joi.string().required(),
            price: Joi.number().required(),
            productNumber: Joi.string().required(),
            subtotal: Joi.number().required(),
            quantity: Joi.number().required()

            }),
        ).min(1).required(),
        totalAmount: Joi.number().min(0),
        createdAt:  Joi.date(),
        updatedAt: Joi.date(),
    });
     return schema.validate(cart);
}


module.exports = {
    Cart,
    validate: validateCart,
    cartSchema
}
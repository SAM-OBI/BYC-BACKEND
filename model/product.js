const mongoose = require('mongoose')
const Joi  = require('joi');
const { categorySchema } = require('./category');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        minLenght: 5,
        maxLenght: 50
    },

    image:{
        type: String,
        required : true,
    },
    price: {
        type: String,
        required : true,
    },
    description:{
        type: String,
        required : true,
        minLenght: 10,
        maxLenght: 500
    },
    rating:{
        type: String,
        default: false
    },
    numberInStock:{
        type: Number,
        required : true,
        min: 0,
        max: 2000
    },
    productNumber:{
        type: String,
        required : true,
    },
    category: {
        type: categorySchema,
        required: true,
    },
    colors: [String],
    sizes: [String],
    reviews: [
        {
            customerId: String,
            name: String,
            rating: Number,
            comment: String,
            date: Date
        }
    ],

    

})
const Product = mongoose.model('Product', productSchema);
function validateProduct(product) {
    const reviewSchema = Joi.object({
        customerId: Joi.string().optional(),
        name: Joi.string().optional(),
        rating: Joi.number().min(0).max(5).optional(),
        comment: Joi.string().allow("").optional(),
        date: Joi.date().optional()
    });
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        image: Joi.string().required(),
        price: Joi.string().required(),
        description: Joi.string().min(10).max(500).required(),
        rating: Joi.string().optional(),
        numberInStock: Joi.number().min(0).max(2000).required(),
        productNumber: Joi.string().required(),
        categoryId: Joi.string().required(), // can map to your category._id
        colors: Joi.array().items(Joi.string()).optional(),
        sizes: Joi.array().items(Joi.string()).optional(),
        reviews: Joi.array().items(reviewSchema).optional()
    });
    return schema.validate(product);
}

// function validateProduct(product) {
//     const schema = {
//         name: Joi.string().min(5).max(50).required(),
//         image: Joi.string().required(),
//         price: Joi.string().required(),
//         description: Joi.string().min(10).max(500).required(),
//         rating: Joi.string(),
//         numberInStock: Joi.number().min(0).max(2000).required(),
//         productNumber: Joi.string().required(),
//         categoryId: Joi.string().required(),
//     }
//     return Joi.validate(product, schema)
// }
exports.Product = Product;
exports.validate = validateProduct;



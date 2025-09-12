const mongoose = require('mongoose')
const Joi  = require('joi')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        minLenght: 3,
        maxLenght: 50
    }
})
const Category = mongoose.model('Category', categorySchema);
function validateCategory(category) {
    const schema = {
        name: Joi.string().min(3).max(50).required()
    }
    return Joi.validate(category, schema)
}
exports.Category = Category;
exports.validate = validateCategory;
exports.categorySchema = categorySchema
const {Category, validate} = require('../model/category')
const express = require('express');
const router = express.Router()
const multer = require ("multer");
const cloudinary = require ("cloudinary").v2;
const streamifier = require("streamifier");
// const Category = require("../models/category"); 


// Cloudinary config from .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', async (req, res) => {
    const category = await Category.find().sort('name')
    res.send(category)
})

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error)  return res.status(400).json({ success: false, message: error.details[0].message })
    let category = new Category({
        name: req.body.name
    })
    category = await category.save()
    res.status(201).json({ success: true, data: category });
    // res.send(category)
})

router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, message: "Category updated successfully", category });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.delete('/:id', async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id)
    if(!category) return res.status(400).json({ success: false, message: 'The category with the given id not Found' });
    // res.send(category)
    res.status(200).json({ success: true, message: "Category deleted successfully" });
})

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({
      success: true,
      category: {
        _id: category._id,
        name: category.name
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router
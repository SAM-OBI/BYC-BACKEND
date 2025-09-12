const { description } = require('joi/lib/types/lazy');
const { Category } = require('../model/category')
const {Product, validate} = require('../model/product')
const express = require('express');
const router = express.Router();
const multer = require ("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

router.get('/test',  (req, res) => {
    res.send("API working")
});

router.get('/', async (req, res) => {
  // filter by category id 
  const filter = {};
  if ( req.query.categoryId){
    filter["category._id"] = req.query.categoryId;
  }

  const product = await Product.find(filter).sort('name');
  res.send(product);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).json({ success: false, message: "Invalid category id" });

    let product = new Product({
      name: req.body.name,
      image: req.body.image,
      price: req.body.price,
      description: req.body.description,
      productNumber: req.body.productNumber,
      numberInStock: req.body.numberInStock,
      category: {
        _id: category._id,
        name: category.name,
      },
    });

    product = await product.save();
    res.status(200).json({ success: true, message: "Product created successfully"});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  try {
    // fetch category if provided
    const category = await Category.findById(req.body.categoryId);
    if (req.body.categoryId) {
      if (!category) return res.status(400).json({ success: false, message: "Invalid category." });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        productNumber: req.body.productNumber,
        numberInStock: req.body.numberInStock,
        category: {
          _id: category._id,
          name: category.name,
        }
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); 
  }
});
// router.put('/:id', async (req, res) => {
    
//   const {error} = validate(req.body);
//   if (error)  return res.status(400).send(error.details[0].message)
//       let category;
//     if (req.body.categoryId){
//       category = await Category.findById(req.body.categoryId);
//       if (!category)return
//       res.status(404).send("category not found.");
//     }
//     const product = await Product.findByIdAndUpdate(req.params.id, {
//           name: req.body.name,
//           image: req.body.image,
//           price: req.body.price,
//           description: req.body.description,
//           productNumber: req.body.productNumber,
//           numberInStock: req.body.numberInStock,
//           category: {
//               _id: category._id,
//               name: category.name
//             },
//           },
//           {new: true}
//       );
//     if (!product) return res.status(400).send('The product with the given id not Found');
//     res.send(product)
// });

router.delete('/:id', async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)

    if(!product) return res.status(400).json({ success: false, message: 'The product with the given id not Found' });
    res.status(200).json({ success: true, message: "Product deleted successfully" });
});
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({
      success: true,
      product: {
        _id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        description: product.description,
        productNumber: product.productNumber,
        numberInStock: product.numberInStock,
        category: product.category // populated with _id + name
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
module.exports = router;

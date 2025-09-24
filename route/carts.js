const {Product} = require('../model/product')
const {Customer} = require('../model/customer')
const {Cart, validate} = require('../model/cart')
const express = require('express');
const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { error, value } = validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { customerId, items } = value;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const customerSnapshot = { 
        name: customer.name, 
        email: customer.email,
        phone: customer.phone,
        country:customer.country ,
        state: customer.state,
        address: customer.address,
        city: customer.city,
        company: customer.company, 
    };
    let cartItems = [];
    for (let p of items) {
      const product = await Product.findById(p.productId);
      if (!product) continue;
      cartItems.push({
        productId: product._id, 
        name: product.name, 
        image: product.image,
        price: product.price, 
        productNumber: product.productNumber,
        quantity: p.quantity, 
        subtotal: product.price * p.quantity, // match schema
      });
    }
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "No valid products in cart" });
    }
    const cart = new Cart({
      customerId,
      customerSnapshot,
      items: cartItems,
    });
    await cart.save();
    res.status(201).json({
      message: "Cart created successfully",
      cart,
    });
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router


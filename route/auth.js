const { User } = require('../model/user');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');



router.post('/', async(req, res) => {
const { error } = validateLogin(req.body);
if (error) return res.status(400).json({ success: false, message: error.details[0].message });
let user = await User.findOne({ email: req.body.email });
if (!user) return res.status(400).json({ success: false, message: 'Invalid email address.' });


const validPassword = await bcrypt.compare(req.body.password, user.password);
if (!validPassword) return res.status(400).json({ success: false, message: 'Invalid  password.' });
const token = user.generateAuthToken();
res.json({ success: true, token, _id: user._id, name: user.name });
})

router.put('/:id', async (req, res) => {
  const { error } = validatePasswordUpdate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  try {
    const { currentEmail, newPassword } = req.body;
    // find user by email
    let user = await User.findOne({ email: currentEmail });
    if (!user) return res.status(404).json({ success: false, message: 'Email not found, Enter a valid email' });
    // check if :id matches the user being updated
    if (user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized update attempt' });
    }
    // hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

function validateLogin(req) {
const schema = Joi.object({
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(255).required(),
});
return schema.validate(req);
}

function validatePasswordUpdate(req) {
  const schema = Joi.object({
    currentEmail: Joi.string().email().required(),
    newPassword: Joi.string().min(5).max(255).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().error(new Error('Confirm password must match new password')),
  });
  return schema.validate(req);
}

module.exports = router
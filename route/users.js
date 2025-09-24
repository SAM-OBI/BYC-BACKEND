//  imported route
const {User, validate} = require('../model/user');


// required routes 
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');


router.post('/', async(req, res) => {
const { error } = validate(req.body); 
if (error) return res.status(400).json(error.message);
let user = await User.findOne({ email: req.body.email });
if (user) return res.status(400).json({ message: 'Email already registered.' });
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  // res.send(_.pick(user, ['_id', 'name', 'email', 'role']));
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).json(_.pick(user, ['_id', 'name', 'email']))

  })

router.put("/:id", async (req, res) => {
  try {
      const { name, email } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, email },
        { new: true }
      );
      if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });
      res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router

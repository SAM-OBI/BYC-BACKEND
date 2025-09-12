const {Customer, validate} = require('../model/customer')
const express = require('express');
const router = express.Router()


router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name')
    res.send(customers)

})

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message)
    
    let customer = new Customer({
        name: req.body.name,
        company: req.body.company || null,
        phone:req.body.phone,
        address: req.body.address,
        state: req.body.state,
        country: req.body.country,
        city: req.body.city,
        email: req.body.email
    })
    
    try {
        customer = await customer.save()
        res.send(customer)
    } catch (err) {
        if (err.code === 11000) {
           const field = Object.keys(err.keyValue)[0];
           return res.status(400).send(`The ${field} is already registered.`);
        }
        res.status(500).send('Something failed, please try again later.')
    }
})

router.put('/:id', async (req, res) => {
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message)

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        company: req.body.company,
        phone:req.body.phone,
        address: req.body.address,
        state: req.body.state,
        country: req.body.country,
        city: req.body.city,
        email: req.body.email 
    }, {new: true})

    if (!customer) return res.status(400).send('The customer with the given id not Found');

    res.send(customer)
})

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id)

    if(!customer) return res.status(400).send('The customer with the given id not Found');

    res.send(customer)

})

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    
    if(!customer) return res.status(400).send('The customer with the given id not Found');

    res.send(customer)
})



module.exports = router

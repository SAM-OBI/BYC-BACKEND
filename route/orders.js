const {Product} = require('../model/product')
const {Customer} = require('../model/customer')
const {Order, validate} = require('../model/cart')
const express = require('express');
const { default: axios } = require('axios');
const order = require('../model/order');
const router = express.Router();

router.post("/create", async (req, res) =>{
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let order = new Order(req.body);
    await order.save();
    const response = axios.post("https//api:paystac.co/transaction/initialize", 
    {
        email: order.customerSnapShot.email,
        amount: order.totalAmount * 100,
        metadata: {
            orderId: order._id.toString()
        }
    },
    {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
    }
    );
    order.paymentReference = response.data.data.reference;
    await order.save();
    res.send({orderId: order._id, authorizationUrl: response.data.data.authorization_url, reference: order.data.data.reference});

    

});

router.post("/confirm",async (req, res) =>{
    const {reference} = req.body;
    const response = await axios.get(`https//api:paystac.co/transaction/verify{refrence}`,
     {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
     }
    )
    const data = response.data.data;
    if(data.status === "success"){
        const order = await Order.findOneAndUpdate(
            {
                paymentReference: reference
            },
            {
                paymentStatus: "paid",
                transactionId: data.id
            },
            {
                new: true
            }
        );
        return res.send({success: true, order});
    }
    else{
        return res.status(400).send({success: false, message:"payment failed"})
    };
});

router.post("/webhook", express.json({type: "application/json"}), async(req, res) => {
    const event = request.body;
    if(event.event === "change.success"){
        const reference = event.data.reference;
        await Order.findOneAndUpdate({
            paymentReference: reference, 
        },
        {
            paymentStatus: "paid",
            transactionId: event.data.id
        }
    )
    };
    res.sendStatus(200);
});

module.exports = router

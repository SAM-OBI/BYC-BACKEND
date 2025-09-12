const mongoose = require('mongoose')
const express =require('express')
const app = express()
const cors = require("cors");
require("dotenv").config();




// import routes
const category = require('./route/categories')
const product = require ('./route/products')
const customer = require ('./route/customers')
const user = require('./route/users')
const auth = require('./route/auth')
const config = require('config')

// check for jwtPrivateKey
if (!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}


// enable cors for frontend 
// app.use(cors( {origin: 'http://127.0.0.1:5501'}));
app.use(cors({ origin: '*' }));

// middleware 
app.use(express.json())

// Routes
app.use('/byc/document/api/categories', category)
app.use('/byc/api/products', product)
app.use('/byc/api/customers', customer)
app.use('/byc/api/register', user)
app.use('/byc/api/login', auth)


// connect to mongodb
mongoose.connect('mongodb://localhost:27017/bycdatabase')
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.log('Could not connect to MongoDB...', err))

// start server 
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
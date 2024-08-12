const express = require('express');
const app = express();
const products = require('./routes/products');
const ErrorMiddleWare=require('./middlewares/Error')
const auth=require('./routes/auth');
const order=require('./routes/order');
const payment=require('./routes/payment')
const parser=require('cookie-parser');
const path = require('path')
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, 'config/config.env') });


app.use(parser())
app.use(express.json())
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

// Use the products route for any requests to /api/v1
app.use('/api/v1', products);
app.use('/api/v1',auth)
app.use('/api/v1',order)
app.use('/api/v1',payment);

// if(process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, '../frontend/build')));
//     app.get('*', (req, res) =>{
//         res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
//     })
// }


app.use(ErrorMiddleWare);
module.exports = app;

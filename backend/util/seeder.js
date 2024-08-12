const product=require('../models/productModel');
const data=require('../data/product.json');
const dotenv=require('dotenv');
const path=require('path');
const databaseConnect = require('../config/database');


dotenv.config({path:'backend/config/config.env'});
databaseConnect();

const seedProducts = async ()=>{
    try{
        await product.deleteMany();
        console.log('Products deleted!')
        await product.insertMany(data);
        console.log('All products added!');
    }catch(error){
        console.log(error.message);
    }
    process.exit();
}

seedProducts()
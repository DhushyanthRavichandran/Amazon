const express = require('express');
const { getProducts, newProducts,getReviews,createReview,deleteReview,getSingleProduct,updateProduct,deleteProduct, getAdminProducts } = require('../controllers/productController');
const router = express.Router();
const {authorizeRoles,isAuthenticatedUser}=require('../middlewares/authenticate')
const multer=require('multer');
const path=require('path');

const upload=multer({storage:multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'..','uploads/product'));
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})})

// Define the route for getting products  -- /api/v1/products
router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct) // GET /api/v1/products/:id

//this is for the adding of data  -- /api/v1/products/new
router.route('/reviews/new').put(isAuthenticatedUser, createReview)
router.route('/review').get(isAuthenticatedUser,authorizeRoles('user'),getReviews)

//Admin routes

router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);
router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles('admin'),upload.array('images'),newProducts);
router.route('/admin/product/:id')
                            .put(isAuthenticatedUser,authorizeRoles('admin'),upload.array('images'),updateProduct) // PUT /api/v1/admin/products/:id
                            .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct);  // DELETE /api/v1/admin/products/:id
router.route('/admin/reviews').get(isAuthenticatedUser,authorizeRoles('admin'),getReviews)
                                .delete(isAuthenticatedUser, authorizeRoles('admin'),deleteReview)
module.exports = router;



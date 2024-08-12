const Product = require('../models/productModel'); // Use 'Product' to match the model name
const ErrorHandler =require('../util/errorHandler');
const catchAsync=require('../middlewares/CatchAsyncError')
const ApiFeatures=require('../util/apiFeature');
// Get all products
exports.getProducts =catchAsync(async (req, res, next) => {
    //Product.find() this is a base query it fetch all the data.
    //next we have to separate as we need
    let postPerPage=3;
    let buildQuery = () => {
        return new ApiFeatures(Product.find(),req.query).search().filter()
    }
    const filteredProductsCount = await buildQuery().query.countDocuments({})
    const totalProductsCount = await Product.countDocuments({});
    let productsCount = totalProductsCount;
    if(filteredProductsCount !== totalProductsCount) {
        productsCount = filteredProductsCount;
    }
    const products = await buildQuery().paginate(postPerPage).query;
//    const features=new ApiFeatures(Product.find(),req.query).search().filter().paginate(postPerPage);
        // const products = await features.query;
    //    const totalCount=await Product.countDocuments({});
        res.status(200).json({
            success: true,
            count: productsCount,
           
            postPerPage,
            products
            
        });
   
});

// Add a new product
//catchAysnc this is for the trycatch we can see the error here
//api/v1/product/new
exports.newProducts = catchAsync(async (req, res, next) => {
    let images = [];
    let BASE_URL=process.env.BACKEND_URL;
  
    if(process.env.NODE_ENV === "production"){
        BASE_URL=`${req.protocol}://${req.get('host')}`
    }

    if (req.files.length > 0) {
        req.files.forEach(file => {
            const url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url });
        });
    }

    req.body.images = images;  

    req.body.user = req.user.id; 
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });
});

// Get a single product by ID
//api/v1/product/:id

exports.getSingleProduct =catchAsync( async (req, res,next) => {
   
        const product = await Product.findById(req.params.id);
        if (!product) {
      return    next(new ErrorHandler('Product not found',400))
        }
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Using the delay function
        // await delay(2000); 
        res.status(200).json({
            success: true,
            product
        });
   
});

// Update a product by ID
//api/v1/product/:id
exports.updateProduct = catchAsync(async (req, res) => {

    // Check if the product exists
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    let images = [];
    let BASE_URL=process.env.BACKEND_URL;
  
  if(process.env.NODE_ENV === "production"){
    BASE_URL=`${req.protocol}://${req.get('host')}`
  }

    if (req.body.imagesCleared === 'false') {
        images = product.images;
    }

    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            const url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url });
        });
    }

    req.body.images = images;

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // Respond with the updated product
    res.status(200).json({
        success: true,
        product: updatedProduct
    });
});



//Delete Product - api/v1/product/:id
exports.deleteProduct = catchAsync(async (req, res) => {
        // Check if the product exists
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await Product.findByIdAndDelete(req.params.id);

       
        res.status(200).json({
            success: true,
            message:'product is removed'
            
        });
   
});


//Create Review - api/v1/review
exports.createReview = catchAsync(async (req, res, next) => {
    const { productId, rating, comment } = req.body;

    const review = {
        user: req.user.id,
        rating: Number(rating), // Ensure rating is a number
        comment
    };

    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    // Finding if the user has already reviewed this product
    const isReviewed = product.reviews.find(review => {
        return review.user.toString() === req.user.id.toString();
    });

    if (isReviewed) {
        // Updating the existing review
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user.id.toString()) {
                review.comment = comment;
                review.rating = Number(rating); // Ensure rating is updated as a number
            }
        });
    } else {
        // Creating a new review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Calculate the average rating of the product
    product.ratings = product.reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / product.reviews.length;

    product.ratings = isNaN(product.ratings) ? 0 : product.ratings/10;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: 'Review added successfully'
    });
});

//Get Reviews - api/v1/reviews?id={productId}
exports.getReviews=catchAsync(async (req,res,next)=>{
    const { id } = req.query;

    // Validate the productId
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Product ID is required'
        });
    }
    const product=await Product.findById((req.query.id)).populate('reviews.user','name email');
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
})


// Delete Review - api/v1/admin/reviews
exports.deleteReview = catchAsync(async (req, res, next) => {
    const { productId, id } = req.query;

    // Validate productId and id
    if (!productId || !id) {
        return res.status(400).json({
            success: false,
            message: 'Product ID and Review ID are required'
        });
    }

    // Fetch the product
    const product = await Product.findById(productId);

    // Handle case where product is not found
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    // Filter out the review to be deleted by review ID
    const reviews = product.reviews.filter(review => review._id.toString() !== id.toString());

    // Calculate the average rating of the remaining reviews
    const noOfReviews = reviews.length;
    const rating = noOfReviews > 0
        ? reviews.reduce((acc, review) => acc + Number(review.rating), 0) / noOfReviews
        : 0;

    // Update the product with the new reviews and ratings
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
        reviews,
        numOfReviews: noOfReviews,
        ratings: rating
    }, { new: true });

    if (!updatedProduct) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update the product'
        });
    }

    res.status(200).json({
        success: true
    });
});


// get admin products  - api/v1/admin/products
exports.getAdminProducts = catchAsync(async (req, res, next) =>{
    const products = await Product.find();
    res.status(200).send({
        success: true,
        products
    })
});
const CatchAsyncError = require('../middlewares/CatchAsyncError');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../util/errorHandler');
const mongoose = require('mongoose');

// Utility function to validate and trim ObjectId
function validateAndTrimObjectId(id) {
    const trimmedId = id.trim();
    if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
        throw new ErrorHandler('Invalid ObjectId format', 400);
    }
    return trimmedId;
}

// Create New Order - api/v1/order/new
exports.newOrder = CatchAsyncError(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    });

    res.status(200).json({
        success: true,
        order
    });
});

// Get Single Order - api/v1/order/:id
exports.getSingleOrder = CatchAsyncError(async (req, res, next) => {
    try {
        const orderId = validateAndTrimObjectId(req.params.id);
        const order = await Order.findById(orderId).populate('user', 'name email');

        if (!order) {
            return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Get Loggedin User Orders - /api/v1/myorders
exports.myOrder = CatchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        orders
    });
});

// Admin
// Get All Orders - api/v1/orders
exports.orders = CatchAsyncError(async (req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

// Admin: Update Order / Order Status - api/v1/order/:id
exports.updateOrder = CatchAsyncError(async (req, res, next) => {
    try {
        const orderId = validateAndTrimObjectId(req.params.id);
        const order = await Order.findById(orderId);

        if (order.orderStatus === 'Delivered') {
            return next(new ErrorHandler('Order has been already delivered!', 400));
        }

        order.orderItems.forEach(async orderItem => {
            await updateStock(orderItem.product, orderItem.quantity);
        });

        order.orderStatus = req.body.orderStatus;
        order.deliveredAt = Date.now();
        await order.save();

        res.status(200).json({
            success: true
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false });
}

// Admin: Delete Order - api/v1/order/:id
exports.deleteOrder = CatchAsyncError(async (req, res, next) => {
    const orderId = validateAndTrimObjectId(req.params.id);
    const order = await Order.findById(orderId);

    if (!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
    }

    await Order.deleteOne({ _id: orderId });

    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    });
});



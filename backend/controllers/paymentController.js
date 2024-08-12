const CatchAsyncError = require('../middlewares/CatchAsyncError');

exports.processPayment = CatchAsyncError(async (req, res, next) => {
    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "usd",
            description: "TEST PAYMENT",
            metadata: { integration_check: "accept_payment" },
            shipping: {
                name: req.body.shipping.name,
                address: {
                    line1: req.body.shipping.address.line1,
                    city: req.body.shipping.address.city,
                    state: req.body.shipping.address.state,
                    postal_code: req.body.shipping.address.postal_code,
                    country: req.body.shipping.address.country
                },
                phone: req.body.shipping.phone  // Corrected from "phoneNo" to "phone"
            }
        });

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ success: false, message: 'Payment processing failed' });
    }
});



exports.sendStripeApi = CatchAsyncError(async (req, res, next) => {

    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    });
});





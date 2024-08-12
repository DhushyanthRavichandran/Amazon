import { useElements, useStripe } from "@stripe/react-stripe-js";
import { CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { orderCompleted } from "../../slices/cartSlices";
import { validateShipping } from '../cart/Shipping';
import { createOrder } from '../../actions/OrderAction';
import { clearError as clearOrderError } from "../../slices/orderSlices";

export const Payment = () => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo')) || {}; 
    const { user } = useSelector(state => state.authState);
    const { items: cartItems, shippingInfo } = useSelector(state => state.cartState);
    const { error: orderError } = useSelector(state => state.orderState);

    const paymentData = {
        amount: Math.round((orderInfo.totalPrice || 0) * 100),
        shipping: {
            name: user.name,
            address: {
                city: shippingInfo.city,
                postal_code: shippingInfo.postalCode,
                country: shippingInfo.country,
                state: shippingInfo.state,
                line1: shippingInfo.address
            },
            phone: shippingInfo.phoneNo
        }
    };

    const order = {
        orderItems: cartItems,
        shippingInfo
    };

    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice || 0; 
        order.shippingPrice = orderInfo.shippingPrice || 0; 
        order.taxPrice = orderInfo.taxPrice || 0; 
        order.totalPrice = orderInfo.totalPrice || 0; 
    }

    useEffect(() => {
        validateShipping(shippingInfo, navigate);
        if (orderError) {
            toast(orderError, {
                position: "bottom-center",
                type: 'error',
                onOpen: () => { dispatch(clearOrderError()); }
            });
        }
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        document.querySelector('#pay_btn').disabled = true;
        try {
            const { data } = await axios.post('/api/v1/payment/process', paymentData);
            const clientSecret = data.client_secret;

            if (stripe && elements) {
                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardNumberElement),
                        billing_details: {
                            name: user.name,
                            email: user.email
                        }
                    }
                });

                if (result.error) {
                    toast(result.error.message, {
                        type: 'error',
                        position: "bottom-center"
                    });
                    document.querySelector('#pay_btn').disabled = false;
                } else if (result.paymentIntent.status === 'succeeded') {
                    toast('Payment Success!', {
                        type: 'success',
                        position: "bottom-center"
                    });
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    };
                    dispatch(orderCompleted());
                    dispatch(createOrder(order));

                    navigate('/order/success');
                } else {
                    toast('Please Try again!', {
                        type: 'warning',
                        position: "bottom-center"
                    });
                }
            } else {
                toast('Stripe.js has not loaded yet.', {
                    type: 'error',
                    position: "bottom-center"
                });
                document.querySelector('#pay_btn').disabled = false;
            }
        } catch (error) {
            toast('Payment processing failed. Please try again later.', {
                type: 'error',
                position: "bottom-center"
            });
            console.error('Payment Error:', error);
            document.querySelector('#pay_btn').disabled = false;
        }
    };

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg">
                    <h1 className="mb-4">Card Info</h1>
                    <div className="form-group">
                        <label htmlFor="card_num_field">Card Number</label>
                        <CardNumberElement
                            type="text"
                            id="card_num_field"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="card_exp_field">Card Expiry</label>
                        <CardExpiryElement
                            type="text"
                            id="card_exp_field"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="card_cvc_field">Card CVC</label>
                        <CardCvcElement
                            type="text"
                            id="card_cvc_field"
                            className="form-control"
                        />
                    </div>
                    <button
                        id="pay_btn"
                        type="submit"
                        className="btn btn-block py-3"
                    >
                        Pay - { ` $${orderInfo.totalPrice || 0}` } {/* Use fallback value */}
                    </button>
                </form>
            </div>
        </div>
    );
};

import { useDispatch, useSelector } from "react-redux"
import { SideBar } from "./SideBar"
import { Link, useNavigate, useParams } from "react-router-dom";
import { updateOrder,OrderDetails as orderDetailAction } from "../../actions/OrderAction";
import { clearError, clearOrderUpdated } from "../../slices/orderSlices";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const UpdateOrder=()=>{
    const {loading,isOrderUpdated,error,orderDetail}=useSelector(state=>state.orderState);
    const {user={},orderItems=[],shippingInfo={}, totalPrice = 0, paymentInfo = {}} = orderDetail;
    const isPaid = paymentInfo.status === 'succeeded'? true: false;
    const [orderStatus, setOrderStatus] = useState("Processing");
    const { id:orderId } = useParams();

    const navigate=useNavigate();
    const dispatch=useDispatch();
    const submitHandler=(e)=>{
        e.preventDefault();
        const orderData={};
        orderData.orderStatus=orderStatus;
        dispatch(updateOrder(orderId,orderData))
    }

    useEffect(() => {
        if(isOrderUpdated) {
            toast.success('Order Updated Succesfully!',{
              
                position: "bottom-center",
                onOpen: () => dispatch(clearOrderUpdated())
            })
           
            return;
        }

        if(error)  {
            toast.error(error, {
                position: "bottom-center",
                type: 'error',
                onOpen: ()=> { dispatch(clearError()) }
            })
            return
        }

        dispatch(orderDetailAction(orderId))
    }, [isOrderUpdated, error, dispatch])

    useEffect(() => {
        if(orderDetail._id) {
            setOrderStatus(orderDetail.orderStatus);
        }
    },[orderDetail])

    return(
        <div className="row">
            <div className="col-12 col-md-2">
                    <SideBar/>
            </div>
            <div className="col-12 col-md-10">
            <Fragment>
                <div className="row d-flex justify-content-between">
                    <div className="col-12 col-lg-8 mt-5 order-details">

                        <h1 className="my-5">Order # {orderDetail._id}</h1>

                        <h4 className="mb-4">Shipping Info</h4>
                        <p><b>Name:</b> {user.name}</p>
                        <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                        <p className="mb-4"><b>Address:</b>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country}</p>
                        <p><b>Amount:</b> ${totalPrice}</p>

                        <hr />

                        <h4 className="my-4">Payment</h4>
                        <p className={isPaid ? 'greenColor' : 'redColor' } ><b>{isPaid ? 'PAID' : 'NOT PAID' }</b></p>


                        <h4 className="my-4">Order Status:</h4>
                        <p className={orderStatus&&orderStatus.includes('Delivered') ? 'greenColor' : 'redColor' } ><b>{orderStatus}</b></p>


                        <h4 className="my-4">Order Items:</h4>

                        <hr />
                        <div className="cart-item my-1">
                            {orderItems && orderItems.map(item => (
                                <div className="row my-5">
                                    <div className="col-4 col-lg-2">
                                        <img src={item.image} alt={item.name} height="45" width="65" />
                                    </div>

                                    <div className="col-5 col-lg-5">
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>


                                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                        <p>${item.price}</p>
                                    </div>

                                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                        <p>{item.quantity} Piece(s)</p>
                                    </div>
                                </div>
                            ))}
                                
                        </div>
                        <hr />
                    </div>
                    <div className="col-12 col-lg-3 mt-5">
                        <h2 className="my-4">Order Status</h2>
                        <div className="form-group">
                            <select
                            className="form-control"
                            onChange={e=>setOrderStatus(e.target.value)}
                            value={orderStatus}
                            name="status">
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                        <button 
                         disabled={loading}
                         onClick={submitHandler}
                         className="btn btn-primary btn-block"
                         >
                            Update Status
                         </button>
                    </div>
                </div>
            </Fragment>
            </div>
        </div>
    )
}
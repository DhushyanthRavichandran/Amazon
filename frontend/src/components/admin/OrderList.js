import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../layouts/Loader';
import { SideBar } from './SideBar';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import { deleteOrder,adminOrders as adminOrderAction } from '../../actions/OrderAction';
import { clearError, clearOrderDeleted } from '../../slices/orderSlices';

export const OrderList = () => {
    const { adminOrders = [], loading = true, error ,isOrderDeleted} = useSelector(state => state.orderState);

    const dispatch = useDispatch();


    const deleteHandler=(e,id)=>{
        e.target.disabled=true;
        dispatch(deleteOrder(id));
    }
    useEffect(()=>{
        if(error){
           toast.error(error,{
              position:"bottom-center",
              onOpen:()=>{dispatch(clearError())}
           })
           return
        }
        if(isOrderDeleted){
            toast.success('Product deleted SuccessFully',{
                position:"bottom-center",
                onOpen:()=>dispatch(clearOrderDeleted())
            })
            return;
        }
        dispatch(adminOrderAction)
    },[dispatch,error,isOrderDeleted]);
    

    const setOrders = () => {
        const data = {
            columns: [
                { label: 'ID', field: 'id', sort: 'asc' },
                { label: 'Number of Items', field: 'noOfItems', sort: 'asc' },
                { label: 'Amount', field: 'amount', sort: 'asc' },
                { label: 'Status', field: 'status', sort: 'asc' },
                { label: 'Actions', field: 'actions', sort: 'asc' }
            ],
            rows: []
        };

        adminOrders.forEach(order => {
            data.rows.push({
                id: order._id,
                noOfItems:order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status: <p style={{color: order.orderStatus.includes('Processing') ? 'red' : 'green'}}>{order.orderStatus}</p> ,
                actions: (
                    <Fragment>
                        <Link to={`/admin/order/${order._id}`} className="btn btn-primary">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <Button onClick={e=>deleteHandler(e,order._id)} className="btn btn-danger py-1 px-2 ml-2">
                            <i className="fa fa-trash"></i>
                        </Button>
                    </Fragment>
                )
            });
        });

        return data;
    };


    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <SideBar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">order List</h1>
                <Fragment>
                    {loading ? <Loader /> : 
                        <MDBDataTable
                            data={setOrders()}
                            bordered
                            striped
                            hover
                            className="px-3"
                        />
                    }
                </Fragment>
            </div>
        </div>
    );
};



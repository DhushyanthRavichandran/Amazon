import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../layouts/Loader';
import { SideBar } from './SideBar';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import { DeleteUser,getUsers } from '../../actions/authAction';
import { clearError,clearUserDeleted } from '../../slices/userSlices';

export const UserList = () => {
    const { users = [], loading = true, error ,isUserDeleted} = useSelector(state => state.userState);

    const dispatch = useDispatch();


    const deleteHandler=(e,id)=>{
        e.target.disabled=true;
        dispatch(DeleteUser(id));
    }
    useEffect(()=>{
        if(error){
           toast.error(error,{
              position:"bottom-center",
              onOpen:()=>{dispatch(clearError())}
           })
           return
        }
        if(isUserDeleted){
            toast.success('User deleted SuccessFully',{
                position:"bottom-center",
                onOpen:()=>dispatch(clearUserDeleted())
            })
            return;
        }
        dispatch(getUsers)
    },[dispatch,error,isUserDeleted]);
    

    const setUsers = () => {
        const data = {
            columns: [
                { label: 'ID', field: 'id', sort: 'asc' },
                { label: 'Name', field: 'name', sort: 'asc' },
                { label: 'Email', field: 'email', sort: 'asc' },
                { label: 'Role', field: 'role', sort: 'asc' },
                { label: 'Actions', field: 'actions', sort: 'asc' }
            ],
            rows: []
        };

        users.forEach(user => {
            data.rows.push({
                id: user._id,
                name:user.name,
                email: user.email,
                role: user.role ,
                actions: (
                    <Fragment>
                        <Link to={`/admin/user/${user._id}`} className="btn btn-primary">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <Button onClick={e=>deleteHandler(e,user._id)} className="btn btn-danger py-1 px-2 ml-2">
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
                            data={setUsers()}
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



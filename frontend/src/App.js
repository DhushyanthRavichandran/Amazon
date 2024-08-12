import "./App.css";
import Footer from "./components/layouts/Footer";
import Header from "./components/layouts/Header";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProductDetail } from "./components/product/ProductDetail";
import ProductSearch from "./components/product/ProductSearch";
import Login from "./components/user/Login";
import { Register } from "./components/user/Register";
import { useEffect, useState } from "react";
import { loadUser } from "./actions/authAction";
import store from './store'
import { Profile } from "./components/user/Profile";
import { ProtectedRoute } from "./components/route/ProtectedRoute";
import { UpdateProfile } from "./components/user/UpdateProfile";
import { UpdatePassword } from "./components/user/UpdatePassword";
import { ForgetPassword } from "./components/user/ForgetPassword";
import { ResetPassword } from "./components/user/ResetPassword";
import { Cart } from "./components/cart/Cart";
import { Shipping } from "./components/cart/Shipping";
import ConfirmOrder from './components/cart/ConfirmOrder';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from "axios";
import { Payment } from "./components/cart/Payment";
import OrderSuccess from "./components/cart/OrderSuccess";
import { UserOrder } from "./components/order/userOrder";
import { OrderDetails } from "./components/order/OrderDetails";
import { Dashboard } from "./components/admin/Dashboard";
import ProductList from "./components/admin/ProductList";
import { NewProduct } from "./components/admin/newProduct";
import { UpdateProduct } from "./components/admin/UpdateProduct";
import { OrderList } from "./components/admin/OrderList";
import { UpdateOrder } from "./components/admin/UpdateOrder";
import { UserList } from "./components/admin/UserList";
import { UpdateUser } from "./components/admin/UpdateUser";
import { ReviewList } from "./components/admin/ReviewList";
function App() {
  const [stripeApiKey,setStripeApiKey]=useState("")
  useEffect(()=>{
    store.dispatch(loadUser);
    async function getStripeaApiKey(){
      const {data}=await axios.get('/api/v1/stripeapi');
      setStripeApiKey(data.stripeApiKey);
    }
    getStripeaApiKey();
  },[]);

  return (
    <Router>
      <HelmetProvider>
        <Header />
        <ToastContainer theme='dark' />
        <div className='container container-fluid'>
          <Routes>
            <Route path='/login' element={<Login />} /> 
            <Route path='/register' element={<Register />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path='/password/reset/:token' element={<ResetPassword/> } />

            <Route path="/" element={<Home />} />

            <Route path='/myprofile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/myprofile/edit" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
            <Route path="/myprofile/edit/password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />



            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path='/search/:keyword?' element={<ProductSearch />} />
           
            <Route path="/cart" element={<Cart />} />
            <Route path="/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
            <Route path="order/confirm" element={<ProtectedRoute><ConfirmOrder/></ProtectedRoute>}/>
            {stripeApiKey && <Route path="/payment" element={<ProtectedRoute><Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements></ProtectedRoute>} />}
            <Route path="/order/success" element={<ProtectedRoute><OrderSuccess/></ProtectedRoute>}/>
            <Route path='/orders' element={<ProtectedRoute><UserOrder/></ProtectedRoute> } />
            <Route path='/order/:id' element={<ProtectedRoute><OrderDetails/></ProtectedRoute> } />

          </Routes>
        </div>
        <Routes>
        <Route path='admin/Dashboard' element={<ProtectedRoute isAdmin={true} ><Dashboard /></ProtectedRoute>} />
        <Route path='/admin/products' element={<ProtectedRoute isAdmin={true} ><ProductList /></ProtectedRoute>} />
        <Route path='/admin/products/create' element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>} />
        <Route path='/admin/product/:id' element={ <ProtectedRoute isAdmin={true}><UpdateProduct/></ProtectedRoute> } />
        <Route path='/admin/orders' element={<ProtectedRoute isAdmin={true} ><OrderList /></ProtectedRoute>} />
        <Route path='/admin/order/:id' element={<ProtectedRoute isAdmin={true} ><UpdateOrder /></ProtectedRoute>} />
        <Route path='/admin/users' element={<ProtectedRoute isAdmin={true} ><UserList /></ProtectedRoute>} />
        <Route path='/admin/user/:id' element={<ProtectedRoute isAdmin={true} ><UpdateUser /></ProtectedRoute>} />
        <Route path='/admin/reviews' element={<ProtectedRoute isAdmin={true} ><ReviewList /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </HelmetProvider>
    </Router>
  );
}

export default App;

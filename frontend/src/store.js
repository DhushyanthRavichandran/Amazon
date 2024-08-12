import { combineReducers, configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlices';
import productReducer from './slices/productSlices';
import authReducer from './slices/authSlices'
import  cartReducer from './slices/cartSlices'
import orderReducer from './slices/orderSlices'
import userReducer from './slices/userSlices'
const reducer = combineReducers({
    productsState: productsReducer,
    productState: productReducer,
    authState:authReducer,
    cartState:cartReducer,
    orderState:orderReducer,
    userState:userReducer,
});

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;

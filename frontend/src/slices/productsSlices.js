import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        loading: false,
        products: [],
        error: null,
        count:0,
        postPerPage:0
    },
    reducers: {
        productsRequest(state) {
            state.loading = true;
            state.error = null;
        },
        productsSuccess(state, action) {
          
            state.loading = false;
            state.products = action.payload.products;
            state.count=action.payload.count;
            state.postPerPage=action.payload.postPerPage;
        },
        productsFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        adminProductsRequest(state,action){
            return{
                loading:true,
               
            }
        },
        adminProductsSuccess(state,action){
            return{
                loading:false,
                products:action.payload.products
            }
        },
        AdminProductsFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearError(state,action){
            return{
                ...state,
                error:null
            }
        }
    }
});

const { actions, reducer } = productsSlice;
export const { productsRequest,
     productsSuccess,
      productsFail,
      adminProductsRequest,
      adminProductsSuccess,
      AdminProductsFail,
      clearError } = actions;
export default reducer;

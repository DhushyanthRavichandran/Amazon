import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
    name: 'product',
    initialState: {
        loading: false,
        isReviewSubmitted: false,
        isProductDeleted:false,
        isProductCreated: false,
        isProductUpdated:false,
        isReviewDeleted:false,
        product: {},  
        reviews: [],
        error: null
    },
    reducers: {
        productRequest(state) {
            state.loading = true;
            state.error = null;
        },
        productSuccess(state, action) {
            state.loading = false;
            state.product = action.payload.product;  
        },
        productFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearError(state,action){
            return{
                ...state,
                error:null
            }
        },
        createReviewRequest(state,action){
            return{
                ...state,
                loading:true,
               
            }
        },
        createReviewSuccess(state,action){
            return{
                ...state,
                loading:false,
                isReviewSubmitted:true
            }
        },
        createReviewFail(state,action){
            return{
                ...state,
                loading:false,
                error:action.payload
            }
        },
        clearReviewSubmitted(state,action){
            return{
                ...state,
                isReviewSubmitted:false
            }
        },
        clearProduct(state,action){
            return{
                ...state,
                product:{}
            }
        },
        deleteProductRequest(state,action){
            return{
                ...state,
                loading:true
            }
        },
        deleteProductSuccess(state,action){
            return{
                ...state,
                loading:false,
                isProductDeleted:true
            }
        },
        deleteProductFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload,
            }
        },
        clearProductDeleted(state, action) {
            return {
                ...state,
                isProductDeleted: false
            }
        },
        newProductRequest(state,action){
            return{
                ...state,
                loading:true
            }
        },
        newProductSuccess(state,action){
            return{
                ...state,
                loading:false,
                product:action.payload.product,
                isProductCreated:true
            }
        },
        newProductFail(state,action){
            return{
                ...state,
                loading:false,
                error:action.payload,
                isProductCreated:false
            }
        },
        clearProductCreated(state, action) {
            return {
                ...state,
                isProductCreated: false
            }
        },
        updateProductRequest(state,action){
            return{
                ...state,
                loading:true
            }
        },
        updateProductSuccess(state,action){
            return{
                ...state,
                loading:false,
                isProductUpdated:true,
                product:action.payload.product
            }
        },
        updateProductFail(state,action){
            return{
                ...state,
                loading:false,
                error:action.payload
            }
        },
        clearProductUpdated(state,action){
            return{
                ...state,
                isProductUpdated:false
            }
        },
        reviewsRequest(state,action){
            return{
                ...state,
                loading:true
            }
        },
        reviewsSuccess(state,action){
            return{
                ...state,
                loading:false,
                reviews:action.payload.reviews
            }
        },
        reviewsFail(state,action){
            return{
                ...state,
                loading:false,
                error:action.payload
            }
        },
        deleteReviewRequest(state,action){
            return{
                ...state,
                loading:true
            }
        },
        deleteReviewSuccess(state,action){
            return{
                ...state,
                isReviewDeleted:true,
                loading:false
            }
        },
        deleteReviewFail(state,action){
            return{
                ...state,
                error:action.payload,
                loading:false
            }
        },
        clearReviewDeleted(state,action){
            return{
                ...state,
                isReviewDeleted:false
            }
        }

    }
});

const { actions, reducer } = productSlice;
export const { productRequest,
    productSuccess, 
    productFail,
    clearError,
    createReviewRequest ,
    createReviewFail,
    createReviewSuccess,
    clearReviewSubmitted,
    clearProduct,
    deleteProductRequest,
    deleteProductSuccess,
    deleteProductFail,
    clearProductDeleted ,
    newProductRequest,
    newProductSuccess,
    newProductFail,
    clearProductCreated,
    updateProductRequest,
    updateProductSuccess,
    updateProductFail,
    clearProductUpdated,
    reviewsRequest,
    reviewsSuccess,
    reviewsFail,
    deleteReviewFail,
    deleteReviewSuccess,
    deleteReviewRequest,
    clearReviewDeleted } = actions;
export default reducer;

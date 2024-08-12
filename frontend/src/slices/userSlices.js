import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'products',
    initialState: {
        loading: false,
        user:{},
        users:[],
        error: null,
        isUserUpdated:false,
        isUserDeleted:false
    },
    reducers: {
        usersRequest(state,action) {
             return{
                ...state,
                loading:true
             }
        },
        usersSuccess(state, action) {
          return{
            ...state,
            loading:false,
            users:action.payload.users
          }
           
        },
        usersFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        userRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        userSuccess(state, action){
            return {
                ...state,
                loading: false,
                user: action.payload.user,
            }
        },
        userFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload
            }
        },
        clearError(state,action){
            return{
                ...state,
                error:null
            }
        },
        deleteUserRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        deleteUserSuccess(state, action){
            return {
                ...state,
                loading: false,
                isUserDeleted : true
            }
        },
        deleteUserFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload
            }
        },
        updateUserRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        updateUserSuccess(state, action){
            return {
                ...state,
                loading: false,
                isUserUpdated : true
            }
        },
        updateUserFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload
            }
        },
        clearUserDeleted(state, action){
            return {
                ...state,
                isUserDeleted : false
            }
        },
        clearUserUpdated(state, action){
            return {
                ...state,
                isUserUpdated : false
            }
        }
    }
});

const { actions, reducer } = userSlice;
export const { userRequest,
    userFail,
    userSuccess,
    usersRequest,
    usersSuccess,
    usersFail,
    deleteUserRequest,
    deleteUserSuccess,
    deleteUserFail,
    updateUserRequest,
    updateUserSuccess,
    updateUserFail,
    clearUserDeleted,
    clearUserUpdated,
    clearError } = actions;
export default reducer;

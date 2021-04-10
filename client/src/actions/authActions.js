import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import serverConf from '../config'
import { GET_ERRORS, GET_SUCCESS, SET_USER, USER_LOADING, SET_AUTH, REDIRECT } from './types';
import store from "../store";
import {getUser} from "./userActions";

export const loginUser = form => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.account.login}`;

    axios.post(endpoint, form)
    .then((res) => { 

        const token = res.data.token;

        if (!token) {
            dispatch({
                type: GET_ERRORS,
                payload: res
            })
        }
        else {
            
            // save token to localStorage
            localStorage.setItem('jwt', token);
            
            // set token to auth header
            setAuthToken(token);

            // decode token to get user data
            const decoded = jwt_decode(token);

            // set current user
            store.dispatch(getUser());
            dispatch(setAuth(decoded)); // role
        }
    })
    .catch(err => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
 };

// set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_USER,
        payload: decoded
    };
};

// set auth
export const setAuth = decoded => {
    return {
        type: SET_AUTH,
        payload: decoded.role
    };
};

// user loading
export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

// log user out
export const logoutUser = () => dispatch => {

    // remove token from local storage
    localStorage.removeItem('jwt');

    // remove auth header for future requests
    setAuthToken(false);

    // set current user to empty object which will set isAuthenticated to false
    dispatch(setAuth({}));

    //this.props.history.push("/login"); 
};

// Request password reset email
export const requestPasswordReset = form => dispatch => {
    const endpoint = `${serverConf.uri}${serverConf.endpoints.account.sendResetPassword}`;
    
    axios.post(endpoint, form)
    .then(res => {
      dispatch({
        type: GET_SUCCESS,
        payload: res.data.message
      })
    })
    .catch(err => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

// Reset password
export const resetPassword = form => dispatch => {
    const endpoint = `${serverConf.uri}${serverConf.endpoints.account.resetPassword}`;

    axios.post(endpoint, form)
    .then(res => {
        dispatch({
            type: GET_SUCCESS,
            payload: res.data.message
        })
        dispatch({
            type: REDIRECT,
            payload: '/'
        })
    })
    .catch(err => dispatch({
        type: GET_ERRORS,
        payload: !!err.response ? err.response.data.errors : err
    }));
};
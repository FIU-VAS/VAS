import axios from 'axios';
import serverConf from '../config'
import { GET_ERRORS, GET_SUCCESS, ADMINS_LOADING, SET_ADMINS} from './types';

// get volunteers from database
export const getAdmins = () => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.admin.fetch}`;

    axios.get(endpoint)
    .then((res) => {
        // set current volunteers
        dispatch(setCurrentAdmins(res.data));
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

// add volunteer to database and refresh the store
export const addAdmin = form => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.admin.signup}`;

    axios.post(endpoint, form)
    .then((res) => {
        // set current volunteers
        dispatch(getAdmins());
        dispatch({
            type: GET_SUCCESS,
            payload: res.data.message
        });   
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
 };

// make changes to volunteer in the database and refresh the store
export const editAdmin = (id, form) => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.admin.update}/${id}`;

    axios.put(endpoint, form)
    .then((res) => {
        dispatch(getAdmins());
        dispatch({
            type: GET_SUCCESS,
            payload: res.data.message
        });  
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
 };
 
// volunteers loading
export const setAdminsLoading = () => {
    return {
        type: ADMINS_LOADING
    };
};

// set volunteers
export const setCurrentAdmins = admins => {
    return {
        type: SET_ADMINS,
        payload: admins
    };
};

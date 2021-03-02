import axios from 'axios';
import serverConf from '../config'
import { GET_ERRORS, SET_VOLUNTEERS, VOLUNTEERS_LOADING,GET_SUCCESS} from './types';

// get volunteers from database
export const getVolunteers = () => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.volunteers.fetch}`;

    axios.get(endpoint)
    .then((res) => {
        // set current volunteers
        dispatch(setCurrentVolunteers(res.data));
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

// add volunteer to database and refresh the store
export const addVolunteer = form => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.volunteers.signup}`;

    axios.post(endpoint, form)
    .then((res) => {
        // set current volunteers
        dispatch(getVolunteers());
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
export const editVolunteer = (id, form) => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.volunteers.update}/${id}`;

    axios.put(endpoint, form)
    .then((res) => {
        dispatch(getVolunteers());
        dispatch({
            type: GET_SUCCESS,
            payload: res.message
        })   
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
 };
// volunteers loading
export const setVolunteersLoading = () => {
    return {
        type: VOLUNTEERS_LOADING
    };
};

// set volunteers
export const setCurrentVolunteers = volunteers => {
    return {
        type: SET_VOLUNTEERS,
        payload: volunteers
    };
};

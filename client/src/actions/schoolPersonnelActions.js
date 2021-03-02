import axios from 'axios';
import serverConf from '../config'
import { GET_ERRORS, SET_SCHOOL_PERSONNELS, SCHOOL_PERSONNELS_LOADING, GET_SUCCESS} from './types';

// get school personnels from database
export const getSchoolPersonnels = () => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.schoolPersonnels.fetch}`;

    axios.get(endpoint)
    .then((res) => {
        // set current school personnels
        dispatch(setCurrentSchoolPersonnels(res.data));    
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

// add school personnel to database and refresh the store
export const addSchoolPersonnel = form => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.schoolPersonnels.signup}`;

    axios.post(endpoint, form)
    .then((res) => {
        // set current school personnels
        dispatch(getSchoolPersonnels());
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

 // make chanhes to school personnel in the database and refresh the store
export const editSchoolPersonnel = (id, form) => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.schoolPersonnels.update}/${id}`;

    axios.put(endpoint, form)
    .then((res) => {
        dispatch(getSchoolPersonnels());
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

// school personnels loading
export const setSchoolPersonnelsLoading = () => {
    return {
        type: SCHOOL_PERSONNELS_LOADING
    };
};

// set school personnels
export const setCurrentSchoolPersonnels = schoolPersonnels => {
    return {
        type: SET_SCHOOL_PERSONNELS,
        payload: schoolPersonnels
    };
};
import axios from 'axios';
import serverConf from '../config'
import { GET_ERRORS, SET_SCHOOLS, SCHOOLS_LOADING, GET_SUCCESS} from './types';

// get schools from database
export const getSchools = code => dispatch => {

    let endpoint = `${serverConf.uri}${serverConf.endpoints.schools.fetch}`;
    if (code) {
        endpoint += '/getSchoolInfo/' + code.join()
    }

    axios.get(endpoint)
    .then((res) => {
        dispatch(setCurrentSchools(res.data));   
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

// add schools to database and refresh the store
export const addSchool = form => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.schools.create}`;

    axios.post(endpoint, form)
    .then((res) => {
        // set current schools
        dispatch(getSchools());
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

 // make changes to schools in the database and refresh the store
export const editSchool = (id, form) => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.schools.update}/${id}`;

    axios.put(endpoint, form)
    .then((res) => {
        // set current schools
        dispatch(getSchools());
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

// schools loading
export const setSchoolsLoading = () => {
    return {
        type: SCHOOLS_LOADING
    };
};

// set schools
export const setCurrentSchools = schools => {
    return {
        type: SET_SCHOOLS,
        payload: schools
    };
};

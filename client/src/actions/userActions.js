import axios from 'axios';
import serverConf from '../config'
import { GET_ERRORS, SET_USER } from './types';


export const updateAdmin = (id, form) => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.admin.update}/${id}`;

    axios.put(endpoint, form)
    .then((res) => {
        dispatch(getAdmin(res.data.id))
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
 };

export const updateLinks = (id, form) => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.siteSettings.update}/${id}`;

    axios.put(endpoint, form)
        .then((res) => {
            dispatch(getLinks(res.data.id))
        })
        .catch((err) => dispatch({
            type: GET_ERRORS,
            payload: err
        }));
};

export const getUser = () => dispatch => {
    const endpoint = `${serverConf.uri}${serverConf.endpoints.user.me}/`;

    axios.get(endpoint)
        .then((res) => {
            dispatch(setCurrentUser(res.data))
        })
        .catch((err) => dispatch({
            type: GET_ERRORS,
            payload: err
        }));
};

 // get admin from database
export const getAdmin = (id) => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.admin.fetchByid}/${id}`;

    axios.get(endpoint)
    .then((res) => {
        dispatch(setCurrentUser(res.data))
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

export const getLinks = () => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.siteSettings.fetch}/`;

    axios.get(endpoint)
        .then((res) => {
            dispatch(setCurrentLink(res.data))
        })
        .catch((err) => dispatch({
            type: GET_ERRORS,
            payload: err
        }));
};

export const getVolunteer = (id) => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.volunteers.fetchByid}/${id}`;

    axios.get(endpoint)
    .then((res) => {
        // set current volunteers
        dispatch(setCurrentUser(res.data))
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

export const getSchoolPersonnel = (id) => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.schoolPersonnels.fetchByid}/${id}`;

    axios.get(endpoint)
    .then((res) => {
        // set current volunteers
        dispatch(setCurrentUser(res.data))
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

export const updateVolunteer = (id, form) => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.volunteers.update}/${id}`;

    axios.put(endpoint, form)
    .then((res) => {
        dispatch(getVolunteer(res.data.id))
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
 };

 export const updateVolunteerProfile = (id, form) => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.volunteers.updateProfile}/${id}`;

    axios.put(endpoint, form)
    .then((res) => {
        dispatch(getVolunteer(res.data.id))
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
 };


export const setCurrentUser = user => {
    return {
        type: SET_USER,
        payload: user
    };
};

export const setCurrentLink = link => {
    return {
        type: SET_USER,
        payload: link
    };
};

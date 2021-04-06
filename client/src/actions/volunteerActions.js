import axios from 'axios';
import serverConf from '../config'
import { GET_ERRORS, SET_VOLUNTEERS, VOLUNTEERS_LOADING} from './types';

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

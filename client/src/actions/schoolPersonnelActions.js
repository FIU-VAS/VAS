import axios from 'axios';
import serverConf from '../config'
import { GET_ERRORS, SET_SCHOOL_PERSONNELS, SCHOOL_PERSONNELS_LOADING, GET_SUCCESS} from './types';

// get school personnels from database
export const getSchoolPersonnels = (code) => dispatch => {

    let endpoint = `${serverConf.uri}${serverConf.endpoints.schoolPersonnels.fetch}`;
    if (code) {
        endpoint += '/getPersonnelInfo/' + code.join()
    }

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
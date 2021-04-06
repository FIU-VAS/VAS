import axios from 'axios';
import serverConf from '../config'
import { GET_ERRORS, SET_SCHOOL_PERSONNELS} from './types';

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

// set school personnels
export const setCurrentSchoolPersonnels = schoolPersonnels => {
    return {
        type: SET_SCHOOL_PERSONNELS,
        payload: schoolPersonnels
    };
};
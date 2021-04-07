import axios from 'axios';
import serverConf from '../config'
import { GET_ERRORS, SET_ADMINS} from './types';

// get admins from database
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

// set admins
export const setCurrentAdmins = admins => {
    return {
        type: SET_ADMINS,
        payload: admins
    };
};

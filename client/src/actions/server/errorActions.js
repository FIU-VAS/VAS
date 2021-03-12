import {CLEAR_ERRORS, GET_ERRORS} from '../types';

// clear errors
export const clearErrors = () => dispatch => {
    dispatch({
        type: CLEAR_ERRORS,
        payload: {}
    })
};

export const setErrors = errors => {
    return {
        type: GET_ERRORS,
        payload: errors
    };
};
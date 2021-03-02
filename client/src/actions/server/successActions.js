import { CLEAR_SUCCESS, REDIRECT } from '../types';

// clear success
export const clearSuccess = () => dispatch => {
    dispatch({
        type: CLEAR_SUCCESS,
        payload: {}
    })
};

export const redirect = link => {
    return {
        type: REDIRECT,
        payload: link
    }
}
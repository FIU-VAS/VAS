import axios from 'axios';
import serverConf from '../config'
import {
    GET_ERRORS,
    TEAMS_LOADING,
    SET_TEAMS_CALENDAR,
    SET_VOLUNTEERS_CALENDAR,
    SET_SCHOOLS_CALENDAR,
    SET_SCHOOL_PERSONNEL_CALENDAR
} from './types';

export const getSchools = schoolCodes => dispatch => {

    let codes = schoolCodes.join()

    const endpoint = `${serverConf.uri}${serverConf.endpoints.schools.getSchoolInfo}/${codes}`;

    axios.get(endpoint)
    .then((res) => {
        dispatch(setSchools(res.data));
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

export const getSchoolPersonnel = schoolCodes => dispatch => {

    let codes = schoolCodes.join();
    const endpoint = `${serverConf.uri}${serverConf.endpoints.schoolPersonnels.getPersonnelInfo}/${codes}`;

    axios.get(endpoint)
        .then((res) => {
            dispatch(setSchoolPersonnel(res.data));
        })
        .catch((err) => dispatch({
            type: GET_ERRORS,
            payload: err
        }));
}

// set teams
export const setSemesterTeams = teams => {
    return {
        type: SET_TEAMS_CALENDAR,
        payload: teams
    };
};

// set volunteers
export const setVolunteers = volunteers => {
    return {
        type: SET_VOLUNTEERS_CALENDAR,
        payload: volunteers
    };
};

// set schools
export const setSchools = schools => {
    return {
        type: SET_SCHOOLS_CALENDAR,
        payload: schools
    };
};

// set schoolPersonnel
export const setSchoolPersonnel = () => {
    return {
        type: SET_SCHOOL_PERSONNEL_CALENDAR
    };
};

// teams loading
export const setTeamsLoading = () => {
    return {
        type: TEAMS_LOADING
    };
};

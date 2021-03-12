import axios from 'axios';
import serverConf from '../config'
import { GET_ERRORS, TEAMS_LOADING, SET_TEAMS_CALENDAR, SET_VOLUNTEERS_CALENDAR, SET_SCHOOLS_CALENDAR} from './types';

// get teams from database
export const getTeams = form => dispatch => {


};

export const getVolunteers = pids => dispatch => {

    let pantherIDs = pids.join()

    const endpoint = `${serverConf.uri}${serverConf.endpoints.volunteers.getVolunteerInfo}/${pantherIDs}`;

    axios.get(endpoint)
    .then((res) => {
        dispatch(setVolunteers(res.data));    
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

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

// teams loading
export const setTeamsLoading = () => {
    return {
        type: TEAMS_LOADING
    };
};

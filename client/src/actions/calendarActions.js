import axios from 'axios';
import serverConf from '../config'
import { GET_ERRORS, TEAMS_LOADING, SET_TEAMS_CALENDAR, SET_VOLUNTEERS_CALENDAR, SET_SCHOOLS_CALENDAR} from './types';

// get teams from database
export const getTeams = form => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.team.fetch}`;

    axios.get(endpoint, form)
    .then((res) => {
        
        let teams = [];

        teams = res.data.filter(team => team.semester === form.semester && team.year === form.year)

        let allVolunteers = []
        let allSchools = []

        teams.forEach(team => {
            allVolunteers.push(team.volunteerPIs)
            allSchools.push(team.schoolCode)
        });

        let allVolunteers_INT = allVolunteers.map(String).toString().split(',').map(x=>+x)

        // set current teams
        dispatch(setSemesterTeams(teams));
        dispatch(getVolunteers(allVolunteers_INT))
        dispatch(getSchools(allSchools))    
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
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

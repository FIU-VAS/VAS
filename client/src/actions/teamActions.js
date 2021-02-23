import axios from 'axios';
import serverConf from '../config'
import { GET_ERRORS, SET_TEAMS, TEAMS_LOADING, GET_SUCCESS} from './types';

// get teams from database
export const getTeams = () => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.team.fetch}`;

    axios.get(endpoint)
    .then((res) => {
        // set current teams
        dispatch(setCurrentTeams(res.data));    
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

// add teams to database and refresh the store
export const addTeam = uneditedform => dispatch => {

    let form = JSON.parse(JSON.stringify(uneditedform));

    form.volunteerPIs = form.volunteerPIs.join()

    console.log(form)

    const endpoint = `${serverConf.uri}${serverConf.endpoints.team.create}`;

    axios.post(endpoint, form)
    .then((res) => {
        dispatch(getTeams());
        dispatch({
            type: GET_SUCCESS,
            payload: res.data.message
        });   
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
 };

 // make changes to teams in the database and refresh the store
export const editTeam = (id, uneditedform) => dispatch => {

    let form = JSON.parse(JSON.stringify(uneditedform));

    form.volunteerPIs = form.volunteerPIs.join()

    console.log(form)

    const endpoint = `${serverConf.uri}${serverConf.endpoints.team.update}/${id}`;

    axios.put(endpoint, form)
    .then((res) => {
        // set current teams
        dispatch(getTeams());
        dispatch({
            type: GET_SUCCESS,
            payload: res.data.message
        });   
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
 };

// teams loading
export const setTeamsLoading = () => {
    return {
        type: TEAMS_LOADING
    };
};

// set teams
export const setCurrentTeams = teams => {
    return {
        type: SET_TEAMS,
        payload: teams
    };
};

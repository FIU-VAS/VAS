import axios from 'axios';
import serverConf from '../config'
import {GET_ERRORS, SET_TEAMS, TEAMS_LOADING, GET_SUCCESS, UPDATE_TEAMS} from './types';
import {fromUTC} from "../utils/availability";

// get teams from database
export const getTeams = () => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.team.fetch}`;

    axios.get(endpoint)
    .then((res) => {
        // set current teams
        const teams = res.data.map(team => {
            team.availability = fromUTC(team.availability);
        });
        dispatch(setCurrentTeams(teams));
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

// set teams
export const setCurrentTeams = teams => {
    return {
        type: SET_TEAMS,
        payload: teams
    };
};

export const updateCurrentTeams = team => {
    return {
        type: UPDATE_TEAMS,
        payload: team
    };
};

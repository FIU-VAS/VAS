import axios from 'axios';
import serverConf from '../config'
import { GET_ERRORS, SET_TEAMS_REQ_SCH, SET_VOLUNTEERS_REQ_SCH, SET_SCHOOL_REQ_SCH, SET_SCHOOL_PERSONNEL_REQ_SCH, SET_ADMINS_REQ_SCH} from './types';

// get teams from database
export const getTeamRequest = schoolCode => dispatch => {
    console.log("school code: ", schoolCode)

    const endpoint = `${serverConf.uri}${serverConf.endpoints.team.getTeamInfoSch}/${schoolCode}`;

    axios.get(endpoint)
    .then((res) => {

        let allVolunteers = []

        res.data.forEach(team => {
            console.log("PID ARRAY: ", team.volunteerPIs)
            allVolunteers.push(team.volunteerPIs)
        });

        dispatch(setTeams(res.data));
        dispatch(getVolunteersRequest(allVolunteers))
        dispatch(getSchoolRequest(schoolCode))
        dispatch(getSchoolPersonnelsRequest(schoolCode))
        dispatch(getAdmins())    
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

export const getVolunteersRequest = pids => dispatch => {

    let pantherIDs = pids.join()

    const endpoint = `${serverConf.uri}${serverConf.endpoints.volunteers.getVolunteerInfo}/${pantherIDs}`;

    axios.get(endpoint)
    .then((res) => {
        console.log("RES_Volunteers ", res.data)
        dispatch(setVolunteers(res.data));    
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

export const getSchoolRequest = schoolCode => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.schools.getSchoolInfo}/${schoolCode}`;

    axios.get(endpoint)
    .then((res) => {
        console.log("RES_Schools ", res.data)
        dispatch(setSchool(res.data));         
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

export const getSchoolPersonnelsRequest = schoolCode => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.schoolPersonnels.getPersonnelInfo}/${schoolCode}`;

    axios.get(endpoint)
    .then((res) => {
        console.log("RES_Personnels ", res.data)
        dispatch(setSchool_Personnel(res.data));    
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

export const getAdmins = () => dispatch => {

    const endpoint = `${serverConf.uri}${serverConf.endpoints.admin.fetch}`;

    axios.get(endpoint)
    .then((res) => {
        dispatch(setAdmins(res.data));
    })
    .catch((err) => dispatch({
        type: GET_ERRORS,
        payload: err
    }));
};

// set teams
export const setTeams = teams => {
    return {
        type: SET_TEAMS_REQ_SCH,
        payload: teams
    };
};

// set volunteers
export const setVolunteers = volunteers => {
    return {
        type: SET_VOLUNTEERS_REQ_SCH,
        payload: volunteers
    };
};

// set schools
export const setSchool = school => {
    return {
        type: SET_SCHOOL_REQ_SCH,
        payload: school
    };
};

// set school personnel
export const setSchool_Personnel = schPersonnel => {
    return {
        type: SET_SCHOOL_PERSONNEL_REQ_SCH,
        payload: schPersonnel
    };
};

// set admins
export const setAdmins = admins => {
    return {
        type: SET_ADMINS_REQ_SCH,
        payload: admins
    };
};
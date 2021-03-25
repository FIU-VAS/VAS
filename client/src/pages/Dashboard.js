import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SideBar from "../components/AppBar/SideBar";
import {withRouter} from 'react-router-dom';
import config from "../config";
import VolunteerDashboard from "../components/Dashboards/VolunteerDashboard";
import AdminDashboard from "../components/Admins/AdminDashboard";
import SchoolPersonnelDashboard from "../components/Dashboards/SchoolPersonnelDashboard";
import serverConf from "../config";
import axios from "axios";
import {parseISO} from "date-fns";
import {setSemesterTeams} from "../actions/calendarActions";
import {setErrors} from "../actions/server/errorActions";
import {getAdmins} from "../actions/adminActions";
import {logoutUser} from "../actions/authActions";
import {getVolunteers} from "../actions/volunteerActions";
import {getSchools} from "../actions/schoolActions";
import {getSchoolPersonnels} from "../actions/schoolPersonnelActions";


const useStyles = {
    cell: {
        marginTop: 20,
        minWidth: 200,
        width: '95%',
    }
}

const Dashboard = (props) => {

    let now = new Date();
    const semesterYear = {
        semester: now.getMonth() > 6 ? "Fall" : "Spring",
        year: now.getFullYear()
    }

    useEffect( () => {
        const endpoint = `${serverConf.uri}${serverConf.endpoints.team.fetch}`;

        // useEffect does not expect a return so async has to be used like this
        (async () => {
            try {
                const response = await axios.get(endpoint, {
                    params: semesterYear
                });

                let teams = response.data.map(team => ({
                    ...team,
                    availability: team.availability.map(av => ({
                        ...av,
                        startTime: parseISO(av.startTime),
                        endTime: parseISO(av.endTime),
                    }))
                }));

                let allVolunteers = []
                let allSchools = []

                teams.forEach(team => {
                    allVolunteers.push(team.volunteerPIs)
                    allSchools.push(team.schoolCode)
                });

                allVolunteers = allVolunteers.map(String).toString().split(',').map(x=>+x)

                // set current teams
                props.setSemesterTeams(teams);
                props.getVolunteers(allVolunteers);
                props.getSchools(allSchools);
                props.getSchoolPersonnels(allSchools);
            } catch (httpError) {
                props.setErrors(httpError)
                if (httpError.response && httpError.response.status === 401) {
                    // props.logoutUser();
                    // window.location.href = "/login";
                }
            }
        })();
        props.getAdmins();
    }, [])

    const getPage = () => {
        const {auth} = props;
        switch (auth.role) {
            case config.userRoles.admin:
                return (<AdminDashboard semesterYear={semesterYear}/>);
            case config.userRoles.volunteer:
                return (<VolunteerDashboard/>);
            case config.userRoles.schoolPersonnel:
                return (<SchoolPersonnelDashboard/>);
        }
    }

    return (
        
        <Grid container className={props.classes.all}>

            <Grid item xs={1}>
                <SideBar/>
            </Grid> 
            

            <Grid
                item xs={11}
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center">
                <Grid item className={props.classes.cell}>
                    {getPage()}
                </Grid>
            </Grid>
        </Grid>

    )
}

// define types
Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
};

// allows us to get our state from Redux and map it to props
const mapStateToProps = state => ({
    auth: state.auth,
    user: state.userData.user,
});

export default connect(
    mapStateToProps,
    {
        setSemesterTeams,
        getVolunteers,
        getSchools,
        setErrors,
        getAdmins,
        logoutUser,
        getSchoolPersonnels
    }
)(withRouter(withStyles(useStyles)(Dashboard)));
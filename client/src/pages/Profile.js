import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import AdminProfile from '../components/Profile/AdminProfile';
import VolunteerProfile from '../components/Profile/VolunteerProfile';
import SideBar from "../components/AppBar/SideBar";
import SchoolPersonnelProfile from '../components/Profile/SchoolPersonnelProfile';
import { Grid } from '@material-ui/core';
import config from "../config";
import '../../src/App.css';

class Profile extends Component {

    getProfile() {
        const {auth} = this.props;
        switch (auth.role) {
            case config.userRoles.admin:
                return (<AdminProfile user={auth} />)
            case config.userRoles.volunteer:
                return (<VolunteerProfile/>)
            case config.userRoles.schoolPersonnel:
                return (<SchoolPersonnelProfile/>)
            default:
                return "";
        }
    }

    render() {
        if (!this.props.user) {
            return "Loading"
        }
        return (
           
        <Grid className="bg" container>

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
                <Grid item>
                    {this.getProfile()}
                </Grid>
            </Grid>
        </Grid>
            
        )
    }
}

// define types
Profile.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// allows us to get our state from Redux and map it to props
const mapStateToProps = state => ({
    auth: state.auth,
    user: state.userData.user,
    errors: state.errors
});

export default connect(
    mapStateToProps,
)(withRouter(Profile));
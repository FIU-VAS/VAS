import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import Admin_Profile from '../components/Profile/Admin_Profile';
import Volunteer_Profile from '../components/Profile/Volunteer_Profile';
import SideBar from "../components/AppBar/SideBar";
import SchoolPersonnel_Profile from '../components/Profile/SchoolPersonnel_Profile';
import { Grid } from '@material-ui/core';
import config from "../config";
import '../../src/App.css';

class Profile extends Component {

    getProfile() {
        const {auth} = this.props;
        switch (auth.role) {
            case config.userRoles.admin:
                return (<Admin_Profile user={auth} />)
            case config.userRoles.volunteer:
                return (<Volunteer_Profile/>)
            case config.userRoles.schoolPersonnel:
                return (<SchoolPersonnel_Profile/>)
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
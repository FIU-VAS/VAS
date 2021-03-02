import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import Admin_Profile from '../components/Profile/Admin_Profile'
import Volunteer_Profile from '../components/Profile/Volunteer_Profile'
import SchoolPersonnel_Profile from '../components/Profile/SchoolPersonnel_Profile'
import config from "../config";



class Profile extends Component{

    getProfile() {
        const { auth } = this.props;
        switch (auth.role) {
            case config.userRoles.admin:
                return (<Admin_Profile/>)
            case config.userRoles.volunteer:
                return (<Volunteer_Profile/>)
            case config.userRoles.schoolPersonnel:
                return (<SchoolPersonnel_Profile/>)
        }
    }

    render(){
        return (
            <div>
                { this.getProfile() }
            </div>
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
    errors: state.errors
  });
  
  export default connect (
    mapStateToProps,
  )(withRouter(Profile));
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import isEmpty from 'is-empty';
import Admin_Dashboard_MiddleMan from '../components/Dashboards/Admin_DashboarMiddleMan';
import Volunteer_Dashbaord_MiddleMan from '../components/Dashboards/Volunteer_Dashbaord_MiddleMan';
import Personnel_Dashbaord_MiddleMan from '../components/Dashboards/Personnel_Dashbaord_MiddleMan'
import config from "../config";

const useStyles = {
    all: {
        //backgroundColor: '#fafafa',
        //background: 'linear-gradient(to bottom, #33ccff 0%, #ff99cc 100%)',

        height: '180vh'
    },
    cell: {
        marginTop: 20,
        minWidth: 200,
        width: '95%',
        height: 900,
        
    }
}

class Dashboard extends Component {

    getPage = () => {
        const { auth } = this.props;
        switch (auth.role) {
            case config.userRoles.admin:
                return (<Admin_Dashboard_MiddleMan/>);
            case config.userRoles.volunteer:
                return (<Volunteer_Dashbaord_MiddleMan/>);
            case config.userRoles.schoolPersonnel:
                return (<Personnel_Dashbaord_MiddleMan/>);
        }
    }
    
    render(){
        const { auth } = this.props;
        return (
            <div className={this.props.classes.all}
                style={{backgroundImage: 'url(' + require('../images/FIU_1_10.png') + ')',
                backgroundPosition: 'center',
                backgroundSize: 'cover' }}>
                
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center">

                    <Grid item className={this.props.classes.cell}>
                        {this.getPage()}
                    </Grid>

                    
                </Grid>
            </div>
            
        )
    }
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
  
  export default connect (
    mapStateToProps,
  )(withRouter(withStyles(useStyles)(Dashboard)));
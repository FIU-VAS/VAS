import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { blueGrey, blue, grey } from '@material-ui/core/colors';
import TeamCalendar from "../Teams/TeamCalendar";

const useStyles = {
    all: {
        backgroundColor: '#fafafa',
        height: '100vh'
    },
    cardHeader: {
        height: 60,
    },
    card: {
        marginTop: 10,
        minWidth: '50%',
        maxWidth: 500,
        height: 400,
        backgroundColor: 'white',
        marginBottom: '20px',
        'overflow-x': 'hidden'
    },
    custom: {
        justify: 'center',
        minWidth: '300px',
        maxWidth: '50%',
    },
    buttons: {
        backgroundColor: blueGrey[700],
        color: "white",
        fontWeight: "bold",
        '&:hover': {
            backgroundColor: blue[500],
        }
    },
    main: {
        fontSize: 30,
        fontWeight: 800,
        color: grey[1000],
        alignItems: 'left',
        justify: 'left',
    },
    cardTitle: {
        fontSize: "20px",
        fontWeight: 800,
        color: 'white',
        alignItems: 'right'
    },
    title: {
        fontSize: 18,
        fontWeight: 800,
        color: grey[800],
        alignItems: 'right'
    },
    this: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'left',
        minWidth: '80%',
      },
    subHeading: {
        fontSize: 15,
        alignItems: 'left'
    },
    body: {
        fontSize: 13,
        alignItems: 'right',
    },
}

class SchoolPersonnelDashboard extends Component {

    render() {
        return (
            <Fragment>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <Typography className={this.props.classes.main} display="inline" style={{marginBottom: '5px'}}>
                            Welcome {this.props.user.firstName} !
                    </Typography>

                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                        className={this.props.classes.custom} 
                    >
                        <Typography className={this.props.classes.subHeading} color="textPrimary" align='center' variant="h6" display="inline" style={{marginBottom: '10px'}}  >
                            Below is the information of the team(s) assigned to your school. &nbsp;
                        </Typography>
                    </Grid>
                </Grid>

                <TeamCalendar hideEmpty={true}/>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    user: state.userData.user,
    schoolPersonnel: state.schoolPersonnelRequests,
    admins: state.adminData.admins,
    schools: state.schoolData.schools
});

export default connect (
    mapStateToProps  
)(withRouter(withStyles(useStyles)(SchoolPersonnelDashboard)));
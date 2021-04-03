import React, {Fragment, useEffect} from 'react';
import {Switch, withRouter, useRouteMatch, Route} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import {connect} from "react-redux";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {blueGrey, blue, grey} from '@material-ui/core/colors';
import TeamCalendar from "../Teams/TeamCalendar";
import AdminRoute from "../Routes/AdminRoute";
import VolunteerManagement from "../../pages/VolunteerManagement";
import SchoolPersonnelManagement from "../../pages/SchoolPersonnelManagement";
import SchoolManagement from "../../pages/SchoolManagement";
import TeamManagement from "../../pages/TeamManagement";
import AdminManagement from "../../pages/AdminManagement";
import {Box} from "@material-ui/core";

const useStyles = {
    card: {
        marginTop: 10,
        minWidth: '80%',
        maxWidth: 750,
        height: '100%',
        backgroundColor: 'white'
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
        fontSize: 36,
        fontWeight: 800,
        color: grey[1000],
        alignItems: 'left',
        justify: 'left',
    },
    title: {
        fontSize: 18,
        fontWeight: 800,
        color: grey[800],
        alignItems: 'right'
    },
    this: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'left',
        minWidth: '80%',
    },
}

const AdminDashboard = (props) => {
    let {path} = useRouteMatch();
    const {semesterYear} = props;


    const getTodaysDate = () => {
        var options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        var today = new Date();
        return (today.toLocaleDateString("en-US", options))
    }

    return (
        <Fragment>
            <Box
                style={{textAlign: "center"}}>
                <Typography
                    className={props.classes.main}
                    style={{marginBottom: '15px'}}
                    align="center"
                >
                    Admin Dashboard
                </Typography>
            </Box>

            <Switch>
                <Route exact path={path}>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                        className={props.classes.custom}
                    >

                        <Typography shadow={3} color="textPrimary" align='center' variant="h6" display="inline"
                                    style={{marginTop: '30px', fontSize: 30, fontWeight: 800, /* color: blue[500] */}}>
                            {semesterYear.semester + " " + semesterYear.year}
                        </Typography>

                        <Typography color="textPrimary" align='center' variant="h6" display="inline"
                                    style={{marginTop: '5px'}}>
                            {getTodaysDate()} &nbsp;
                        </Typography>
                    </Grid>

                    <TeamCalendar onlyTeams={true}/>
                </Route>
                <AdminRoute path={`${path}/volunteer-management`} component={VolunteerManagement}/>
                <AdminRoute path={`${path}/school-personnel-management`} component={SchoolPersonnelManagement}/>
                <AdminRoute path={`${path}/school-management`} component={SchoolManagement}/>

                <AdminRoute path={`${path}/team-management`} component={TeamManagement}/>

                <AdminRoute path={`${path}/admin-management`} component={AdminManagement}/>
            </Switch>

        </Fragment>
    )
}

const mapStateToProps = state => ({
    errors: state.errors
});

export default connect(
    mapStateToProps
)(withRouter(withStyles(useStyles)(AdminDashboard)));
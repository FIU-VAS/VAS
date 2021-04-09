import React from 'react';
import {connect} from "react-redux";
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import {Day} from "./Calendar/Day";
import {Grid, Typography} from "@material-ui/core";
import {isValid} from "date-fns";

const calendarStyles = makeStyles(theme => ({
    calendar: {
        padding: "0 calc(0.8rem * 3) 0 calc(0.8rem * 3)",
    },
    dayColumn: {
        position: "relative",
        background: 'rgb(245, 248, 250)',
        margin: "0.25rem 0.5rem",
        padding: "0.25rem 0.25rem 2rem 0.25rem",
        boxShadow: "0px 1px 2px 1px rgba(0,0,0,0.2)",
        borderRadius: "4px"
    },
}));

const Days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

export const AppTeamCalendar = (props) => {

    let {teams} = props;
    const classes = calendarStyles();

    if (!teams.length) {
        return (
            <Typography align="center" variant="h2">
                There are no teams to show
            </Typography>
        )
    }

    return (
        <Box my={3} style={{overflowX: "scroll"}}>
            <Grid container className={classes.calendar}>
                {Days.map((day, index) => {
                    const dayTeams = teams.filter(team => {
                        return team.availability.some(av => av.dayOfWeek === day)
                    });

                    return (
                        <Grid key={day} item xs className={classes.dayColumn}>
                            <Day day={day} dayTeams={dayTeams} dayIndex={index}/>
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}

AppTeamCalendar.propTypes = {};

const mapStateToProps = state => ({
    teams: state.teamData.teams,
    volunteers: state.volunteers.volunteers,
    schoolPersonnels: state.schoolPersonnels.schoolPersonnels,
    schools: state.schoolData.schools,
    admins: state.adminData.admins
});


export default connect(
    mapStateToProps,
    {}
)(AppTeamCalendar);
import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {withStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {blueGrey, blue, grey, yellow} from '@material-ui/core/colors';
import EventIcon from '@material-ui/icons/Event';
import {TeamDay} from "./TeamDay";
import {TeamCard} from "./TeamCard";
import {TeamAdmin} from "./TeamAdmin";
import {TeamPersonnel} from "./TeamPersonnel";

const useStyles = {
    all: {
        backgroundColor: '#fafafa',
        height: '100vh'
    },
    cardHeader: {
        padding: "1rem 0"
    },
    card: {
        margin: "10px auto 0 auto",
        minWidth: '60%',
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
        fontWeight: 800,
        color: grey[1000],
        alignItems: 'left',
        justify: 'left',
    },
    cardTitle: {
        fontSize: "20px",
        fontWeight: 800,
        alignItems: 'right'
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
    subHeading: {
        fontSize: 15,
        alignItems: 'left'
    },
    body: {
        fontSize: 13,
        alignItems: 'right',
    },
}

const Days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

const TeamCalendar = (props) => {

    const {teams, schools, hideEmpty, schoolPersonnels} = props;

    const getDayColor = (day) => {
        const today = new Date();
        return today.getDay() < 6 && Days[today.getDay()] === day ? [yellow[600], "black"] : [blue[500], "white"];
    }

    // @TODO Add school personnel to the calendar card

    return (
        <Box>
            {Days.map(day => {
                const dayTeams = teams.filter(team => {
                    return team.availability.some(av => av.dayOfWeek === day)
                });

                if (dayTeams.length === 0 && hideEmpty) {
                    return "";
                }

                return (
                    <TeamCard
                        cardHeader={day}
                        cardHeaderIcon={(<EventIcon style={{verticalAlign: "text-bottom"}}/>)}
                        headerColor={getDayColor(day)[0]}
                        alignHeaderCenter={true}
                    >
                        {dayTeams.length ? (
                            <TeamDay
                                teams={dayTeams}
                                schools={schools}
                                volunteers={props.volunteers}
                                classes={props.classes}
                                day={day}
                            />
                        ) : (
                            <Typography className={props.classes.body} color="textPrimary" variant="body1"
                                        display="inline"
                                        gutterBottom>
                                &nbsp; &#8226; &nbsp; There are no teams scheduled on {day}s<br/>
                            </Typography>
                        )}
                    </TeamCard>
                )
            })}
            <TeamPersonnel
                school={schools.length ? schools[0] : {}}
                schoolPersonnel={schoolPersonnels.length ? schoolPersonnels[0] : {}}
            />
            <TeamAdmin admins={props.admins} />
        </Box>
    )
}

TeamCalendar.propTypes = {};

const mapStateToProps = state => ({
    teams: state.calendar.teams,
    volunteers: state.volunteers.volunteers,
    schoolPersonnels: state.schoolPersonnels.schoolPersonnels,
    schools: state.schoolData.schools,
    admins: state.adminData.admins
});


export default connect(
    mapStateToProps,
    {}
)(withRouter(withStyles(useStyles)(TeamCalendar)));
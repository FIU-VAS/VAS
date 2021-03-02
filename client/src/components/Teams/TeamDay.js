import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import React, {Fragment} from "react";
import {parse, format} from "date-fns";

export const TeamDay = (props) => {

    const {day, teams, schools, volunteers} = props;

    const convertTime = (time) => {
        return format(parse(time, "HH:mm", new Date()), "HH:mm aa")
    }

    return (
        teams.map(team => {
            const school = schools.filter(school => team.schoolCode === school.schoolCode);
            const dayDetails = team.availability.find(av => av.dayOfWeek === day);
            const volunteerList = volunteers.filter(
                volunteer => team.volunteerPIs.includes((volunteer.pantherID).toString()) && volunteer.isActive
            )

            return (
                <Box key={team}>
                    <Typography
                        className={props.classes.title}
                        style={{marginBottom: '1px', alignItems: 'left', marginTop: '1px'}}>
                        Team:
                    </Typography>
                    <Typography className={props.classes.subHeading} color="textPrimary" variant="h6"
                                display="inline">
                        School: &nbsp;
                    </Typography>
                    {school.length && (
                        <Typography className={props.classes.body} color="textPrimary" variant="body1"
                                    display="inline" gutterBottom>
                            {school[0].schoolName + " " + school[0].level} <br/>
                        </Typography>
                    )}
                    <Typography className={props.classes.subHeading} color="textPrimary" variant="h6"
                                display="inline">
                        Time: &nbsp;
                    </Typography>
                    <Typography className={props.classes.body} color="textPrimary" variant="body1" display="inline"
                                gutterBottom>
                        From <strong>{convertTime(dayDetails.startTime)}</strong> to <strong>{convertTime(dayDetails.endTime)}</strong><br/>
                    </Typography>
                    <Typography className={props.classes.subHeading} color="textPrimary" variant="h6"
                                display="inline">
                        Volunteers: &nbsp; <br/>
                    </Typography>
                    {volunteerList.map(volunteer => {
                        return (<Fragment>
                                <Typography className={props.classes.body} color="textPrimary" variant="body1"
                                            display="inline" gutterBottom>
                                    &nbsp; &#8226; &nbsp; {volunteer.firstName + "  " + volunteer.lastName + " - "}
                                </Typography>
                                <Typography className={props.classes.body}
                                            style={{
                                                fontStyle: 'italic',
                                                color: volunteer.carAvailable ? '#43a047' : '#e53935'
                                            }}
                                            variant="body1" display="inline" gutterBottom>
                                    {volunteer.carAvailable ? 'Available for carpool' : 'Not Available for carpool'}<br/>
                                </Typography>
                                <Typography className={props.classes.body} color="textPrimary" variant="body1"
                                            display="inline" gutterBottom>
                                    &nbsp; &nbsp; &nbsp; &#9702; &nbsp;{volunteer.phoneNumber} <br/>
                                    &nbsp; &nbsp; &nbsp; &#9702; &nbsp;{volunteer.email} <br/>
                                </Typography>
                            </Fragment>
                        )

                    })}<br/>

                </Box>
            )
        })
    )
}
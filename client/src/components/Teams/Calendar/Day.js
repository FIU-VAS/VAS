import React from "react";
import {Grid, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {TeamCard} from "./TeamCard";


const dayStyles = makeStyles(theme => ({
    header: {
        background: "transparent",
        marginBottom: "0.85rem",
        borderBottom: "1px solid " + theme.palette.grey[300]
    }
}))


export const Day = (props) => {

    const {day, dayIndex, dayTeams} = props;

    const classes = dayStyles();
    const today = new Date();

    return (
        <Grid container>
            <Grid item xs={12} className={classes.header}>
                <Typography
                    align="center"
                    style={{
                        color: today.getDay() - 1 === dayIndex ? "#57C965" : "rgba(0, 0, 0, 1)",
                        textTransform: "capitalize",
                        padding: "0.5rem 0",
                        fontWeight: today.getDay() - 1 === dayIndex ? 700 : 400
                    }}
                >
                    {day}
                </Typography>
            </Grid>
            {dayTeams.sort((a, b) => (a.isActive === b.isActive)? 0 : a.isActive ? -1 : 1).map(team => {
                return (
                    <TeamCard key={team._id} team={team} day={day} />
                )
            })}
        </Grid>
    )
};
import React, {useState} from 'react';
import {
    FormControl, Select, InputLabel, MenuItem, Button, Typography, makeStyles, Grid, Box, IconButton
} from "@material-ui/core";
import {Clear, Add} from "@material-ui/icons";
import {blueGrey, blue} from '@material-ui/core/colors';
import {startOfToday, addHours, addMinutes, subHours, format, parse, parseISO} from "date-fns";
import {REFERENCE_DATE} from "../Teams/Calendar/utils";

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: blueGrey[500],
        '&:hover': {
            backgroundColor: blue[500],
        }
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    selectDay: {
        minWidth: "125px",
        marginBottom: "15px",
        marginRight: "15px"
    },
    selectTime: {
        minWidth: "80px",
        marginBottom: "15px",
        marginRight: "15px"
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: blueGrey[700],
        color: "white",
        fontWeight: "bold",
        '&:hover': {
            backgroundColor: blue[500],
        }
    },
    logo: {
        height: '80px',
        marginBottom: '0px'
    },
}));

export const validateAvailability = (availability) => {
    let valid = true;

    availability.forEach((timeSlot, index) => {
        if (timeSlot.dayOfWeek === "" || timeSlot.startTime === "" || timeSlot.endTime === "") {
            valid = false;
        }
        const startTime = parse(timeSlot.startTime, "H:mm aa", REFERENCE_DATE);
        const endTime = parse(timeSlot.endTime, "H:mm aa", REFERENCE_DATE);
        if (startTime === endTime || startTime > endTime) {
            valid = false;
        }
    });

    return valid;
}

export const AvailabilityForm = React.forwardRef((props, ref) => {
    const {onChange, onBlur, value, name, label} = props;

    const [availability, setAvailability] = useState(
        value && value.length
            ? value
            : [{dayOfWeek: "", startTime: "", endTime: ""}]
    );

    const addSlot = () => {
        setAvailability([...availability, {dayOfWeek: "", startTime: "", endTime: ""}]);
    }

    const removeSlot = index => {
        if (availability.length === 1) {
            setAvailability([{dayOfWeek: "", startTime: "", endTime: ""}]);
        } else {
            const list = [...availability];
            list.splice(index, 1);
            setAvailability(list);
            onChange(list);
        }
    }

    const handleChange = (event, index) => {
        const {name, value} = event.target;
        const list = [...availability];
        list[index][name] = value;
        setAvailability(list);
        onChange(list);
    }

    const days = [
        {value: "monday", label: "Monday"},
        {value: "tuesday", label: "Tuesday"},
        {value: "wednesday", label: "Wednesday"},
        {value: "thursday", label: "Thursday"},
        {value: "friday", label: "Friday"}
    ]

    let startTime = addHours(startOfToday(), 14);
    const endTime = addHours(startOfToday(), 18);

    const startTimes = [];
    const endTimes = [];

    while (startTime <= endTime) {
        if (startTime < subHours(endTime, 1)) {
            startTimes.push({
                value: format(startTime, "HH:mm"),
                label: format(startTime, "h:mm aa"),
            });
        }
        endTimes.push({
            value: format(startTime, "HH:mm"),
            label: format(startTime, "h:mm aa"),
        });
        startTime = addMinutes(startTime, 15)
    }

    const classes = useStyles();

    return (
        <Box>
            <Typography component="h1" variant="h5">
                {label}
            </Typography>
            {availability.map((entry, index) => {
                return (
                    <Grid key={index} container spacing={1}>
                        <Grid item xs={3}>
                            <FormControl className={classes.selectDay} margin="dense" size="medium" fullWidth={true}>
                                <InputLabel id="day-of-week">Day</InputLabel>
                                <Select
                                    labelId="day-of-week"
                                    name="dayOfWeek"
                                    onChange={event => handleChange(event, index)}
                                    value={entry.dayOfWeek}
                                >
                                    {days.map((day) => (
                                        <MenuItem key={day.value} value={day.value}>
                                            {day.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl className={classes.selectTime} margin="dense" size="medium" fullWidth={true}>
                                <InputLabel id="start-time">Start Time</InputLabel>
                                <Select
                                    labelId="start-time"
                                    name="startTime"
                                    onChange={event => handleChange(event, index)}
                                    value={entry.startTime}
                                >
                                    {startTimes.map((time) => (
                                        <MenuItem key={time.value} value={time.value}>
                                            {time.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl className={classes.selectTime} margin="dense" size="medium" fullWidth={true}>
                                <InputLabel id="end-time">End Time</InputLabel>
                                <Select
                                    labelId="end-time"
                                    name="endTime"
                                    onChange={event => handleChange(event, index)}
                                    value={entry.endTime}
                                >
                                    {
                                        endTimes.map((time) => (
                                            <MenuItem key={time.value} value={time.value}>
                                                {time.label}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid container item xs={3} alignItems="center" justify="flex-end">
                            <Grid item xs={6}>
                                {index + 1 === availability.length && (
                                    <IconButton onClick={addSlot} disabled={availability.length >= 5} color="primary">
                                        <Add/>
                                    </IconButton>
                                )}
                            </Grid>
                            {availability.length !== 1 && (
                                <Grid item xs="auto">
                                    <IconButton onClick={() => removeSlot(index)}><Clear/></IconButton>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                )
            })}
        </Box>
    )
})

export default AvailabilityForm;
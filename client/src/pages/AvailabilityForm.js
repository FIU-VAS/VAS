import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import serverConf from "../config";
import { FormControl, Select, InputLabel, MenuItem } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { blueGrey, blue, lightGreen } from '@material-ui/core/colors';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/core/styles';
import SideBar from "../components/AppBar/SideBar";
import Avatar from '@material-ui/core/Avatar';
import DateRangeSharpIcon from '@material-ui/icons/DateRangeSharp';
import { BorderAllRounded } from '@material-ui/icons';
import {startOfToday, addHours, addMinutes, subHours, format, parseISO} from "date-fns";
import {setCurrentUser} from "../actions/userActions";

const theme = createMuiTheme({
    palette: {
        primary: blue,
    }
});

const useStyles = makeStyles({
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
        marginRight: "15px",
        backgroundColor: lightGreen[200],
        textAlign: 'center',
        borderRadius: '6px',
    },
    selectTime: {
        minWidth: "110px",
        marginBottom: "15px",
        marginRight: "15px",
        backgroundColor:lightGreen[200],
        textAlign: 'center',
        borderRadius: '6px',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: blueGrey[900],
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
    corner:{
        position: 'absolute',
        bottom: '0px',
        right: '0px',
        height: '500px',
        width: '500px',


    },
});

const AvailabilityForm = () => {
    const user = useSelector(state => state.userData.user);
    const dispatch = useDispatch();

    const endpoint = user.role === "volunteer" ? `${serverConf.uri}${serverConf.endpoints.volunteers.update}/${user._id}` : `${serverConf.uri}${serverConf.endpoints.schoolPersonnels.update}/${user._id}`;


    const [availability, setAvailability] = useState(
        (user.availability && user.availability.length)
            ? user.availability.map(available => ({
                ...available,
                startTime: format(parseISO(available.startTime), "HH:mm"),
                endTime: format(parseISO(available.endTime), "HH:mm")
            }))
            : [{ dayOfWeek: "", startTime: "", endTime: "" }]
    );

    const [errors, setErrors] = useState([""]);
    const [response, setResponse] = useState({success: false, message: ""});

    const addSlot = () => {
        setAvailability([...availability, { dayOfWeek: "", startTime: "", endTime: "" }]);
        setErrors([...errors, ""]);
    }

    const removeSlot = index => {
        const list = [...availability];
        list.splice(index, 1);
        setAvailability(list);

        const errList = [...errors];
        errList.splice(index, 1);
        setErrors(errList);
    }

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        const list = [...availability];
        list[index][name] = value;
        setAvailability(list);
    }

    const validateForm = () => {
        let valid = true;

        const errList = [...errors];
        availability.forEach((timeSlot, index) => {
            if (timeSlot.dayOfWeek === "" || timeSlot.startTime === "" || timeSlot.endTime === "" || timeSlot.startTime === timeSlot.endTime || timeSlot.startTime > timeSlot.endTime) {
                valid = false;               
                errList[index] = "Invalid time slot.";
            } else {
                errList[index] = "";
            }
        });
        setErrors(errList);

        if (valid)
            submitForm();
    }

    const submitForm = () => {
        axios.post(endpoint, {
            availability,
            email: user.email
        })
            .then(res => {
                setResponse({success: true, message: res.data.message});
                dispatch(setCurrentUser(res.data.result));
            })
            .catch(err => {
                if (err.response) {
                    setResponse({success: false, message: err.response.message});
                } else {
                    setResponse({success: false, message: err.message});
                }
            })
    }

    const days = [
        { value: "monday", label: "Monday" },
        { value: "tuesday", label: "Tuesday" },
        { value: "wednesday", label: "Wednesday" },
        { value: "thursday", label: "Thursday" },
        { value: "friday", label: "Friday" }
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
        <ThemeProvider theme={theme}>
            <SideBar></SideBar>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <div className={classes.paper}>
                    <img
                        className={classes.corner}
                        src={require("../images/Ignite_1.png").default}
                    />
                    

                    <Typography component="h1" variant="h4" >
                        Set Your Availability Schedule <DateRangeSharpIcon></DateRangeSharpIcon>
                    </Typography>
                    {response.message !== "" && <Alert severity={response.success ? "success" : "error"}>{response.message}</Alert>}
                    {availability.map((entry, index) => {
                        return (
                            <div key={index}>
                                <FormControl className={classes.selectDay} margin="dense" size="medium">
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
                                <FormControl className={classes.selectTime} margin="dense" size="medium">
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
                                <FormControl className={classes.selectTime} margin="dense" size="medium">
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
                                            ))}
                                    </Select>
                                </FormControl>

                                { availability.length !== 1 && <Button onClick={() => removeSlot(index)}><ClearIcon /></Button>}
                                { errors[index] !== "" && <div><Alert severity="error">{errors[index]}</Alert></div> } 
                            </div>
                            
                                                      
                        )
                    })}
                    <Button onClick={addSlot} color="primary">Add Day/Time Slot</Button>
                    <Button
                        onClick={validateForm}
                        variant="contained"
                        className={classes.submit}
                        disabled={response.success}
                    >
                        Submit
                    </Button>
                </div>
            </Container>
        </ThemeProvider>
    )
}

export default AvailabilityForm;
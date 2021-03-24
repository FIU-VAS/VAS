import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import serverConf from "../config";
import { FormControl, Select, InputLabel, MenuItem } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { blueGrey, blue } from '@material-ui/core/colors';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/core/styles';

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
});

const AvailabilityForm = () => {
    const user = useSelector(state => state.userData.user);
    const endpoint = user.role === "volunteer" ? `${serverConf.uri}${serverConf.endpoints.volunteers.update}/${user._id}` : `${serverConf.uri}${serverConf.endpoints.schoolPersonnels.update}/${user._id}`;

    const [availability, setAvailability] = useState([{ dayOfWeek: "", startTime: "", endTime: "" }]);
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
        let data = user;
        data.availability = availability;

        axios.post(endpoint, data)
            .then(res => {
                setResponse({success: true, message: res.data.message});
            })
            .catch(err => {
                console.log(err);
                setResponse({success: false, message: err.message});
            })
    }

    const days = [
        { value: "monday", label: "Monday" },
        { value: "tuesday", label: "Tuesday" },
        { value: "wednesday", label: "Wednesday" },
        { value: "thursday", label: "Thursday" },
        { value: "friday", label: "Friday" }
    ]

    const startTimes = [
        { value: "2:00 PM", label: "2:00" },
        { value: "2:15 PM", label: "2:15" },
        { value: "2:30 PM", label: "2:30" },
        { value: "2:45 PM", label: "2:45" },
        { value: "3:00 PM", label: "3:00" },
        { value: "3:15 PM", label: "3:15" },
        { value: "3:30 PM", label: "3:30" },
        { value: "3:45 PM", label: "3:45" },
        { value: "4:00 PM", label: "4:00" },
        { value: "4:15 PM", label: "4:15" },
        { value: "4:30 PM", label: "4:30" },
        { value: "4:45 PM", label: "4:45" },
        { value: "5:00 PM", label: "5:00" }
    ]

    const endTimes = [
        ...startTimes,
        { value: "5:15 PM", label: "5:15" },
        { value: "5:30 PM", label: "5:30" },
        { value: "5:45 PM", label: "5:45" },
        { value: "6:00 PM", label: "6:00" }
    ]

    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <div className={classes.paper}>
                    <img
                        className={classes.logo}
                        src={require("../images/VAS_shadow.png").default}
                        alt="logo"
                    />

                    <Typography component="h1" variant="h5">
                        Set Availability
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
                    <Button onClick={addSlot} color="primary">Add Slot</Button>
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
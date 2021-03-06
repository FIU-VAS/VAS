import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import serverConf from "../config";
import {Box, Grid} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { blueGrey, blue, lightGreen } from '@material-ui/core/colors';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/core/styles';
import {format} from "date-fns";
import {setCurrentUser} from "../actions/userActions";
import {useForm, Controller} from "react-hook-form";
import AvailabilityForm, {validateAvailability} from "../components/Extras/AvailabilityForm";
import SideBar from "../components/AppBar/SideBar";
import DateRangeSharpIcon from '@material-ui/icons/DateRangeSharp';
import {fromUTC} from "../utils/availability";

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
        padding: theme.spacing(2),
        marginTop: theme.spacing(2)
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
        backgroundColor: '#57C965',
        color: "white",
        fontWeight: "bold",
        '&:hover': {
            backgroundColor: '#57C965',
        }
    },
    logo: {
        height: '80px',
        marginBottom: '0px'
    },
});

const Availability = () => {
    const user = useSelector(state => state.userData.user);
    const dispatch = useDispatch();

    const endpoint = user.role === "volunteer" ? `${serverConf.uri}${serverConf.endpoints.volunteers.update}/${user._id}` : `${serverConf.uri}${serverConf.endpoints.schoolPersonnels.update}/${user._id}`;

    const [response, setResponse] = useState({success: false, message: ""});

    const submitForm = (availability) => {
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

    const classes = useStyles();

    const {handleSubmit, errors, watch, control} = useForm({
        defaultValues: {
            availability: (user.availability && user.availability.length)
                ? fromUTC(user.availability).map(available => ({
                    ...available,
                    startTime: format(available.startTime, "HH:mm"),
                    endTime: format(available.endTime, "HH:mm")
                }))
                : [{ dayOfWeek: "", startTime: "", endTime: "" }]
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <SideBar/>
            <Container component="main" maxWidth="md">
                <CssBaseline />
                    
                <Box className={classes.paper} width="100%">
                     <Typography component="h1" variant="h4" >
                        {user.role==="volunteer"? "Volunteer Schedule" : "School Personnel Schedule"} <DateRangeSharpIcon />
                    </Typography>
                    {response.message !== "" && <Alert severity={response.success ? "success" : "error"}>{response.message}</Alert>}
                    <form onSubmit={handleSubmit((data) => submitForm(data.availability))}
                          style={{width: "100%"}}>
                        <Grid container>
                            <Grid item xs={12} className={classes.selectDay} margin="dense" >
                                <Controller
                                    control={control}
                                    as={<AvailabilityForm />}
                                    name="availability"
                                    label="Set Availability"
                                    rules={{
                                        required: true,
                                        validate: validateAvailability,
                                    }}
                                />
                                {"availability" in errors && Object.keys(errors.availability).length && (
                                    <Typography variant="subtitle2" color="error">
                                        Invalid time slot
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            className={classes.submit}
                            color="primary">
                            Submit
                        </Button>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default Availability;

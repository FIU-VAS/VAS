import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import serverConf from "../config";
import {FormControl, Select, InputLabel, MenuItem, Box, Grid} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { blueGrey, blue } from '@material-ui/core/colors';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/core/styles';
import {startOfToday, addHours, addMinutes, subHours, format, parseISO} from "date-fns";
import {setCurrentUser} from "../actions/userActions";
import {useForm, Controller} from "react-hook-form";
import AvailabilityForm, {validateAvailability} from "../components/Extras/AvailabilityForm";

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

const AvailabilityPage = () => {
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
                ? user.availability.map(available => ({
                    ...available,
                    startTime: format(parseISO(available.startTime), "HH:mm"),
                    endTime: format(parseISO(available.endTime), "HH:mm")
                }))
                : [{ dayOfWeek: "", startTime: "", endTime: "" }]
        }
    });

    console.log(errors);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <Box className={classes.paper} width="100%">
                    <img
                        className={classes.logo}
                        src={require("../images/VAS_shadow.png").default}
                        alt="logo"
                    />
                    {response.message !== "" && <Alert severity={response.success ? "success" : "error"}>{response.message}</Alert>}
                    <form onSubmit={handleSubmit((data) => submitForm(data.availability))}
                          style={{width: "100%"}}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Controller
                                    control={control}
                                    as={<AvailabilityForm/>}
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
                            disabled={response.success}
                        >
                            Submit
                        </Button>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default AvailabilityPage;
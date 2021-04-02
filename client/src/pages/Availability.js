<<<<<<< HEAD
import React from 'react';
import Button from '@material-ui/core/Button'
import { ButtonGroup, makeStyles, Tab, TableHead } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';
import { withStyles } from '@material-ui/core/styles';
import Form from '@material-ui/core/FormControl';

const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },

});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 15,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(time) {
  return { time };
}

const rows = [
  createData('2:00PM-2:15PM'),
  createData('2:15PM-2:30PM'),
  createData('2:30PM-3:00PM'),
  createData('3:15PM-3:30PM'),
  createData('3:30PM-4:00PM'),
  createData('4:00PM-4:15PM'),
  createData('4:15PM-4:30PM'),
  createData('4:30PM-5:00PM'),
];

function CheckboxE(){
  const [checked, setChecked] = React.useState(false)
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  return(
    <div>
      <Checkbox
        checked={checked}
        indeterminate={checked[0] !== checked[1]}
        onChange={handleChange}
        color="secondary"
      />
    </div>
  )
}



function SingleTable() {
  const classes = useStyles();
  return (
    <form onSubmit={event => {event.preventDefault();console.log(event)}}>
     <TableContainer component={Paper}>
       <Table className={classes.table} aria-label="simple table">
         <TableHead>
           <TableRow>
             <TableCell>Time</TableCell>
             <TableCell align="left">Monday</TableCell>
             <TableCell align="left">Tuesday</TableCell>
             <TableCell align="left">Wednesday</TableCell>
             <TableCell align="left">Thursday</TableCell>
             <TableCell align="left">Friday</TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
         {rows.map((row) => (
            <StyledTableRow key={row.time}>
              <StyledTableCell component="th" scope="row">
                {row.time}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <input type='checkbox'></input>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <input type='checkbox'></input>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <input type='checkbox'></input>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <input type='checkbox'></input>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <input type='checkbox'></input>
              </StyledTableCell>
            </StyledTableRow>
          ))}
         </TableBody>
       </Table>
       </TableContainer>
       <Button variant="contained" type="submit">
          Submit
        </Button>

       </form>
  );
}

function Availability() {
  return (
    <div className="App">
      <header className="App-header">
        Pick your schedule :)
        <SingleTable>
        </SingleTable>  
             
      </header>
    </div>
   
  );
}

export default Availability;
=======
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import serverConf from "../config";
import {FormControl, Select, InputLabel, MenuItem, Box, Grid} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { blueGrey, blue, lightGreen } from '@material-ui/core/colors';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/core/styles';
import {startOfToday, addHours, addMinutes, subHours, format, parseISO} from "date-fns";
import {setCurrentUser} from "../actions/userActions";
import {useForm, Controller} from "react-hook-form";
import AvailabilityForm, {validateAvailability} from "../components/Extras/AvailabilityForm";
import SideBar from "../components/AppBar/SideBar";
import Avatar from '@material-ui/core/Avatar';
import DateRangeSharpIcon from '@material-ui/icons/DateRangeSharp';
import { BorderAllRounded } from '@material-ui/icons';

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
        height: '400px',
        width: '400px',
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
                ? user.availability.map(available => ({
                    ...available,
                    startTime: format(parseISO(available.startTime), "HH:mm"),
                    endTime: format(parseISO(available.endTime), "HH:mm")
                }))
                : [{ dayOfWeek: "", startTime: "", endTime: "" }]
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <SideBar/>
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <img
                        className={classes.corner}
                        src={require("../images/Ignite_1.png").default}
                    />
                    
                <Box className={classes.paper} width="100%">
                     <Typography component="h1" variant="h4" >
                        Volunteer Schedule <DateRangeSharpIcon></DateRangeSharpIcon>
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
<<<<<<<< HEAD:client/src/pages/Availability.js
========
                            disabled={response.success}
                            color="primary"
>>>>>>>> component-refactor:client/src/pages/AvailabilityForm.js
                        >
                            Submit
                        </Button>
                    </form>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default Availability;
>>>>>>> component-refactor

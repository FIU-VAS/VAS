import React, {Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import {connect} from "react-redux";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {blue, blueGrey, grey} from '@material-ui/core/colors';
import TeamCalendar from "../Teams/TeamCalendar";
import {Box} from "@material-ui/core";

const useStyles = {
    card: {
        marginTop: 10,
        minWidth: '80%',
        maxWidth: 750,
        height: '100%',
        backgroundColor: 'white'
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
        fontSize: 36,
        fontWeight: 800,
        color: grey[1000],
        alignItems: 'left',
        justify: 'left',
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
}

const AdminDashboard = (props) => {
    const {semesterYear} = props;


    const getTodaysDate = () => {
        let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        let today = new Date();
        return (today.toLocaleDateString("en-US", options))
    }

    return (
        <Fragment>
            <Grid container alignItems="center" justify="center">
                <Box
                    style={{textAlign: "center"}}>
                    <Typography
                        className={props.classes.main}
                        style={{marginBottom: '15px'}}
                        align="center"
                    >
                        Admin Dashboard
                    </Typography>
                    <Grid container direction="column" justify="center" alignItems="center"
                          className={props.classes.custom}>

                        <Typography shadow={3} color="textPrimary" align='center' variant="h6" display="inline"
                                    style={{marginTop: '30px', fontSize: 30, fontWeight: 800, /* color: blue[500] */}}>
                            {semesterYear.semester + " " + semesterYear.year}
                        </Typography>

                        <Typography color="textPrimary" align='center' variant="h6" display="inline"
                                    style={{marginTop: '5px'}}>
                            {getTodaysDate()} &nbsp;
                        </Typography>
                    </Grid>
                    <TeamCalendar/>
                </Box>
            </Grid>
        </Fragment>
    )
}

const mapStateToProps = state => ({
    errors: state.errors
});

export default connect(
    mapStateToProps
)(withRouter(withStyles(useStyles)(AdminDashboard)));

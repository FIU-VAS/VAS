import React, {Component, Fragment} from 'react';
import { Button, Link } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {blueGrey, blue, grey} from '@material-ui/core/colors';
import isEmpty from 'is-empty';
import TeamCalendar from "../Teams/TeamCalendar";

const useStyles = {
    all: {
        backgroundColor: '#fafafa',
        height: '100vh'
    },
    cardHeader: {
        height: 60,
    },
    card: {
        marginTop: 10,
        minWidth: '60%',
        maxWidth: 500,
        height: 400,
        backgroundColor: 'white',
        margin: '0 auto',
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
        color: 'white',
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


class VolunteerDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    displayAdmins() {

        let admins = this.props.admins.filter(admin => admin.isActive)

        if (!isEmpty(admins)) {

            return (
                admins.map(admin => {

                    return (<Fragment>
                            <Typography className={this.props.classes.body} color="textPrimary" variant="body1"
                                        display="inline" gutterBottom>
                                &nbsp; &#8226; &nbsp; {admin.firstName + "  " + admin.lastName} <br/>
                            </Typography>
                            <Typography className={this.props.classes.body} color="textPrimary" variant="body1"
                                        display="inline" gutterBottom>
                                &nbsp; &nbsp; &nbsp; &#9702; &nbsp;{admin.phoneNumber} <br/>
                                &nbsp; &nbsp; &nbsp; &#9702; &nbsp;{admin.email} <br/>
                            </Typography>
                        </Fragment>
                    )

                })
            )
        } else {
            return (<Typography className={this.props.classes.body} color="textPrimary" variant="body1" display="inline"
                                gutterBottom>
                    &nbsp; &#8226; &nbsp; You are the only active volunteer on this team.<br/>
                </Typography>
            )
        }

    }

    setColor(text) {
        if (text === true) {
            return "#43a047";
        } else if (text === false) {
            return "#e53935";
        } else {
            return "textPrimary";
        }
    }

    render() {
        return (
            <Fragment>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >

                    <Typography
                        className={this.props.classes.main}
                        display="inline"
                        style={{marginBottom: '5px'}}>
                        Welcome {this.props.user.firstName} !
                    </Typography>
                    {isEmpty(this.props.user.availability) && <Alert severity="info">Your availability has not been set! <Link component={Button} href="/availability" color="primary">Set Availability</Link></Alert>}
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                        className={this.props.classes.custom}
                    >
                        <Typography className={this.props.classes.subHeading} color="textPrimary" align='center'
                                    variant="h6" display="inline" style={{marginBottom: '10px'}}>
                            Below is your team information with all of the appropriate details. &nbsp;
                        </Typography>
                    </Grid>
                </Grid>

                <TeamCalendar hideEmpty={true}/>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    user: state.userData.user,
    admins: state.adminData.admins,
    errors: state.errors,
    success: state.success
});


export default connect(
    mapStateToProps
)(withRouter(withStyles(useStyles)(VolunteerDashboard)));

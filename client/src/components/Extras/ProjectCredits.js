import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import { grey } from '@material-ui/core/colors';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';


const useStyles = {
    cardHeader: {
        height: 60,
        backgroundColor: grey[900]
    },
    cardHeaderNames: {
        height: 60,
        backgroundColor: grey[900]
    },
    card: {
        marginTop: 10,
        minWidth: "80%",
        maxwidth: 100,
        height: 600,
        backgroundColor: '#00000',
        marginBottom: '20px',
        'overflow-x': 'hidden'
    },
    cardTitle: {
        fontSize: "20px",
        fontWeight: 800,
        color: 'white'
    },
    title: {
        fontSize: 20,
        fontWeight: 800,
        color: grey[900],
    },
    regular: {
        fontSize: 18,
        fontWeight: 400,
        color: grey[900],
    },
    names: {
        fontSize: 20,
        fontWeight: 600,
        marginTop: '14px',
        color: 'white'
        //color: grey[800],
    },
    center: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
    },
    main: {
        fontSize: 30,
        fontWeight: 800,
        color: grey[900],
        alignItems: 'left',
        justify: 'left',
    },
    cardContainer: {
        heigth: '100px'
    }
}

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}


class AboutView extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div style={{ marginTop: '10px' }}>
                <Fragment>



                    <div className={this.props.classes.cardContainer}>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="center"
                            paddingTop="50px"
                        >
                            <div>

                                <Typography
                                    className={this.props.classes.main}
                                    display="inline"
                                    style={{ marginBottom: '5px' }}>
                                    Project Credits
                    </Typography>
                            </div>
                        </Grid>


                        <Grid
                            item
                            direction="row"
                            justify="center"
                            alignItems="center"
                            paddingTop="50px"
                            xs={12}
                        >

                            <Typography
                                className={this.props.classes.cardTitle}
                                style={{ marginTop: '14px', textAlign: 'center', backgroundColor: grey[900] }}>
                                Version 1
                                </Typography>
                        </Grid>

                        <Grid style={{ paddingLeft: '15px', paddingTop: '10px', paddingRight: '15px', paddingBottom: '15px', }}>

                            <Typography
                                className={this.props.classes.regular}
                                style={{ marginBottom: '15px', marginTop: '15px', alignItems: 'left' }}>
                                This system was created as a senior project by Aurelien and Daniel at Florida International University (FIU), during the Spring 2020 semester.
                                It was designed to automate the tracking of FIU students that volunteer each week to teach elementary and middle school students how to code.
                                <br /><br />
                                In this first phase, the system gives the administrators of the outreach program the ability to track FIU student volunteers, the teams that they form,
                                the schools that they visit, and the school personnel associated with each school.  This system also allows FIU student volunteers and school personnel
                                the ability to see each other's contact information and schedule of school visits, thereby facilitating the communication between all parties.
                                <br /><br />
                                Many thanks go to Aurelien and Daniel for developing, testing, and deploying the <strong>CS First</strong> Outreach Volunteer System.

                            </Typography>
                            <Typography
                                className={this.props.classes.title}
                                style={{ marginBottom: '15px', marginTop: '15px', alignItems: 'left' }}>
                                Developers:
                            </Typography>

                            <Grid
                                container
                                direction="row"
                                justify="space-evenly"
                                alignItems="center"
                                spacing={3}
                            >

                                <Grid container item xs={12} sm={6}
                                    direction="column"
                                    justify="center"
                                    alignItems="center" >


                                    <Box
                                        boxShadow={1}
                                        borderRadius="10px"
                                        style={{ backgroundColor: 'white', width: "100%" }}>

                                        {/* CARD HEADING */}
                                        <Box
                                            borderRadius="10px 10px 0px 0px"
                                            boxShadow={2}
                                            className={this.props.classes.cardHeaderNames}
                                            variant="outlined"
                                            justify="center">

                                            <div className={this.props.classes.center}>
                                                <Typography className={this.props.classes.names}>
                                                    Aurelien Meray
                                        </Typography>
                                            </div>

                                        </Box>
                                        <List className={this.props.classes.root}>
                                            <ListItemLink href="https://github.com/AurelienMeray">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <GitHubIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Github" secondary="/AurelienMeray" />
                                                {/* </a> */}
                                            </ListItemLink>
                                            <Divider />
                                            <ListItemLink href="https://www.linkedin.com/in/aurelienmeray/">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <LinkedInIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="LinkedIn" secondary="/aurelienmeray" />
                                            </ListItemLink>
                                        </List>
                                    </Box>


                                </Grid>

                                <Grid container item xs={12} sm={6}
                                    direction="column"
                                    justify="center"
                                    alignItems="center" >


                                    <Box
                                        boxShadow={1}
                                        borderRadius="10px"
                                        style={{ backgroundColor: 'white', width: "100%" }}>

                                        {/* CARD HEADING */}
                                        <Box
                                            borderRadius="10px 10px 0px 0px"
                                            boxShadow={2}
                                            className={this.props.classes.cardHeaderNames}
                                            variant="outlined"
                                            justify="center">

                                            <div className={this.props.classes.center}>
                                                <Typography className={this.props.classes.names}>
                                                    Daniel Valencia
                                        </Typography>
                                            </div>

                                        </Box>
                                        <List className={this.props.classes.root}>
                                            <ListItemLink href="https://github.com/dvale94">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <GitHubIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Github" secondary="/dvale94" />
                                                {/* </a> */}
                                            </ListItemLink>
                                            <Divider />
                                            <ListItemLink href="https://www.linkedin.com/in/daniel-valencia1994/">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <LinkedInIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="LinkedIn" secondary="/daniel-valencia1994" />
                                            </ListItemLink>
                                        </List>
                                    </Box>


                                </Grid>

                            </Grid>
                        </Grid>
                        <Grid
                            item
                            direction="row"
                            justify="center"
                            alignItems="center"
                            paddingTop="50px"
                            xs={12}
                        >

                            <Typography
                                className={this.props.classes.cardTitle}
                                style={{ marginTop: '14px', textAlign: 'center', backgroundColor: grey[900] }}>
                                Version 2
                                </Typography>
                        </Grid>

                        <Grid style={{ paddingLeft: '15px', paddingTop: '10px', paddingRight: '15px', paddingBottom: '15px', }}>

                            <Typography
                                className={this.props.classes.regular}
                                style={{ marginBottom: '15px', marginTop: '15px', alignItems: 'left' }}>
                                In this second phase, the system was improved to allow admins to create Teams based on the volunteers and professors availability being stored by the system now. Additionally, it allows users to easily sign up to volunteer or to register a school in the Home page, as well as reset their password. Some additionally functionality has also been added for admins.
                                <br /><br />
                                Many thanks go to the developers for refractoring the code, developing new features, testing, and deploying the <strong>CS First</strong> Outreach Volunteer System.

                            </Typography>
                            <Typography
                                className={this.props.classes.title}
                                style={{ marginBottom: '15px', marginTop: '15px', alignItems: 'left' }}>
                                Developers:
                            </Typography>

                            <Grid
                                container
                                direction="row"
                                justify="space-evenly"
                                alignItems="center"
                                spacing={3}
                            >


                                <Grid container item xs={12} sm={6}
                                    direction="column"
                                    justify="center"
                                    alignItems="center" >


                                    <Box
                                        boxShadow={1}
                                        borderRadius="10px"
                                        style={{ backgroundColor: 'white', width: "100%" }}>

                                        {/* CARD HEADING */}
                                        <Box
                                            borderRadius="10px 10px 0px 0px"
                                            boxShadow={2}
                                            className={this.props.classes.cardHeaderNames}
                                            variant="outlined"
                                            justify="center">

                                            <div className={this.props.classes.center}>
                                                <Typography className={this.props.classes.names}>
                                                    Alain Cartaya
                                        </Typography>
                                            </div>

                                        </Box>
                                        <List className={this.props.classes.root}>
                                            <ListItemLink href="https://github.com/alcart">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <GitHubIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Github" secondary="/alcart" />
                                                {/* </a> */}
                                            </ListItemLink>
                                            <Divider />
                                            <ListItemLink href="https://www.linkedin.com/in/cartaya-alain/">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <LinkedInIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="LinkedIn" secondary="/cartaya-alain" />
                                            </ListItemLink>
                                        </List>
                                    </Box>


                                </Grid>
                                <Grid container item xs={12} sm={6}
                                    direction="column"
                                    justify="center"
                                    alignItems="center" >


                                    <Box
                                        boxShadow={1}
                                        borderRadius="10px"
                                        style={{ backgroundColor: 'white', width: "100%" }}>

                                        {/* CARD HEADING */}
                                        <Box
                                            borderRadius="10px 10px 0px 0px"
                                            boxShadow={2}
                                            className={this.props.classes.cardHeaderNames}
                                            variant="outlined"
                                            justify="center">

                                            <div className={this.props.classes.center}>
                                                <Typography className={this.props.classes.names}>
                                                    Michael McCarthy
                                        </Typography>
                                            </div>

                                        </Box>
                                        <List className={this.props.classes.root}>
                                            <ListItemLink href="https://github.com/mmccarthy731">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <GitHubIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Github" secondary="/mmccarthy731" />
                                                {/* </a> */}
                                            </ListItemLink>
                                            <Divider />
                                            <ListItemLink href="https://www.linkedin.com/in/michaelmccarthy731/">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <LinkedInIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="LinkedIn" secondary="/michaelmccarthy731" />
                                            </ListItemLink>
                                        </List>
                                    </Box>


                                </Grid>
                                <Grid container item xs={12} sm={6}
                                    direction="column"
                                    justify="center"
                                    alignItems="center" >


                                    <Box
                                        boxShadow={1}
                                        borderRadius="10px"
                                        style={{ backgroundColor: 'white', width: "100%" }}>

                                        {/* CARD HEADING */}
                                        <Box
                                            borderRadius="10px 10px 0px 0px"
                                            boxShadow={2}
                                            className={this.props.classes.cardHeaderNames}
                                            variant="outlined"
                                            justify="center">

                                            <div className={this.props.classes.center}>
                                                <Typography className={this.props.classes.names}>
                                                    Kevin Garcia
                                        </Typography>
                                            </div>

                                        </Box>
                                        <List className={this.props.classes.root}>
                                            <ListItemLink href="https://github.com/keving2301">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <GitHubIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Github" secondary="/keving2301" />
                                                {/* </a> */}
                                            </ListItemLink>
                                            <Divider />
                                            <ListItemLink href="https://www.linkedin.com/in/kevin-garcia-54a497125/">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <LinkedInIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="LinkedIn" secondary="/kevin-garcia-54a497125" />
                                            </ListItemLink>
                                        </List>
                                    </Box>


                                </Grid>
                                <Grid container item xs={12} sm={6}
                                    direction="column"
                                    justify="center"
                                    alignItems="center" >


                                    <Box
                                        boxShadow={1}
                                        borderRadius="10px"
                                        style={{ backgroundColor: 'white', width: "100%" }}>

                                        {/* CARD HEADING */}
                                        <Box
                                            borderRadius="10px 10px 0px 0px"
                                            boxShadow={2}
                                            className={this.props.classes.cardHeaderNames}
                                            variant="outlined"
                                            justify="center">

                                            <div className={this.props.classes.center}>
                                                <Typography className={this.props.classes.names}>
                                                    Danay Fernandez
                                        </Typography>
                                            </div>

                                        </Box>
                                        <List className={this.props.classes.root}>
                                            <ListItemLink href="https://github.com/danay1999">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <GitHubIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Github" secondary="/danay1999" />
                                                {/* </a> */}
                                            </ListItemLink>
                                            <Divider />
                                            <ListItemLink href="https://www.linkedin.com/in/dfern99/">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <LinkedInIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="LinkedIn" secondary="/dfern99" />
                                            </ListItemLink>
                                        </List>
                                    </Box>


                                </Grid>
                                <Grid container item xs={12} sm={6}
                                    direction="column"
                                    justify="center"
                                    alignItems="center" >


                                    <Box
                                        boxShadow={1}
                                        borderRadius="10px"
                                        style={{ backgroundColor: 'white', width: "100%" }}>

                                        {/* CARD HEADING */}
                                        <Box
                                            borderRadius="10px 10px 0px 0px"
                                            boxShadow={2}
                                            className={this.props.classes.cardHeaderNames}
                                            variant="outlined"
                                            justify="center">

                                            <div className={this.props.classes.center}>
                                                <Typography className={this.props.classes.names}>
                                                    Alejandra Vasquez
                                        </Typography>
                                            </div>

                                        </Box>
                                        <List className={this.props.classes.root}>
                                            <ListItemLink href="https://github.com/avasq011">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <GitHubIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Github" secondary="/avasq011" />
                                                {/* </a> */}
                                            </ListItemLink>
                                            <Divider />
                                            <ListItemLink href="https://www.linkedin.com/in/alejandra-vasquez-39b2a935/">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <LinkedInIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="LinkedIn" secondary="/alejandra-vasquez-39b2a935" />
                                            </ListItemLink>
                                        </List>
                                    </Box>


                                </Grid>
                                <Grid container item xs={12} sm={6}
                                    direction="column"
                                    justify="center"
                                    alignItems="center" >


                                    <Box
                                        boxShadow={1}
                                        borderRadius="10px"
                                        style={{ backgroundColor: 'white', width: "100%" }}>

                                        {/* CARD HEADING */}
                                        <Box
                                            borderRadius="10px 10px 0px 0px"
                                            boxShadow={2}
                                            className={this.props.classes.cardHeaderNames}
                                            variant="outlined"
                                            justify="center">

                                            <div className={this.props.classes.center}>
                                                <Typography className={this.props.classes.names}>
                                                    Niurbelis Gonzalez
                                        </Typography>
                                            </div>

                                        </Box>
                                        <List className={this.props.classes.root}>
                                            <ListItemLink href="https://github.com/niurbii">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <GitHubIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Github" secondary="/niurbii" />
                                                {/* </a> */}
                                            </ListItemLink>
                                            <Divider />
                                            <ListItemLink href="https://www.linkedin.com/in/niurbelis-gonzalez/">
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <LinkedInIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="LinkedIn" secondary="/niurbelis-gonzalez" />
                                            </ListItemLink>
                                        </List>
                                    </Box>


                                </Grid>

                            </Grid>

                        </Grid>

                    </div>

                </Fragment>
            </div>
        )
    }
}


export default (withRouter(withStyles(useStyles)(AboutView)));
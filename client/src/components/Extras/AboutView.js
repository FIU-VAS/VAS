import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import { blueGrey, blue, grey, yellow } from '@material-ui/core/colors';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';


const useStyles = {
    all: {
        backgroundColor: '#000000',
        height: '100vh'
    },
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
        fontWeight: 800,
        color: 'white'
    },
    title: {
        fontSize: 20,
        fontWeight: 800,
        color: grey[900],
    },
    regular: {
        fontSize: 18,
        fontWeight: 400,
        color: grey[900],
    },
    names: {
        fontSize: 20,
        fontWeight: 600,
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
        fontWeight: 800,
        color: grey[900],
        alignItems: 'left',
        justify: 'left',
    },
    cardContainer:{
        heigth:'100px'
    },
    textContainer:{
        paddingTop: '2%',
        display: 'flex',
        width: '100%',
    },
    text:{
        position: 'flex',
    },
    blob: {
        paddingTop: '0px',
        height : "350px",
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

    render(){
        return (
            <div style={{marginTop: '10px'}}>
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
                            About
                    </Typography>

            </Grid>
            <Grid  >
                <div className={this.props.classes.textContainer}>
                    <div className={this.props.classes.text}>
                            <Typography
                            className={this.props.classes.regular}>
                                The <strong>Ignite</strong> program at Florida International University’s Knight Foundation School of Computing 
                                and Information Sciences (KFSCIS) is an outreach program with the mission of promoting computer science 
                                education to K-12 students in Miami Dade County. Through the program, volunteers visit schools every week 
                                to teach students the fundamentals of computer science, using resources such as Code.org' K-5 curriculum, 
                                Google's CS First curriculum, and MIT's Scratch curriculum. Since its inception, the Ignite program has 
                                counted with the support of hundreds of volunteers, served over 20 schools, and impacted over 2000 grade 
                                school students. Additionally, to celebrate Computer Science Education week, Ignite collaborates with 
                                KFSCIS every December to host its signature event: CodeFest Miami - a mini-hackathon for students in 
                                the outreach. For more details, please go to  
                                <a href="https://www.cis.fiu.edu/codefest-miami-2017-fiu/" target="_blank" style={{'color':'#57C965',textDecoration: 'none'}}> CodeFest Miami - 2017</a>.
                                <br/><br/>
                                The program is organized by Upsilon Pi Epsilon (UPE), FIU’s largest student organization for technology, 
                                and under the guidance of KFSCIS Instructor Cristy Charters. The organization plans the program’s activities, 
                                and recruits, trains, and manages the volunteers every semester. The Ignite program is also currently sponsored 
                                by State Farm and has been supported by Google in previous years. To learn more, please visit the Ignite 
                                program website at 
                                <a href="https://upe.cs.fiu.edu/google-cs-first/" target="_blank" style={{'color':'#57C965',textDecoration: 'none'}}> UPE Ignite </a> to apply. 
                        
                            </Typography>

                    </div>
                            <img className={this.props.classes.blob}
                                src ={require("../../images/Ignite_4.png").default}
                                alt = "Blob" 
                            />
                </div>
                            
            </Grid>
            
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
                        style={{marginBottom: '5px'}}>
                            Project Credits 
                    </Typography>
                </div>
            </Grid>

                <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center">
                    
                    {/* CARD */}
                    <Box 
                    borderRadius="10px"
                    boxShadow={3}
                    className={this.props.classes.card}
                    style={{width: "380px"}}
                    variant="outlined"
                    justify="center">

                        {/* CARD HEADING */}
                        <Box 
                        borderRadius="10px 10px 0px 0px"
                        boxShadow={2}
                        className={this.props.classes.cardHeader}
                        variant="outlined"
                        justify="center"
>

                            

                                <Typography
                                className={this.props.classes.cardTitle}
                                style={{marginTop: '14px'}}>
                                    Version 1 
                                </Typography>
                            

                      <Grid style={{paddingLeft: '15px', paddingTop: '10px', paddingRight: '15px', paddingBottom: '15px',}}>
                            
                            <Typography
                            className={this.props.classes.regular}
                            style={{marginBottom: '15px', marginTop: '15px', alignItems: 'left'}}>
                                This system was created as a senior project by Aurelien and Daniel at Florida International University (FIU), during the Spring 2020 semester. 
                                It was designed to automate the tracking of FIU students that volunteer each week to teach elementary and middle school students how to code.  
                                <br/><br/>
                                In this first phase, the system gives the administrators of the outreach program the ability to track FIU student volunteers, the teams that they form, 
                                the schools that they visit, and the school personnel associated with each school.  This system also allows FIU student volunteers and school personnel 
                                the ability to see each other's contact information and schedule of school visits, thereby facilitating the communication between all parties.
                                <br/><br/>
                                Many thanks go to Aurelien and Daniel for developing, testing, and deploying the <strong>CS First</strong> Outreach Volunteer System.

                            </Typography>
                            <Typography
                            className={this.props.classes.title}
                            style={{marginBottom: '15px', marginTop: '15px', alignItems: 'left'}}>
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
                                    style={{backgroundColor:'white', width: "100%"}}>

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
                                    style={{backgroundColor:'white', width: "100%"}}>

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
                        </Box>
                    </Box>
                   </Grid>

            
                   </div>
            
            </Fragment>
            </div>
        )
    }
}


  export default (withRouter(withStyles(useStyles)(AboutView)));
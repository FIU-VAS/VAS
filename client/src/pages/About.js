import React, { Component, Fragment } from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ProjectCredits from '../components/Extras/ProjectCredits';
import NavBar from '../components/AppBar/NavBar';
import Typography from '@material-ui/core/Typography';
import { grey } from '@material-ui/core/colors';

const useStyles = {
    all: {
        height: '100vh',
        marginTop: '10px'
    },
    view: {
        marginTop: 20,
        width: '90%',
        //height: 900
    },
    textContainer:{
        paddingTop: '2%',
        display: 'flex',
        width: '100%',
    },
    text:{
        position: 'flex',
        paddingLeft: '3%',
    },
    blob: {
        paddingTop: '0px',
        height : "350px",
        paddingRight: '2%',
    },
    regular: {
        fontSize: 18,
        fontWeight: 400,
        color: grey[900],
    },
    main: {
        fontSize: 30,
        fontWeight: 800,
        color: grey[900],
        paddingTop: '2%'
    },
}    

    

class About extends Component{


    render(){
        return (
        <div >
            <NavBar/>
            <Fragment className={this.props.classes.all}>
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
                                <a href="https://www.cis.fiu.edu/codefest-miami-2017-fiu/" target="_blank" rel="noreferrer" style={{'color':'#57C965',textDecoration: 'none'}}> CodeFest Miami - 2017</a>.
                                <br/><br/>
                                The program is organized by Upsilon Pi Epsilon (UPE), FIU’s largest student organization for technology, 
                                and under the guidance of KFSCIS Instructor Cristy Charters. The organization plans the program’s activities, 
                                and recruits, trains, and manages the volunteers every semester. The Ignite program is also currently sponsored 
                                by State Farm and has been supported by Google in previous years. To learn more, please visit the Ignite 
                                program website at 
                                <a href="https://upe.cs.fiu.edu/google-cs-first/" target="_blank" rel="noreferrer" style={{'color':'#57C965',textDecoration: 'none'}}> UPE Ignite </a> to apply.
                        
                            </Typography>

                    </div>
                            <img className={this.props.classes.blob}
                                src ={require("../images/Ignite_4.png").default}
                                alt = "Blob" 
                            />
                </div>
                             
            </Grid>
                <Grid container direction="column" alignItems="center" justify="center">
                    <Grid item className={this.props.classes.view}>
                        <ProjectCredits/>
                    </Grid>    
                </Grid>
                </Fragment>
            </div> 
               
        )
    }
}

export default (withStyles(useStyles)(About));

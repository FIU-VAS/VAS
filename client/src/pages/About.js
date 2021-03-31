import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AboutView from '../components/Extras/AboutView';
import NavBar from '../components/AppBar/NavBar'

const useStyles = {
    all: {

        height: '100vh'
    },
    view: {
        marginTop: 20,
        width: '90%',
        //height: 900
    }
}

class About extends Component{

    render(){
        return (
        <div className={this.props.classes.all}>
                <NavBar/>
                <Grid container direction="column" alignItems="center" justify="center">
                    <Grid item className={this.props.classes.view}>
                        <AboutView/>
                    </Grid>
                </Grid>
            </div> 
               
        )
    }
}

export default (withStyles(useStyles)(About));

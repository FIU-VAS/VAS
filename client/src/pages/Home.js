import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import NavBar from '../components/AppBar/NavBar';
import CalltoAction from '../components/Home/CalltoAction';
import Grid from "@material-ui/core/Grid";

const theme = createMuiTheme({
    palette: {
      primary: grey,
    }
    
  });

const useStyles = {
    horizontal: {
        marginTop: theme.spacing(8),
     }
};

class Login extends Component{
    
    render(){
        return (
            <div>
                <NavBar/>
                <Grid container  direction="row" align="center" className={this.props.classes.horizontal} >
                <CalltoAction/>
                <Grid item md={6} xs={12}>
                <img 
                src ={require("../images/kids_home_page.png").default}
                alt = "Kids Learning" 
                />
                </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(useStyles)(Login);

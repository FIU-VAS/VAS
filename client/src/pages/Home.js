import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import NavBar from '../components/AppBar/NavBar';
import CalltoAction from '../components/Home/CalltoAction';

const theme = createMuiTheme({
    palette: {
      primary: grey,
    }
    
  });

const useStyles = {
    picture: {
        marginTop: theme.spacing(16),
        position: 'absolute',
        right: '3%',
        left: '55%',
    }
};

class Login extends Component{
    
    render(){
        return (
            <div>
                <NavBar/>
                <CalltoAction/>
                <img className={this.props.classes.picture}
                src ={require("../images/kids_home_page.png").default}
                alt = "Kids Learning" 
                />
            </div>
        )
    }
}

export default withStyles(useStyles)(Login);

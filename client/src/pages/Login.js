import React, { Component } from 'react';
import LoginForm from '../components/Login/LoginForm';
import { withStyles } from '@material-ui/core/styles';
import { blueGrey, grey } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import NavBar from '../components/AppBar/NavBar';

const theme = createMuiTheme({
    palette: {
      primary: grey,
    }
    
  });

const useStyles = {
    picture: {
        marginTop: theme.spacing(15),
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
                <LoginForm/>
            </div>
        )
    }
}

export default withStyles(useStyles)(Login);
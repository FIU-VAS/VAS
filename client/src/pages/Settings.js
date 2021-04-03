import React, { Component } from 'react';
import LoginForm from '../components/Login/LoginForm';
import { withStyles } from '@material-ui/core/styles';
import { blueGrey, grey } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import SideBar from '../components/AppBar/SideBar';
import CalltoAction from '../components/Home/CalltoAction';
import SettingsForm from '../components/Settings/SettingsForm' ;

const theme = createMuiTheme({
    palette: {
      primary: grey,
    }
    
  });

const useStyles = {
   
};

class Settings extends Component{
    
    render(){
        return (
            <div>
                <SideBar/>
                <SettingsForm/>
            
            </div>
        )
    }
}

export default withStyles(useStyles)(Settings);
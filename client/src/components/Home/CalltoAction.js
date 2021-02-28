import React, { Component } from 'react';
// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import LockRoundedIcon from '@material-ui/icons/LockRounded';
// import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { blueGrey, grey } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import Alert from '@material-ui/lab/Alert';
import { Link } from "react-router-dom";


// Login Styling
const theme = createMuiTheme({
    palette: {
      primary: grey,
    },
    secondary: {
      main: '#57C965',
    },
    
  });

const useStyles = {
    calltoaction: {
    position: 'absolute',
    left: '3%',
    right: '55%',
    marginTop: theme.spacing(20),

    
  },
  button: {
    margin: theme.spacing(2, 0, 0, 0),
    backgroundColor: theme.secondary.main,
    color: "white",
    width: '161px',
    '&:hover': {
        backgroundColor: theme.secondary.main,
    }
  
  },
  button1: {
    margin: theme.spacing(2, 0, 0, 0.5),
    backgroundColor: theme.secondary.main,
    color: "white",
    width: '161px',
    '&:hover': {
        backgroundColor: theme.secondary,
    }
  
  },

};
// Login Styling END

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
        errors: {}
        };
    }  


  render(){   
    return (
      <ThemeProvider theme={theme}>
      <Container className={this.props.classes.calltoaction} component="main" maxWidth="xs" >
        
            <h1>Ignite the passion for CS. <br></br>
                Uplift your community.</h1>
            <h3>Currently reaching 50+ volunteers, <br></br> 
            12+ schools, 300+ students </h3>
            <Button
              type="submit"
              variant="contained"
              className={this.props.classes.button}>
              Register school
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={this.props.classes.button1}>
              Volunteer
            </Button>
            
      </Container>
            
      </ThemeProvider>

      
      
    );
  }
}

// define types
LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

// allows us to get our state from Redux and map it to props
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect (
  mapStateToProps,
  { loginUser }  
)(withRouter(withStyles(useStyles)(LoginForm)));
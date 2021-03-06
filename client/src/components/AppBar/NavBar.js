import React, { Component, Fragment } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { resetState } from '../../actions/logoutAction';
import Grid from '@material-ui/core/Grid';


const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#000000"
        },
        secondary: {
          main: "#FFFFFF"
        }
    }
});

const useStyles = {
  root: {
    flexGrow: 0,
    width: '100vw',
    backgroundColor: 'black'
    
  },
  toolbar: {
    display: 'flex',
    backgroundColor: 'black',
    textAlign:'left',
  },
  title: {
    flexGrow: 1,
    color: 'white',
  },
  logout: {
    color: 'white !important'
  },
  rigth: {
    right: '15px',
    position: 'absolute',
    color: 'white'
  },
  nodecor: {
    textDecoration: 'none',
  },
  icon: {
    color: 'white'
  },
  logo: {
    height: "50px",
    marginTop: "13px",
    marginBottom: "10px"
  },
  bracket: {
    height: "25px",
    marginTop: "0px"
  }
};



class NavBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
    loggedIn: false,
    anchorEl : null,
    open: false
    };
    this.setAnchorEl = this.setAnchorEl.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)

}

 handleClose = () => {
  this.setAnchorEl(null);
};

redirect_to_Profile = () => {
  this.props.history.push("/profile");
}

redirect_to_AboutPage = () => {
  this.props.history.push("/about");
}

  submitLogout = async (e) =>{
    e.preventDefault()

    // Hides logout button after being clicked
    this.setState({
      loggedIn: false,
      open: false
    });

    this.props.logoutUser();
    this.props.resetState();
    this.props.history.push("/login");
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      return this.setState({
        loggedIn: true
      })
    }

  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      return this.setState({
        loggedIn: true
      })
    }
  }



  handleClick(event) {
    this.setAnchorEl(event.currentTarget);
}
    setAnchorEl(value){
        this.setState({
            anchorEl: value,
            open: !this.state.open
        })
    }
  handleClose() {
    this.setAnchorEl(null);
}

getTitle(){
  let size = document.body.clientWidth
  if (size < 750) {
    return ("FIU VAS")
  } else {
    return ("FIU Outreach Volunteer Attendance System")
  }
}


render(){
  return (
    <ThemeProvider theme={theme}>
    <div className={this.props.classes.root}  >
      <AppBar position='static'>
        <Toolbar className={this.props.classes.toolbar}>
       
        <Link to='/' className={this.props.classes.nodecor}>
          
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Fragment>
          { (document.body.clientWidth > 750) &&
            <img
            className={this.props.classes.logo}
            src ={require("../../images/VAS_LOGO.png").default}
            alt = "logo"
            />}

            <Typography className={this.props.classes.title} variant='h5' >
             &nbsp;
             {this.getTitle()}
            </Typography>
            </Fragment>
        </Grid>

        </Link>
        
        <div className={this.props.classes.rigth}>
        <Link to='/about' className={this.props.classes.link} style={{color:'white', textDecoration: 'none', paddingRight: '15px'}}>About</Link>
        {this.state.loggedIn && <Link to='/dashboard' className={this.props.classes.link} style={{color:'white', textDecoration: 'none', paddingRight: '15px'}}>Dashboard</Link>}  
        {!this.state.loggedIn && <Link to='/login' className={this.props.classes.link} style={{color:'white', textDecoration: 'none', paddingRight: '15px'}}>Log In </Link>}
        {this.state.loggedIn && <Link to='/' className={this.props.classes.link} style={{color:'white', textDecoration: 'none', paddingRight: '15px'}} onClick={this.handleClose && this.submitLogout}>Log Out </Link>}  
        </div>
            
        </Toolbar>
            
      </AppBar>
    </div>
    </ThemeProvider>
  );
}
}

// define types
NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  resetState: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

// allows us to get our state from Redux and map it to props
const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect (
  mapStateToProps,
  { logoutUser, resetState }
)(withRouter(withStyles(useStyles)(NavBar)));

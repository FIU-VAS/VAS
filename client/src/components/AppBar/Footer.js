  
import React, { Component, Fragment } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { withRouter } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import InfoIcon from '@material-ui/icons/Info';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import { blueGrey, grey } from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: grey[900],
        },
        secondary: {
          main: grey[900],
        }
    }
});

const useStyles = {
  root1: {
    flexGrow: 0,
    width: '100vw',
    backgroundColor: grey[50],
    
  },
  appBar1: {
    top: 'auto',
    bottom: 0,
    opacity: "80%",
    backgroundColor: grey[50],
  },
  FIU1: {
    height: "30px"
  }
};

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="up" in={!trigger}>
      {children}
    </Slide>
  );
}


class Footer extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  redirect_to_AboutPage = () => {
    this.props.history.push("/about");
  }

render(){
  const props = this.props;
  return (
    <ThemeProvider theme={theme}>
    <div className={this.props.classes.root1} >
    <HideOnScroll {...props}>
    <AppBar position="fixed" color="secondary" className={this.props.classes.appBar1}>
        <Toolbar>

        <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center">
        <img
            className={this.props.classes.FIU1}
            src ={require("../../images/FIU_hrz_Color.png").default}
            alt = "logo"
            />

            </Grid>

           
            <Button onClick={this.redirect_to_AboutPage} startIcon={<InfoIcon />} href="#outlined-buttons">
        About
      </Button>

        </Toolbar>
      </AppBar>
      </HideOnScroll>
    </div>
    </ThemeProvider>
  );
}
}

export default connect ()(withRouter(withStyles(useStyles)(Footer)));

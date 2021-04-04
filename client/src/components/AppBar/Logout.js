import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import { resetState } from '../../actions/logoutAction';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";


class Logout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      anchorEl: null,
      open: false,
      class: props.class
    };
    this.setAnchorEl = this.setAnchorEl.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)

  }

  handleClose = () => {
    this.setAnchorEl(null);
  };

  submitLogout = async (e) => {
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

  handleClick(event) {
    this.setAnchorEl(event.currentTarget);
  }
  setAnchorEl(value) {
    this.setState({
      anchorEl: value,
      open: !this.state.open
    })
  }

  render(props) {
    return(
    <Link
      to="/" onClick={this.handleClose && this.submitLogout} className={this.state.class}>
      <ListItem>
        <ListItemText style={{'color':'white', 'textDecoration': 'none'}}>Log Out</ListItemText>
      </ListItem>
    </Link>
    )
  }
}


// define types
Logout.propTypes = {
  class: PropTypes.string.isRequired,
  logoutUser: PropTypes.func.isRequired,
  resetState: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

// allows us to get our state from Redux and map it to props
const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { logoutUser, resetState }
)(withRouter((Logout)));


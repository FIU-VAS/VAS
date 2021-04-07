import {logoutUser} from "../actions/authActions";
import React, { Component } from 'react';
import {Redirect, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {resetState} from "../actions/logoutAction";

class Logout extends Component{

    componentDidMount() {
        this.props.logoutUser();
    }

    render(){
        return <Redirect to="/login" push={true} />
    }
}

export default connect (
    null,
    { logoutUser, resetState }
)(withRouter(Logout));
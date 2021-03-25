import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, auth, user, ...rest }) => (
    <Route
        {...rest}
        render={props =>
        auth.isAuthenticated === true ? (
            Object.keys(user).length && <Component {...props} />
        ) : (
            <Redirect to="/" />
        )
        }
    />
);

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.userData.user
});

export default connect(mapStateToProps)(PrivateRoute);
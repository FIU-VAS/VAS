import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import SideBar from "../components/AppBar/SideBar";
import {Box, Grid} from '@material-ui/core';
import config from "../config";
import {UserProfile} from "../components/Profile/UserProfile";

const commonProps = [
    {
        type: "text",
        name: "firstName",
        label: "First Name",
        rules: {
            required: true
        }
    },
    {
        type: "text",
        name: "lastName",
        label: "Last Name",
        rules: {
            required: true
        }
    },
    {
        type: "text",
        name: "email",
        label: "Email",
        inputProps: {
            readOnly: true
        },
        rules: {
            required: true
        }
    },
    {
        type: "tel",
        name: "phoneNumber",
        label: "Phone Number",
        rules: {
            required: true
        }
    },
]

const userProps = {
    admin: commonProps,
    schoolPersonnel: [
        ...commonProps,
        {
            type: "text",
            name: "title",
            label: "Title",
            rules: {
                required: true
            }
        }
    ],
    volunteer: [
        ...commonProps,
        {
            type: "text",
            name: "pantherID",
            label: "Panther ID",
            rules: {
                required: true
            }
        },
        {
            type: "text",
            name: "major",
            label: "Major",
        },
        {
            type: "select",
            name: "carAvailable",
            label: "Car Available",
            options: [
                {value: true, label: 'Yes'},
                {value: false, label: 'No'},
            ],
            rules: {
                required: true
            }
        },
        {
            type: "select",
            name: "volunteerStatus",
            label: "Volunteer Status",
            options: [
                {value: true, label: 'Approved'},
                {value: false, label: 'Not yet approved'},
            ],
            rules: {
                required: true
            }
        },
        {
            type: "text",
            name: "MDCPS_ID",
            label: "MDCPS ID"
        }
    ]
}

class Profile extends Component {

    getProfile() {
        const {auth} = this.props;
        switch (auth.role) {
            case config.userRoles.admin:
                return (
                    <UserProfile
                        user={this.props.user}
                        endpoint={`${config.uri}${config.endpoints.admin.update}/${this.props.user._id}`}
                        fieldProps={userProps[auth.role]}
                    />
                )
            case config.userRoles.volunteer:
                return (
                    <UserProfile
                        user={this.props.user}
                        endpoint={`${config.uri}${config.endpoints.volunteers.update}/${this.props.user._id}`}
                        fieldProps={userProps[auth.role]}
                    />
                )
            case config.userRoles.schoolPersonnel:
                return (
                    <UserProfile
                        user={this.props.user}
                        endpoint={`${config.uri}${config.endpoints.schoolPersonnels.update}/${this.props.user._id}`}
                        fieldProps={userProps[auth.role]}
                    />
                )
            default:
                return "";
        }
    }

    render() {
        if (!this.props.user) {
            return "Loading"
        }
        return (

            <Grid className="bg" container>

                <Grid item xs={1}>
                    <SideBar />
                </Grid>


                <Grid
                    item xs={11}
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center">
                    <Grid item>
                        <Box pb={12}>
                            {this.getProfile()}
                        </Box>
                    </Grid>
                </Grid>
            </Grid>

        )
    }
}

// define types
Profile.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// allows us to get our state from Redux and map it to props
const mapStateToProps = state => ({
    auth: state.auth,
    user: state.userData.user,
    errors: state.errors
});

export default connect(
    mapStateToProps,
)(withRouter(Profile));
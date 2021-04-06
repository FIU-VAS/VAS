import React, {Component} from 'react';
import {createMuiTheme} from '@material-ui/core/styles';
import {grey} from '@material-ui/core/colors';
import SideBar from '../components/AppBar/SideBar';
import SettingsForm from '../components/Settings/SettingsForm';
import Grid from "@material-ui/core/Grid";
import {withStyles} from "@material-ui/core";
import axios from "axios";
import config from "../config";
import {setCurrentSettings} from "../actions/siteSettingsActions";
import {connect} from "react-redux";

const theme = createMuiTheme({
    palette: {
        primary: grey,
    }

});

const useStyles = {
    blob: {
        position: 'absolute',
        right: '2%',
        bottom: '5%',
        height: "400px",
    }
};

class Settings extends Component {

    constructor() {
        super();
        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        axios.get(`${config.uri}${config.endpoints.siteSettings.fetch}`)
            .then( (response) => {
                if (response.data.length) {
                    this.props.setCurrentSettings(response.data[0])
                }
                this.setState({isLoading: false})
            })
    }

    render() {
        return (
            <Grid container spacing={2} >
                <Grid item xs={1}>
                    <SideBar/>
                </Grid>
                <Grid item xs={11}>
                    {!this.state.isLoading ? <SettingsForm/> : ""}
                </Grid>
                <img className={this.props.classes.blob}
                     src={require("../images/Ignite_2.png").default}
                     alt="Blob"
                />
            </Grid>
        )
    }
}

export default connect(
    null,
    {setCurrentSettings}
)(withStyles(useStyles)(Settings));

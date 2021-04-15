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
            <Grid container spacing={2} className="bg" >
                <Grid item xs={1}>
                    <SideBar/>
                </Grid>
                <Grid item xs={12} >
                    {!this.state.isLoading ? <SettingsForm/> : ""}
                </Grid>
        
            </Grid>
        )
    }
}

export default connect(
    null,
    {setCurrentSettings}
)(withStyles(useStyles)(Settings));

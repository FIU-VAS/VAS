import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AdminTable from '../components/Admins/AdminTable';
import SideBar from "../components/AppBar/SideBar";

const useStyles = {
    table: {
        marginTop: 20,
        minWidth: 800,
        maxWidth: 1100,
        height: 900
    },
}

class AdminManagement extends Component{

    render(){
        return (
            <div className="bg1">
                <Grid container direction="column" alignItems="center" justify="center">
                    <Grid item xs={1}>
                        <SideBar/>
                    </Grid>
                    <Grid item className={this.props.classes.table}>
                        <AdminTable/>
                
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default (withStyles(useStyles)(AdminManagement));

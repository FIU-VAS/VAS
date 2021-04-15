import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SchoolPersonnelTable from '../components/SchoolPersonnels/SchoolPersonnelTable';
import SideBar from "../components/AppBar/SideBar";

const useStyles = {
    all: {
        height: '100vh'
    },
    table: {
        marginTop: 20,
        minWidth: 800,
        maxWidth: 1100,
        height: 900,
       
    },
}    

class SchoolPersonnelManagement extends Component{
    
    render(){
        return (
            <div className={this.props.classes.all}  className="bg1">
                <Grid container direction="column" alignItems="center" justify="center">
                    <Grid item xs={1}>
                        <SideBar/>
                    </Grid> 
                    <Grid item className={this.props.classes.table}>
                        <SchoolPersonnelTable/>
                    </Grid>    
                </Grid>
            </div>    
        )
    }
}

export default (withStyles(useStyles)(SchoolPersonnelManagement));
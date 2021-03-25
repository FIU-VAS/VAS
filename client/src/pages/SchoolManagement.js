import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SchoolTable from '../components/School/SchoolTable';
import SideBar from "../components/AppBar/SideBar";

const useStyles = {
    all: {
        height: '100vh'
    },
    table: {
        marginTop: 20,
        minWidth: 800,
        maxWidth: 1100,
        height: 900
    },
    blob: {
        position: 'absolute',
        right: '1%',
        bottom: '5%',
        height : "400px",
        zIndex: '-1'
    }
}    

class SchoolManagement extends Component{
    
    render(){
        return (
            <div className={this.props.classes.all}
                style={{backgroundImage: 'url(' + require('../images/FIU_7_10.png') + ')',
                backgroundPosition: 'center',
                backgroundSize: 'cover' }}>
                <Grid container direction="column" alignItems="center" justify="center">
                    <Grid item xs={1}>
                        <SideBar/>
                    </Grid> 
                    <Grid item className={this.props.classes.table}>
                        <SchoolTable/>
                        <img className={this.props.classes.blob}
                            src ={require("../images/Ignite_2.png").default}
                            alt = "Blob" 
                        />
                    </Grid>    
                </Grid>
            </div>    
        )
    }
}

export default (withStyles(useStyles)(SchoolManagement));
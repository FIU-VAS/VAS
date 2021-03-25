import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AdminTable from '../components/Admins/AdminTable';

const useStyles = {
    all: {
        //backgroundColor: '#fafafa',
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

class AdminManagement extends Component{
    
    render(){
        return (
            <div className={this.props.classes.all}
                style={{backgroundImage: 'url(' + require('../images/FIU_4_10.png') + ')',
                backgroundPosition: 'center',
                backgroundSize: 'cover' }}>
                <Grid container direction="column" alignItems="center" justify="center">
                    <Grid item className={this.props.classes.table}>
                        <AdminTable/>
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

export default (withStyles(useStyles)(AdminManagement));
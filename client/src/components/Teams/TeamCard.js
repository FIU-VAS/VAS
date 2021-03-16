import Box from "@material-ui/core/Box";
import {blue, blueGrey, grey} from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React, {useState} from "react";
import {FormControl, makeStyles, TextField} from "@material-ui/core";
import PropTypes from "prop-types";
import {useForm, FormProvider, useFormContext, Controller} from "react-hook-form";

const useStyles = makeStyles(theme => ({
    all: {
        backgroundColor: '#fafafa',
        height: '100vh'
    },
    card: {
        marginTop: 10,
        minWidth: '50%',
        maxWidth: 500,
        height: 400,
        backgroundColor: 'white',
        margin: '0 auto 20px auto ',
        'overflow-x': 'hidden'
    },
    custom: {
        justify: 'center',
        minWidth: '300px',
        maxWidth: '50%',
    },
    buttons: {
        backgroundColor: blueGrey[700],
        color: "white",
        fontWeight: "bold",
        '&:hover': {
            backgroundColor: blue[500],
        }
    },
    main: {
        fontSize: 30,
        fontWeight: 800,
        color: grey[1000],
        alignItems: 'left',
        justify: 'left',
    },
    cardTitle: {
        fontSize: "20px",
        fontWeight: 800,
        color: 'white',
        alignItems: 'right'
    },
    title: {
        fontSize: 18,
        fontWeight: 800,
        color: grey[800],
        alignItems: 'right'
    },
    subHeading: {
        fontSize: 15,
        alignItems: 'left'
    },
    body: {
        fontSize: 13,
        alignItems: 'right',
    },
}));


export const TeamCardSubheading = (props) => {

    const {children} = props;
    const classes = useStyles();

    return (
        <Typography className={classes.subHeading} color="textPrimary" variant="h6" display="inline">
            {children}
        </Typography>
    )
};

export const TeamCardBody = (props) => {
    const {children} = props;
    const classes = useStyles();

    return (
        <Typography className={classes.body} color="textPrimary" variant="body1" display="inline" gutterBottom>
            {children}
            <br/>
        </Typography>
    )
}


export const TeamCard = (props) => {

    const classes = useStyles();

    const {cardHeader, headerColor, children, cardHeaderIcon, alignHeaderCenter} = props;

    return (
        <Box
            borderRadius="10px"
            boxShadow={3}
            className={classes.card}
            variant="outlined"
            justify="center"
        >

            <Box
                borderRadius="10px 10px 0px 0px"
                boxShadow={2}
                style={{backgroundColor: headerColor}}
                py={2}
            >
                <Typography
                    className={classes.cardTitle}
                    style={{textAlign: 'center'}}>
                    {cardHeaderIcon}
                    {cardHeader}
                </Typography>
            </Box>

            <Grid style={{paddingLeft: '15px', paddingTop: '10px', paddingRight: '15px', paddingBottom: '15px',}}>
                {children}
            </Grid>
        </Box>
    )
}

// TeamCard.PropTypes = {
//     cardHeader: PropTypes.string,
//     headerColor: PropTypes.any,
//     children: PropTypes.any,
//     cardHeaderIcon: PropTypes.any,
//     alignHeaderCenter: PropTypes.string,
// }
import React, {useState} from "react";
import {useForm, FormProvider} from "react-hook-form";
import axios from "axios";

import {MaterialUIField} from "../Users/UserFormDialog";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Card, CardActions} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {map} from "lodash";
import { PlayCircleFilledWhite } from "@material-ui/icons";


const useStyles = makeStyles(theme => ({
    all: {
        height: '100vh'
    },
    card: {
        marginTop: 10,
        minWidth: 300,
        maxWidth: 700,
        backgroundColor: 'transparent'
    },
    paper: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 25,
        alignItems: 'center'
    },
    pos: {
        marginBottom: 12,
    },
    green: {
        color: 'white',
        backgroundColor: '#72D565',
        '&:hover': {
            backgroundColor: '#72D565',
        }
    },
    Avatar: {
        marginTop: 20,
        marginBottom: 20,
    },
    form: {
        width: '100%',
    }
}));


export const UserProfile = (props) => {
    const {user, fieldProps, endpoint} = props;

    const [locked, setLocked] = useState(true);
    const [response, setResponse] = useState(null)
    const classes = useStyles();

    const defaults = fieldProps.map(fieldProps => {
        return {
            [fieldProps.name]: user[fieldProps.name]
        }
    }).reduce((acc, obj) => Object.assign({}, acc, obj));

    const methods = useForm({
        defaultValues: defaults,
    });

    const submit = async (data) => {
        try {
            await axios.post(endpoint, data)
            setResponse({
                severity: "success",
                message: "User updated successfully"
            });
        } catch (error) {
            setResponse({
                severity: "error",
                message: error.response ? error.response.statusText : error.toString()
            });
        }
    }

    let initials = (user.firstName.substring(0, 1) + user.lastName.substring(0, 1)).toUpperCase();

    return (
        <FormProvider {...methods}>
            <div className={classes.all}>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center">
                    <Card
                        className={classes.card}
                        justify="center">
                        <form className={classes.form} onSubmit={methods.handleSubmit(submit)}>
                            <CardContent>
                                {response && (
                                    <Alert severity={response.severity} style={{marginBottom: "1rem"}}>
                                        {response.message}
                                    </Alert>
                                )}
                                <Grid
                                    className={classes.Avatar}
                                    container
                                    spacing={0}
                                    direction="column"
                                    alignItems="center"
                                    justify="center"
                                >
                                    <Avatar classes={{root: 'avatar-style'}}
                                            className={classes.green}>{initials}</Avatar>
                                </Grid>
                                <div className={classes.paper}>
                                    <Typography className={classes.title} color="textPrimary" variant="h4"
                                                gutterBottom>
                                        {user.role}
                                    </Typography>
                                </div>
                                <Typography className={classes.title} color="textSecondary" variant="h4"
                                            gutterBottom>
                                    Profile Information
                                </Typography>


                                {fieldProps.map((properties, index) => {
                                    properties.disabled = locked;
                                    if (!properties.wrapper || !properties.wrapper.component) {
                                        return (<MaterialUIField key={`field-${index}`} fieldProps={properties}/>)
                                    } else {
                                        let Component = properties.wrapper.component;
                                        return (
                                            <Component {...properties.wrapper.props}>
                                                <MaterialUIField key={`field-${index}`} fieldProps={properties}/>
                                            </Component>
                                        )
                                    }
                                })}
                                <Grid container>
                                    {map(methods.errors, (error, key) => {
                                        return (
                                            <Grid item>
                                                <Typography variant="subtitle2" color="error">
                                                    {fieldProps.filter(field => field.name === key)[0]['label']} is required
                                                </Typography>
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            </CardContent>
                            <CardActions>
                                <Button type="submit" variant="contained" className={classes.green}
                                        disabled={locked}>Submit</Button>
                                <Button className={classes.green} onClick={() => setLocked(!locked)}>
                                    {locked ? 'Edit' : 'Lock'}
                                </Button>
                            </CardActions>
                        </form>
                    </Card>
                </Grid>
            </div>
        </FormProvider>
    )
}
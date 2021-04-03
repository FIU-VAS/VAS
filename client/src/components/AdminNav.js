import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import React from "react";
import {blue, blueGrey, grey} from "@material-ui/core/colors";
import {makeStyles} from "@material-ui/core/styles";
import {useRouteMatch, Link as RouterLink} from "react-router-dom";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    buttons: {
        backgroundColor: blueGrey[700],
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
        '&:hover': {
            backgroundColor: blue[500],
        }
    },
    title: {
        fontSize: 18,
        fontWeight: 800,
        color: grey[800],
        alignItems: 'right'
    },
}));

const routes = [
    {
        title: "Calendar",
        link: ""
    },
    {
        title: "Admin Management",
        link: "/admin-management"
    },
    {
        title: "Volunteer Management",
        link: "/volunteer-management"
    },
    {
        title: "School Management",
        link: "/school-management"
    },
    {
        title: "School Personnel Management",
        link: "/school-personnel-management"
    },
    {
        title: "Team Management",
        link: "/team-management"
    }
]

export const AdminNav = (props) => {

    const classes = useStyles();
    let {url} = useRouteMatch();

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center">

            <Box
                borderRadius="10px"
                boxShadow={3}
                variant="outlined"
                justify="center">
                <Grid style={{paddingLeft: '15px', paddingTop: '10px', paddingRight: '15px', paddingBottom: '15px'}}>

                    <Typography
                        className={classes.title}
                        style={{marginBottom: '15px', alignItems: 'left'}}>
                        Administrator Management Tools:
                    </Typography>

                    <Grid
                        container
                        direction="row"
                        justify="space-evenly"
                        alignItems="stretch"
                        spacing={3}
                    >
                        {routes.map(route => (
                            <Grid container item xs={12} sm>
                                <Button
                                    component={RouterLink} to={`${url}${route.link}`}
                                    className={classes.buttons}
                                    variant="contained"
                                    color="primary"
                                    size='medium'
                                    fullWidth
                                >
                                    {route.title}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    )
}
import React from "react";
import {Badge, Card, Grid, IconButton, Typography, Avatar, CardContent} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Mail, Phone} from "@material-ui/icons";

const userCardStyles = makeStyles(theme => ({
    cardImage: {
        borderRadius: "100%",
        paddingBottom: "100%",
        width: "120px",
    },
    avatar: {
        padding: "0.5rem",
        // marginBottom: "0.5rem"
    }
}))

export const UserCard = (props) => {
    const {firstName, lastName, phoneNumber, email} = props;

    const classes = userCardStyles();

    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} style={{textAlign: "center"}}>
                        <Badge>
                            <Avatar className={classes.avatar}>{firstName[0]} {lastName[0]}</Avatar>
                        </Badge>
                    </Grid>
                    <Grid item xs={12} style={{textAlign: "center"}}>
                        <Typography variant="h4">
                            {firstName} {lastName}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {email}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {phoneNumber}
                        </Typography>
                        <Grid item container xs={6} style={{margin: "0 auto"}}>
                            <Grid item xs={6} style={{textAlign: "center"}}>
                                <IconButton href={`mailto:${email}`}>
                                    <Mail />
                                </IconButton>
                            </Grid>
                            <Grid item xs={6} style={{textAlign: "center"}}>
                                <IconButton href={`tel:${phoneNumber}`}>
                                    <Phone />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
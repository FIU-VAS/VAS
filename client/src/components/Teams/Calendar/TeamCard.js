import React, {useEffect, useState} from "react";
import {
    Paper,
    Typography,
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    IconButton,
    Box,
    CircularProgress, Collapse, Button
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {format} from "date-fns";
import {UserCard} from "./UserCard";
import {Close} from "@material-ui/icons";
import axios from "axios";
import config from "../../../config";

const cardStyles = makeStyles(theme => ({
    box: {
        width: '100%',
        padding: '1rem',
        margin: '0.5rem 0',
        backgroundColor: "white",
        position: 'relative'
    },
    boxHeader: {
        fontSize: "1.1rem",
        lineHeight: "1.35rem",
        
    },
    boxSubheader: {
        textTransform: "capitalize",
        fontWeight: 400,
        
    },
    chip: {
        margin: "0.15rem",
        fontWeight: "bold",
        backgroundColor: "black",
        "&:hover": {
            backgroundColor: "black"
          }
    },
    badge: {
        borderRadius: "4px",
        padding: "0.25rem 0.5rem",
        color: "white",
        display: "inline-block",
        background: "#57C965",
    },
    closeButton: {
        position: 'relative',
        color: theme.palette.grey[500],
        float: "right"
    },
    expandButton: {
        marginTop: "0.25rem",
        color: 'black',
    }
}));

const teamDataInitialState = {
    teamVolunteers: [],
    teamPersonnel: [],
    teamSchool: {}
};

const getCurrentTeamData = async (team) => {
    const response = await axios({
        method: "GET",
        url: `${config.uri}${config.endpoints.team.getTeamData}` + "/" + team._id,
        params: {
            related: ['volunteers', 'school', 'schoolPersonnel']
        }
    });
    if (response.data.success) {
        const team = response.data.team
        return {
            teamVolunteers: team.volunteers,
            teamPersonnel: team.schoolPersonnel,
            teamSchool: team.school[0]
        }
    }
    return teamDataInitialState;
}

const TeamDetails = (props) => {
    const {teamVolunteers, teamPersonnel, classes} = props;

    const [selectedUser, setSelectedUser] = useState({});
    const [showDetails, setShowDetails] = useState(false);

    const isSelectedUser = () => {
        return !!Object.keys(selectedUser).length
    }

    return (
        <React.Fragment>
            <Collapse in={showDetails}>
                <Grid item xs={12}>
                    <Typography variant="h6" style={{fontSize: "1rem"}}>
                        Volunteers
                    </Typography>
                    {teamVolunteers.map(volunteer => {
                        return (
                            <Chip
                                key={volunteer._id}
                                color="secondary"
                                label={`${volunteer.firstName} ${volunteer.lastName}`}
                                className={classes.chip}
                                onClick={() => {
                                    setSelectedUser(volunteer)
                                }}
                            />
                        )
                    })}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" style={{fontSize: "1rem"}}>
                        Personnel
                    </Typography>
                    {teamPersonnel.map(personnel => {
                        return (
                            <Chip
                                key={personnel._id}
                                color="primary"
                                label={`${personnel.firstName} ${personnel.lastName}`}
                                className={classes.chip}
                                onClick={() => {
                                    setSelectedUser(personnel)
                                }}
                            />
                        )
                    })}
                </Grid>
            </Collapse>
            <Grid item xs={12}>
                <Button
                    className={classes.expandButton}
                    onClick={() => setShowDetails(!showDetails)}
                    color="primary"
                    size="small"
                >
                    {showDetails ? "Show less" : "Show More"}
                </Button>
            </Grid>
            <Dialog open={isSelectedUser()} onClose={() => setSelectedUser({})}>
                <DialogTitle style={{padding: "0rem 1rem", borderBottom: "none"}}>
                    <IconButton className={classes.closeButton} aria-label="close" onClick={() => setSelectedUser({})}>
                        <Close/>
                    </IconButton>
                </DialogTitle>
                {isSelectedUser() && <UserCard {...selectedUser}/>}
            </Dialog>
        </React.Fragment>
    )
}

let TeamCardComponent = (props) => {

    const {team, day, admins} = props;
    const [loading, setLoading] = useState(true);
    const [teamData, setTeamData] = useState(teamDataInitialState);

    const {teamSchool} = teamData;

    useEffect(() => {
         (async () => {
             try {
                 let data = await getCurrentTeamData(team);
                 setTeamData(data);
             } catch (httpError) {
                 if (httpError.response.data) {
                     // Error is recognized by server
                 }
                 // Server doesn't know what happened
             }
             setLoading(false);
         })()
    }, []);

    // Assuming team is only available once in the day
    const todayAvailability = team.availability.filter(available => available.dayOfWeek === day)[0];

    const classes = cardStyles();

    return (
        <Paper elevation={2} className={classes.box}>
            <Grid container spacing={1}>
                {!loading ? (
                       <React.Fragment>
                           <Grid item container xs={8} alignItems="flex-start">
                               <Grid item xs={12}>
                                   <Typography variant="h6" className={classes.boxHeader}>
                                       {teamSchool.schoolName}
                                   </Typography>
                               </Grid>
                               <Grid item xs={12}>
                                   <Typography variant="subtitle2" className={classes.boxSubheader}>
                                       {teamSchool.address.toLowerCase()}
                                   </Typography>
                               </Grid>
                           </Grid>
                           <Grid item xs={4} style={{textAlign: "right"}}>
                               <div className={classes.badge} style={{
                                   background: team.isActive ? "#5fdba7" : "#ff0033"
                               }}>
                                   <Typography variant="caption" style={{fontWeight: 700}}>
                                       {team.isActive ? "Active" : "Inactive"}
                                   </Typography>
                               </div>
                           </Grid>
                           <Grid item xs={12}>
                               <Typography variant="h6" style={{fontWeight: 600, fontSize: "1rem"}}>
                                   {format(todayAvailability.startTime, "h:mm aa")} – {format(todayAvailability.endTime, "hh:mm aa")}
                               </Typography>
                           </Grid>
                           <TeamDetails
                               teamVolunteers={teamData.teamVolunteers}
                               teamPersonnel={teamData.teamPersonnel}
                               classes={classes}
                           />
                       </React.Fragment>
                    ) : (
                    <Grid item xs={12}>
                        <CircularProgress />
                    </Grid>
                )}
            </Grid>
        </Paper>
    )
};

export const TeamCard = TeamCardComponent;
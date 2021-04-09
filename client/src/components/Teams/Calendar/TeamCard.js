import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {
    Paper,
    Typography,
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    IconButton,
    CircularProgress, Collapse, Button
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {format} from "date-fns";
import {UserCard} from "./UserCard";
import {Close, Edit, DeleteForeverSharp} from "@material-ui/icons";
import axios from "axios";
import config from "../../../config";
import TeamDialog from "../TeamDialog/TeamDialog";
import {TeamDeleteDialog} from "../TeamDialog/TeamDeleteDialog";
import {fromUTC} from "../../../utils/availability";

const cardStyles = makeStyles(theme => ({
    box: {
        width: '100%',
        padding: '1rem',
        margin: '0.5rem 0',
        position: 'relative'
    },
    boxHeader: {
        fontSize: "1rem",
        lineHeight: "1.35rem",
    },
    boxSubheader: {
        textTransform: "capitalize",
        fontWeight: 400,
        color: theme.palette.text.secondary,
    },
    chip: {
        margin: "0.15rem",
        fontWeight: "bold",
        background: theme.palette.grey[900],
        "&:focus": {
            background: theme.palette.grey[900],
        }
    },
    badge: {
        borderRadius: "4px",
        padding: "0.25rem 0.5rem",
        color: "white",
        display: "inline-block"
    },
    closeButton: {
        position: 'relative',
        color: theme.palette.grey[500],
        float: "right"
    },
    expandButton: {
        marginTop: "0.25rem",
        color: 'black',
    },
    editButton: {
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
        url: `${config.uri}${config.endpoints.team.getTeamData}/${team._id}`,
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
    // @TODO warn when volunteers in existing team have availability different than school personnel

    const {team, teamVolunteers, teamPersonnel, classes} = props;

    const [selectedUser, setSelectedUser] = useState({});
    const [showDetails, setShowDetails] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [deleteTeam, setDeleteTeam] = useState(null);

    const isSelectedUser = () => {
        return !!Object.keys(selectedUser).length
    }

    const [semester, year] = (() => {
        let today = new Date();
        return [today.getMonth() > 6 ? "Fall" : "Spring", String(today.getFullYear())]
    })()

    const role = useSelector(state => state.userData.user.role);

    return (
        <React.Fragment>
            <Collapse in={showDetails}>
                <Grid item xs={12} style={{marginTop: "1rem"}}>
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
                {team.closureNotes !== "" ? (
                    <Grid item xs={12} style={{marginTop: "1rem"}}>
                        <Typography variant="h6" style={{fontSize: "1rem"}}>
                            Notes:
                        </Typography>
                        <Typography variant="body2">
                            {team.closureNotes}
                        </Typography>
                    </Grid>
                ) : ""}
            </Collapse>
            <Grid item container xs={12} justify="space-between" alignItems="center">
                <Grid item xs={8}>
                    <Button
                        className={classes.expandButton}
                        onClick={() => setShowDetails(!showDetails)}
                        color="primary"
                        size="small"
                    >
                        {showDetails ? "Show less" : "Show More"}
                    </Button>
                </Grid>
                <Grid container item xs={4} alignItems="center" justify="flex-end">
                    {role === "admin" && semester === team.semester && year === team.year && (
                        <React.Fragment>
                        <Grid item xs="auto">
                            <IconButton
                                className={classes.editButton}
                                color="primary"
                                size="small"
                                onClick={() => setSelectedTeam(team)}
                            >
                                <Edit fontSize="small"/>
                            </IconButton>
                        </Grid>
                        <Grid item xs="auto">
                            <IconButton onClick={() => setDeleteTeam(team)}>
                                <DeleteForeverSharp color="error" />
                            </IconButton>
                        </Grid>
                        </React.Fragment>
                    )}
                </Grid>
            </Grid>
            <Dialog open={isSelectedUser()} onClose={() => setSelectedUser({})}>
                <DialogTitle style={{padding: "0rem 1rem", borderBottom: "none"}}>
                    <IconButton className={classes.closeButton} aria-label="close" onClick={() => setSelectedUser({})}>
                        <Close/>
                    </IconButton>
                </DialogTitle>
                {isSelectedUser() && <UserCard {...selectedUser}/>}
            </Dialog>
            {selectedTeam ? (
                <TeamDialog
                    open={!!selectedTeam}
                    close={() => setSelectedTeam(null)}
                    team={Object.assign({}, team, {
                        volunteers: teamVolunteers,
                        schoolPersonnel: teamPersonnel[0]
                    })}
                    onSubmit={() => {
                        if (props.onChange) {
                            props.onChange();
                        }
                    }}
                />
            ) : ""}
            {deleteTeam && (
                <TeamDeleteDialog
                    open={deleteTeam}
                    close={() => {setDeleteTeam(null)}}
                    onSubmit={console.log}
                    deleteTeam={team}
                />
            )}
        </React.Fragment>
    )
}

let TeamCardComponent = (props) => {

    const {team, day} = props;
    const [loading, setLoading] = useState(true);
    const [teamData, setTeamData] = useState(teamDataInitialState);

    const {teamSchool} = teamData;

    const updateData = async () => {
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
    }

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
    const todayAvailability = fromUTC(team.availability.filter(available => available.dayOfWeek === day))[0];

    const classes = cardStyles();

    return (
        <Paper elevation={2} className={classes.box} style={{textAlign: "left"}}>
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
                                background: team.isActive ? "rgb(87, 201, 101)" : "#ff0033"
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
                            team={team}
                            teamVolunteers={teamData.teamVolunteers}
                            teamPersonnel={teamData.teamPersonnel}
                            classes={classes}
                            onChange={updateData}
                        />
                    </React.Fragment>
                ) : (
                    <Grid item xs={12}>
                        <CircularProgress/>
                    </Grid>
                )}
            </Grid>
        </Paper>
    )
};

export const TeamCard = TeamCardComponent;
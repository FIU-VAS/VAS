// This component is the equivalent to VolunteerTable etc..

import React, {useState, Component} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {green, red} from '@material-ui/core/colors';
import {createMuiTheme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import {Sync, Add, ArrowUpward} from '@material-ui/icons';
import {ButtonGroup, Paper} from "@material-ui/core";
import {useForm, Controller} from "react-hook-form";
import {subYears, eachYearOfInterval, format} from "date-fns";
import {MuiSelect} from "../Users/UserFormDialog";
import config from "../../config";
import axios from "axios";
import {AppTeamCalendar} from "./TeamCalendar";
import TeamDialog from "./TeamDialog/TeamDialog";

const teamManagementStyles = makeStyles(theme => ({
    queryWrapper: {
        padding: theme.spacing(2),
        maxWidth: "800px",
        margin: "0 auto"
    },
    query: {},
    queryButton: {}
}))

const TeamView = () => {
    const [currentTeams, setCurrentTeams] = useState([])
    const [triedOnce, setTriedOnce] = useState(false);
    const [loading, setLoading] = useState(false)
    const [newTeam, setNewTeam] = useState(false)

    const classes = teamManagementStyles();

    const {handleSubmit, control} = useForm({
        defaultValues: {
            semester: '',
            year: ''
        }
    });

    const years = eachYearOfInterval({start: subYears(new Date(), 10), end: new Date()}).map(year => {
        let formatted = format(year, "yyyy");
        return {
            label: formatted,
            value: formatted
        }
    });

    const getTeams = async (data) => {
        setCurrentTeams([]);
        setLoading(true);
        setTriedOnce(true);

        try {
            const response = await axios({
                method: "GET",
                url: `${config.uri}${config.endpoints.team.fetch}`,
                params: {
                    semester: data.semester,
                    year: data.year
                }
            });
            setCurrentTeams(response.data)
        } catch (error) {
            if (error.response.data) {
                // Server knows the error
            }
            // server doesn't know the error
        }
        setLoading(false);
    };

    return (
        <React.Fragment>
            <Box mt={4}>
                <Paper elevation={2} className={classes.queryWrapper}>
                    <Grid container alignItems="center" justify="center" spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="h6" align="left">
                                Query Teams
                            </Typography>
                        </Grid>
                        <Grid item xs={6} style={{textAlign: "right"}}>
                            <ButtonGroup>
                                <Button
                                    variant="contained"
                                    style={{'backgroundColor':'#57C965', 'color':'black'}}
                                    endIcon={<Add/>}
                                    onClick={() => setNewTeam(true)}
                                >Create Team </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <form onSubmit={handleSubmit(getTeams)}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Controller
                                    as={MuiSelect}
                                    name="semester"
                                    control={control}
                                    label="Semester"
                                    options={[
                                        {label: "Spring", value: "Spring"},
                                        {label: "Fall", value: "Fall"},
                                    ]}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controller
                                    as={MuiSelect}
                                    label="Year"
                                    name="year"
                                    control={control}
                                    options={years}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    className={classes.queryButton}
                                    endIcon={<Sync/>}
                                    variant="contained"
                                    fullWidth
                                    size="small"
                                    style={{'backgroundColor':'#57C965', 'color':'black'}}
                                    type="submit"
                                >
                                    Display Teams
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
            <Box mt={4}>
                {!currentTeams.length && !triedOnce && (
                    <Typography variant="h3" align="center">
                        Please select a semester and a year
                    </Typography>
                )}
                {triedOnce && !currentTeams.length && !loading && (
                    <Typography variant="h3" align="center">
                        No results where found for selected semester and year
                    </Typography>
                )}
                {!!currentTeams.length && triedOnce && (
                    <AppTeamCalendar teams={currentTeams}/>
                )}
            </Box>
            {newTeam ? (
                <TeamDialog open={newTeam} close={() => setNewTeam(false)} />
            ) : ""}
        </React.Fragment>
    )
}

export default TeamView;
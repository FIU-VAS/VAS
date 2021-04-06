import React, {useState} from "react";
import {
    Backdrop,
    Button,
    CircularProgress, Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid, Snackbar,
    Typography
} from "@material-ui/core";
import {connect} from "react-redux";
import {MaterialUIField} from "../../Users/UserFormDialog";
import {useForm, FormProvider, Controller} from "react-hook-form";
import axios from "axios";
import {format, parseISO} from "date-fns";

import config from "../../../config";
import {TransferList} from "../../Extras/TransferList";
import {makeStyles} from "@material-ui/core/styles";
import {Alert} from "@material-ui/lab";
import {PersonnelPicker} from "./PersonnelPicker";
import {AvailabilityDialog} from "../../Extras/AvailabilityDialog";
import {parseAvailabilityISO} from "../Calendar/utils";
import {setTeams} from "../../../actions/volunteerRequestActions";

const teamDialogStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}))

const volunteerForTransferList = (volunteer) => {
    return {
        value: volunteer.pantherID,
        label: (
            <Grid key={volunteer.pantherID} container>
                <Grid item xs={12}>
                    <Typography>
                        {volunteer.firstName + " " + volunteer.lastName}
                    </Typography>
                </Grid>
                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <Typography style={{fontWeight: 600}}>
                            Times:
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {volunteer.availability && volunteer.availability.map((available, index) => {
                            const [startTime, endTime] = parseAvailabilityISO(available)
                            return (
                                <Typography key={`available-${index}`} style={{fontWeight: 600}}>
                                    {format(startTime, "HH:mm")} – {format(endTime, "HH:mm")}
                                </Typography>
                            )
                        })}
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

const TeamDialog = (props) => {
    // @TODO warn when selected volunteers are out of time frame of school personnel

    const {open, close, onSubmit} = props;

    const defaultState = {
        semester: '',
        year: '',
        volunteers: [],
        schoolCode: '',
        availability: [],
        volunteerPIs: [],
        isActive: true,
        closureNotes: '',
    };

    const formMethods = useForm({
        defaultValues: Object.assign({}, {
            semester: '',
            year: '',
            volunteers: [],
            schoolCode: '',
            availability: [],
            volunteerPIs: [],
            isActive: true,
            closureNotes: '',
        }, {
            ...props.team,
            volunteers: props.team && props.team.volunteers && props.team.volunteers.length ? props.team.volunteers.map(volunteerForTransferList) : [],
            schoolPersonnel: props.team && props.team.schoolPersonnel ? props.team.schoolPersonnel.email : "",
        })
    });

    const {handleSubmit, watch, control, formState: {isDirty}} = formMethods;
    const allFields = watch();

    const classes = teamDialogStyles();

    const [schoolPersonnel, setSchoolPersonnel] = useState([]);
    const [volunteers, setVolunteers] = useState(
        props.team && props.team.volunteers && props.team.volunteers.length ? props.team.volunteers : []
    );
    const [editingAvailability, setEditingAvailability] = useState({});
    const [response, setResponse] = useState(null);

    const [team, setTeam] = useState(defaultState);
    const [loading, setLoading] = useState(false);

    const updatePersonnel = (schoolCode) => {
        setLoading(true);
        setSchoolPersonnel([]);

        axios.get(`${config.uri}${config.endpoints.schoolPersonnels.fetch}/?schoolCode=${schoolCode}`)
            .then((response) => {
                setSchoolPersonnel(response.data);
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
    };

    const updateVolunteers = (availability) => {
        setLoading(true);
        let params;

        if (!isDirty && volunteers.length && availability) {
            return;
        }
        setVolunteers([]);

        if (availability && !availability.length) {
            setLoading(false);
            return
        }

        if (availability) {
            params = {
                availability: availability.map(available => {
                    const startTime = format(
                        typeof available.startTime !== "string" ?
                            available.startTime :
                            parseISO(available.startTime),
                        "HH:mm"
                    );
                    const endTime = format(
                        typeof available.startTime !== "string" ?
                            available.endTime :
                            parseISO(available.endTime),
                        "HH:mm"
                    );
                    return {
                        ...available,
                        startTime: startTime,
                        endTime: endTime
                    }
                }),
                semester: allFields.semester,
                year: allFields.year,
            }
        }
        axios.get(`${config.uri}${config.endpoints.volunteers.fetch}/`, {
            params
        }).then(response => {
            setVolunteers(response.data);
            setLoading(false);
        }).catch(err => {
            console.log(err)
            setLoading(false);
        });
    }

    const updateData = async () => {
        if (!!allFields.schoolCode && allFields.schoolCode !== team.schoolCode) {
            updatePersonnel(allFields.schoolCode);
        }
        if (!!allFields.availability && allFields.availability !== team.availability) {
            updateVolunteers(allFields.availability)
        }
        setTeam({
            ...team,
            ...allFields
        });
    };

    const sameData = () => {
        for (const field in allFields) {
            if (team.hasOwnProperty(field)) {
                if (team[field] !== allFields[field]) {
                    return false;
                }
            }
        }
        return true;
    }

    const submit = (data) => {
        setResponse(null);
        const teamData = {
            semester: data.semester,
            year: data.year,
            schoolCode: data.schoolCode,
            availability: data.availability.map(available => {
                const [startTime, endTime] = parseAvailabilityISO(available)

                return {
                    dayOfWeek: available.dayOfWeek,
                    startTime: format(startTime, "HH:mm"),
                    endTime: format(endTime, "HH:mm")
                }
            }),
            volunteerPIs: data.volunteers.map(volunteer => volunteer.value),
            isActive: true,
        }

        if (props.team) {
            teamData._id = props.team._id
        }

        axios.post(`${config.uri}${config.endpoints.team.create}`, teamData)
            .then(response => {
                if (response.data.success) {
                    setResponse({
                        severity: "success",
                        message: "Team created successfully"
                    })
                    if (onSubmit) {
                        onSubmit(response.data);
                        setTeams([...props.teams.filter(team => team._id !== response.data.team._id), response.data.team]);
                    }
                }
            })
            .catch(error => {
                setResponse({
                    severity: "error",
                    message: error.response ? error.response.statusText : error.toString()
                })
            })
    }

    if (open) {
        if (!loading && !sameData()) {
            (async () => {
                await updateData()
            })();
        }
    }

    const selectedPersonnel = allFields.schoolPersonnel && allFields.schoolPersonnel.length
        ? schoolPersonnel.filter(personnel => allFields.schoolPersonnel.indexOf(personnel.email) !== -1)
        : [];

    return (
        <Dialog open={open} onClose={() => {
            setResponse(null);
            close();
        }} maxWidth="md" fullWidth={true}>
            <DialogTitle>
                Create Team
            </DialogTitle>
            <FormProvider {...formMethods}>
                <form onSubmit={handleSubmit(submit)}>
                    <DialogContent>
                        {response && (
                            <Snackbar
                                open={true}
                                onClose={() => setResponse(null)}
                                autoHideDuration={2000}
                                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            >
                                <Alert severity={response.severity} style={{marginBottom: "1rem"}}>
                                    {response.message}
                                </Alert>
                            </Snackbar>
                        )}
                        <Backdrop className={classes.backdrop} open={loading}>
                            <CircularProgress color="inherit"/>
                        </Backdrop>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <MaterialUIField fieldProps={{
                                    type: 'select',
                                    options: props.schools.map(school => ({
                                        value: school.schoolCode,
                                        label: school.schoolName
                                    })),
                                    name: 'schoolCode',
                                    defaultValue: '',
                                    label: 'School',
                                    rules: {
                                        required: true
                                    }
                                }}/>
                            </Grid>
                            <Grid item xs={6}>
                                <MaterialUIField fieldProps={{
                                    type: 'text',
                                    name: 'semester',
                                    defaultValue: (new Date()).getMonth() > 6 ? "Fall" : "Spring",
                                    label: 'Semester',
                                    rules: {
                                        required: true
                                    }
                                }}/>
                            </Grid>
                            <Grid item xs={6}>
                                <MaterialUIField fieldProps={{
                                    type: 'text',
                                    name: 'year',
                                    defaultValue: format(new Date(), "yyyy"),
                                    label: 'Year',
                                    rules: {
                                        required: true
                                    }
                                }}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Collapse in={!!schoolPersonnel.length}>
                                    <MaterialUIField fieldProps={{
                                        type: 'select',
                                        options: schoolPersonnel.map(personnel => ({
                                            value: personnel.email,
                                            label: personnel.firstName + " " + personnel.lastName
                                        })),
                                        name: 'schoolPersonnel',
                                        defaultValue: '',
                                        label: 'School Personnel',
                                        rules: {
                                            required: true
                                        }
                                    }}/>
                                </Collapse>
                            </Grid>
                            <Grid container item xs={12} alignItems="center">
                                <Collapse in={!!selectedPersonnel.length}>
                                    <Grid container item xs={12} alignItems="center">
                                        <PersonnelPicker
                                            selectedPersonnel={selectedPersonnel}
                                            schoolPersonnel={schoolPersonnel}
                                            onEditPersonnel={setEditingAvailability}
                                        />
                                    </Grid>
                                </Collapse>
                            </Grid>
                            <Grid item xs={12}>
                                <Collapse in={!!team.availability && !!team.availability.length && !!volunteers.length}
                                          mountOnEnter={true} unmountOnExit={true}>
                                    <Controller
                                        control={control}
                                        as={<TransferList
                                            titleLeft={(
                                                <Grid container alignItems="center" justify="space-between">
                                                    <Grid item xs="auto">
                                                        <Typography>Available Volunteers</Typography>
                                                    </Grid>
                                                    <Grid item xs="auto">
                                                        <Button onClick={() => updateVolunteers(null)}>
                                                            Load All
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            )}
                                            titleRight="Selected Volunteers"
                                            available={volunteers.map(volunteerForTransferList)}
                                        />}
                                        rules={{
                                            validate: (value) => value.length > 0
                                        }}
                                        name="volunteers"
                                        label="Volunteers"
                                    />
                                </Collapse>
                            </Grid>
                            <Grid item xs={12}>
                                <Collapse
                                    in={!!team.availability && !!team.availability.length && !loading && !volunteers.length}>
                                    <Grid container justify="space-between">
                                        <Grid item xs={8}>
                                            <Typography variant="subtitle2" color="error">
                                                There are no volunteers
                                            </Typography>
                                        </Grid>
                                        <Grid item xs="auto">
                                            <Button onClick={() => updateVolunteers(null)} variant="outlined"
                                                    size="small">
                                                Manual Selection
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Collapse>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions style={{justifyContent: "center"}}>
                        <Button type="submit" variant="contained" color="primary">Submit</Button>
                    </DialogActions>
                </form>
            </FormProvider>
            <AvailabilityDialog
                onSubmit={(data) => setSchoolPersonnel(schoolPersonnel.map(personnel => {
                    if (personnel.email === data.result.email) {
                        return data.result;
                    }
                    setEditingAvailability({});
                    return personnel
                }))}
                open={!!Object.keys(editingAvailability).length}
                close={() => setEditingAvailability({})}
                userEmail={editingAvailability.email}
                endpoint={`${config.uri}${config.endpoints.schoolPersonnels.update}/${editingAvailability._id}`}
            />
        </Dialog>
    )
};

const mapStateToProps = state => ({
    errors: state.errors,
    success: state.success,
    teams: state.teamData.teams,
    schools: state.schoolData.schools,
    volunteers: state.volunteers.volunteers
});

export default connect(
    mapStateToProps,
    {setTeams}
)(TeamDialog);
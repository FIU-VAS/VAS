import React, {useCallback, useEffect, useState} from "react";
import {
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography
} from "@material-ui/core";
import {connect} from "react-redux";
import {MaterialUIField, UserFormDialog} from "../Users/UserFormDialog";
import {useForm, FormProvider, Controller} from "react-hook-form";
import axios from "axios";
import {format, parseISO} from "date-fns";

import config from "../../config";
import {AvailabilityDialog} from "../Extras/AvailabilityDialog";
import {SelectTimeFrame} from "../Extras/SelectTimeFrame";
import {TransferList} from "../Extras/TransferList";
import {makeStyles} from "@material-ui/core/styles";
import {Alert} from "@material-ui/lab";

const teamDialogStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}))

const TeamDialog = (props) => {
    const formMethods = useForm({
        defaultValues: {
            volunteers: [],
            availability: []
        }
    });
    const {handleSubmit, watch, control, formState: {isDirty}, reset} = formMethods;
    const allFields = watch();

    const classes = teamDialogStyles();

    const defaultState = {
        semester: '',
        year: '',
        schoolCode: '',
        availability: [
            {
                dayOfWeek: '',
                startTime: '10:00',
                endTime: '11:00',
            }
        ],
        volunteerPIs: [],
        isActive: true,
        closureNotes: '',
    };

    const {open, close, onSubmit} = props;

    const [schoolPersonnel, setSchoolPersonnel] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [openAvailability, setOpenAvailability] = useState(false);
    const [response, setResponse] = useState(null)

    const [team, setTeam] = useState(Object.assign({}, defaultState, props.team));
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
        axios.get(`${config.uri}${config.endpoints.volunteers.fetch}/`, {
            params: {
                availability: availability.map(available => ({
                    ...available,
                    startTime: format(parseISO(available.startTime), "HH:mm"),
                    endTime: format(parseISO(available.endTime), "HH:mm")
                })),
                semester: allFields.semester,
                year: allFields.year,
            }
        }).then(response => {
            setVolunteers(response.data);
            setLoading(false);
        }).catch(err => {
            console.log(err)
            setLoading(false);
        });
    }

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
            availability: data.availability.map(available => ({
                dayOfWeek: available.dayOfWeek,
                startTime: format(parseISO(available.startTime), "HH:mm"),
                endTime: format(parseISO(available.endTime), "HH:mm")
            })),
            volunteerPIs: data.volunteers.map(volunteer => volunteer.value),
            isActive: true,
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

    if (isDirty) {
        if (!loading && !sameData()) {
            (async () => {
                if (!!allFields.schoolCode && allFields.schoolCode !== team.schoolCode) {
                    setSchoolPersonnel([]);
                    setVolunteers([]);
                    updatePersonnel(allFields.schoolCode);
                }
                if (!!allFields.availability && allFields.availability !== team.availability) {
                    updateVolunteers(allFields.availability)
                }
                setTeam({
                    ...team,
                    ...allFields
                });
            })();
        }
    }

    const selectedPersonnel = allFields.schoolPersonnel && allFields.schoolPersonnel !== ""
        ? schoolPersonnel.filter(personnel => personnel._id === allFields.schoolPersonnel)[0]
        : false;

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
                            <Alert severity={response.severity} style={{marginBottom: "1rem"}}>
                                {response.message}
                            </Alert>
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
                            {schoolPersonnel.length > 0 && (
                                <Grid item xs={12}>
                                    <MaterialUIField fieldProps={{
                                        type: 'select',
                                        options: schoolPersonnel.map(personnel => ({
                                            value: personnel._id,
                                            label: personnel.firstName + " " + personnel.lastName
                                        })),
                                        name: 'schoolPersonnel',
                                        defaultValue: '',
                                        label: 'School Personnel',
                                        rules: {
                                            required: true
                                        }
                                    }}/>
                                </Grid>
                            )}
                            {selectedPersonnel && (
                                <Grid container item xs={12} alignItems="center">
                                    {!selectedPersonnel.availability || !selectedPersonnel.availability.length
                                        ? (
                                            <React.Fragment>
                                                <Grid item xs={8}>
                                                    <Typography color="error">
                                                        {selectedPersonnel.firstName} {selectedPersonnel.lastName}
                                                        has not set an availability. If you'd like to continue set one
                                                        now
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={4} style={{textAlign: "right"}}>
                                                    <Button
                                                        type="button"
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => setOpenAvailability(true)}
                                                    >
                                                        Set Availability
                                                    </Button>
                                                </Grid>
                                                <AvailabilityDialog
                                                    onSubmit={(data) => setSchoolPersonnel(schoolPersonnel.map(personnel => {
                                                        if (personnel._id === data.result._id) {
                                                            return data.result;
                                                        }
                                                        return personnel
                                                    }))}
                                                    open={openAvailability}
                                                    close={() => setOpenAvailability(false)}
                                                    userEmail={selectedPersonnel.email}
                                                    endpoint={`${config.uri}${config.endpoints.schoolPersonnels.update}/${selectedPersonnel._id}`}
                                                />
                                            </React.Fragment>
                                        ) : (
                                            <Grid item container xs={12}>
                                                <Grid item xs={12}>
                                                    <Controller
                                                        control={control}
                                                        as={<SelectTimeFrame times={selectedPersonnel.availability}/>}
                                                        name="availability"
                                                        label="Team Schedule"
                                                        rules={{
                                                            validate: (value) => value.length > 0
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )
                                    }
                                    {!!team.availability && !!team.availability.length && !!volunteers.length && (
                                        <Grid item xs={12}>
                                            <Controller
                                                control={control}
                                                as={<TransferList
                                                    times={selectedPersonnel.availability}
                                                    titleLeft="Available Volunteers"
                                                    titleRight="Selected Volunteers"
                                                    available={volunteers.map(volunteer => ({
                                                        value: volunteer.pantherID,
                                                        label: volunteer.firstName + " " + volunteer.lastName
                                                    }))}
                                                />}
                                                rules={{
                                                    validate: (value) => value.length > 0
                                                }}
                                                name="volunteers"
                                                label="Volunteers"
                                            />
                                        </Grid>
                                    )}
                                    {!!team.availability && !!team.availability.length && !loading && !volunteers.length && (
                                        "There are no volunteers"
                                    )}
                                </Grid>
                            )}
                        </Grid>
                    </DialogContent>
                    <DialogActions style={{justifyContent: "center"}}>
                        <Button type="submit" variant="contained" color="primary">Submit</Button>
                    </DialogActions>
                </form>
            </FormProvider>
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
)(TeamDialog);
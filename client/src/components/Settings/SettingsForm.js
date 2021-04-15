import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import {blue, blueGrey} from '@material-ui/core/colors';
import {createMuiTheme, withStyles, ThemeProvider} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import Box from '@material-ui/core/Box';
import {setCurrentSettings} from "../../actions/siteSettingsActions";
import {MaterialUIField} from "../Users/UserFormDialog";
import {FormProvider, useForm} from "react-hook-form";
import config from "../../config";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

const theme = createMuiTheme({
    palette: {
        primary: blue,
    }
});

// Profile Styling
const useStyles = {
    all: {
        height: '100vh'
    },
    card: {
        paddingTop: 100,
        marginTop: theme.spacing(12),
        backgroundColor: 'transparent'
    },
    title: {
        fontSize: 25,
        alignItems: 'right',
        color: 'black'
    },
    form: {
        width: '100%',
    },
    textfield: {
        // boxShadow:'0 0 15px 4px rgba(0,0,0,0.06)'
    },
    Button: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        marginBottom: 10,
        marginTop: 20,

    },
    editButton: {
        backgroundColor: '#72D565',
        color: "white",
        fontSize: "1rem",
        '&:hover': {
            backgroundColor: '#72D565',
        },
        width: "100px",
        height: "40px",
        "&:disabled": {
            backgroundColor: blueGrey[100],
            color: "white",
        }
    },
    saveButton: {
        backgroundColor: '#72D565',
        color: "white",
        fontSize: "1rem",
        '&:hover': {
            backgroundColor: '#72D565',
        },
        width: "100px",
        height: "40px",
        marginRight: "15px",
        "&:disabled": {
            backgroundColor: blueGrey[100],
            color: "white",
        }
    },

};

// Login Styling END

const SettingsForm = (props) => {

    const [disabled, setDisabled] = useState(true);
    const methods = useForm({
        defaultValues: props.siteSettings
    });

    const submit = async (data) => {
        const response = await axios.post(`${config.uri}${config.endpoints.siteSettings.createOrUpdate}`,data);
        props.setCurrentSettings(response.data);
        setDisabled(true);
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={props.classes.all}>
            <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    minWidth="800px"
                    >
                        <Grid item>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(submit)} className={props.classes.form}
                          noValidate>
                        <Box
                            borderRadius="10px"
                            className={props.classes.card}
                            variant="outlined"
                            margin="0 auto"
                        >
                            <CardContent>
                                <Typography className={props.classes.title} color="textSecondary" variant="h2"
                                            gutterBottom>
                                    Site Settings
                                </Typography>
                                <MaterialUIField
                                    fieldProps={
                                        {
                                            type: 'text',
                                            name: 'schoolForm',
                                            label: 'School Form',
                                            disabled: disabled
                                        }}
                                />
                                <MaterialUIField
                                    fieldProps={
                                        {
                                            type: 'text',
                                            name: 'volunteerForm',
                                            label: 'Volunteer Form',
                                            disabled: disabled
                                        }
                                    }
                                />

                            </CardContent>
                            <div className={props.classes.Button}>
                                <CardActions>
                                    <Button
                                        className={props.classes.editButton}
                                        variant="contained"
                                        onClick={() => setDisabled(false)}
                                        size="small"
                                        disabled={!disabled}
                                        >
                                        Edit
                                    </Button>
                                    <Button
                                        className={props.classes.saveButton}
                                        variant="contained"
                                        type="submit"
                                        size="small"
                                        disabled={disabled}
                                        >
                                        Save
                                    </Button>
                                </CardActions>
                            </div>
                        </Box>
                    </form>
                </FormProvider>
                    </Grid>
                </Grid>
            </div>  
        </ThemeProvider>
    );
}

// define types
SettingsForm.propTypes = {
    siteSettings: PropTypes.object.isRequired
};

// allows us to get our state from Redux and map it to props
const mapStateToProps = state => ({
    siteSettings: state.siteSettings
});

export default connect(
    mapStateToProps,
    {setCurrentSettings}
)(withStyles(useStyles)(SettingsForm));

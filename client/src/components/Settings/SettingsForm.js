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

const theme = createMuiTheme({
    palette: {
        primary: blue,
    }
});

// Profile Styling
const useStyles = {
    all: {
        backgroundColor: '#fafafa',
        height: '100vh'
    },
    card: {
        marginTop: theme.spacing(8),
        minWidth: 300,
        maxWidth: 450,
        height: 275,
        backgroundColor: 'white'
    },
    title: {
        fontSize: 16,
        alignItems: 'right',
        fontWeight: 'bold'
    },
    form: {
        width: '100%',
    },
    textfield: {
        // boxShadow:'0 0 15px 4px rgba(0,0,0,0.06)'
    },
    Button: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,

    },
    editButton: {
        backgroundColor: "#57C965",
        color: "white",
        fontWeight: "bold",
        '&:hover': {
            backgroundColor: "#57C965",
        },
        width: "70px",
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
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={props.classes.all}>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(submit)} className={props.classes.form}
                          noValidate>
                        <Box
                            borderRadius="10px"
                            className={props.classes.card}
                            variant="outlined"
                            justify="center">
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
                                        onClick={() => setDisabled(false)}
                                        size="small"
                                        disabled={!disabled}
                                        endIcon={<EditIcon/>}>
                                        Edit
                                    </Button>
                                    <Button
                                        className={props.classes.editButton}
                                        type="submit"
                                        size="small"
                                        disabled={disabled}
                                        endIcon={<SaveIcon/>}>
                                        Save
                                    </Button>
                                </CardActions>
                            </div>
                        </Box>
                    </form>
                </FormProvider>
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

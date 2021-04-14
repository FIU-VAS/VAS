import React, { useState } from "react";
import { FormControl, TextField, Select, InputLabel, MenuItem, Chip, Snackbar } from "@material-ui/core";
import { responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createMuiTheme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import DialogActions from "@material-ui/core/DialogActions";
import AvailabilityForm from "../Extras/AvailabilityForm";

const theme = createMuiTheme({
    palette: {
        primary: green,
    }
})

const useStyles = {
    bottomButtons: {
        backgroundColor: '#57C965',
        color: "white",
        textColor: 'white',
        fontWeight: "bold",
        primaryTextColor: 'white',
        '&:hover': {
            backgroundColor: '#57C965',
        }
    },
}

// @TODO move component to a shared utils folder
export const MuiSelect = React.forwardRef((props, ref) => {
    const { id, label, name, options } = props;
    let { value } = props;

    let extraProps = {};

    if (props.multiple && value === "") {
        value = [];
        extraProps.renderValue = (selected) => (
            <div>
                {selected.map((value) => (
                    <Chip key={value} label={value} />
                ))}
            </div>
        )
    }

    return (
        <FormControl fullWidth={true} style={{ marginBottom: "15px" }} margin="dense">
            <InputLabel id={id}>{label}</InputLabel>
            <Select
                {...props}
                value={value}
                labelId={id}
                name={name}
                ref={ref}
                MenuProps={{
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left"
                    },
                    transformOrigin: {
                        vertical: "top",
                        horizontal: "left"
                    },
                    getContentAnchorEl: null
                }}
                {...extraProps}
            >
                {options.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
});

// @TODO move component to a shared utils folder
export const MaterialUIField = (props) => {
    const { register, control } = useFormContext();
    const { fieldProps } = props;

    switch (fieldProps.type) {
        case "text":
        case "textarea":
        case "email":
        case "tel":
        case "password":
        case "number":
            return (
                <Controller
                    as={TextField}
                    fullWidth={true}
                    style={{ marginBottom: "15px" }}
                    margin="dense"
                    key={fieldProps.name}
                    control={control}
                    inputRef={register}
                    name={fieldProps.name}
                    label={fieldProps.label}
                    defaultValue={fieldProps.defaultValue}
                    type={fieldProps.type}
                    placeholder={fieldProps.placeholder}
                    rules={fieldProps.rules}
                    disabled={fieldProps.disabled}
                    error={fieldProps.error}
                    helperText={fieldProps.errorMessage}
                />
            );
        case "availability":
            return (
                <Controller
                    name={fieldProps.name}
                    inputRef={register}
                    key={fieldProps.name}
                    label={fieldProps.label}
                    defaultValue={fieldProps.defaultValue}
                    type={fieldProps.type}
                    placeholder={fieldProps.placeholder}
                    control={control}
                    as={<AvailabilityForm />}
                    rules={fieldProps.rules}
                    disabled={fieldProps.disabled}
                />
            )
        case "select":
            return (
                <React.Fragment>
                    <Controller
                        as={MuiSelect}
                        key={fieldProps.name}
                        control={control}
                        inputRef={register}
                        id={fieldProps.id}
                        name={fieldProps.name}
                        label={fieldProps.label}
                        defaultValue={fieldProps.defaultValue}
                        options={fieldProps.options}
                        placeholder={fieldProps.placeholder}
                        rules={fieldProps.rules}
                        multiple={fieldProps.multiple}
                        disabled={fieldProps.disabled}
                        error={fieldProps.error}
                        helperText={fieldProps.errorMessage}
                    />
                </React.Fragment>
            );
        default:
            return <Controller key={fieldProps.name} />;
    }
}

export const UserFormDialog = (props) => {
    let [response, setResponse] = useState(null);
    let [success, setSuccess] = useState(false);

    const submitForm = (data) => {
        if (props.submitDataOnly && props.onSubmit) {
            return props.onSubmit(data)
        }

        let response = axios.post(props.endpoint, data)
            .then(res => {
                setResponse(res);
                setSuccess(res.data.success);
            })
            .catch(err => {
                setResponse(err);
                setSuccess(false);
            })

        if (props.onSubmit) {
            props.onSubmit(response);
        }
    }

    const defaultValues = {};
    props.formProps.forEach(prop => {
        defaultValues[prop.name] = prop.value !== "" ? prop.value : prop.defaultValue;
    })

    const methods = useForm({
        defaultValues: defaultValues
    });

    const { handleSubmit } = methods;

    const getFormFields = () => {
        return props.formProps.map(properties => {
            if (!properties.wrapper || !properties.wrapper.component) {
                return (<MaterialUIField fieldProps={properties} />)
            } else {
                let Component = properties.wrapper.component;
                return (
                    <Component {...properties.wrapper.props}>
                        <MaterialUIField fieldProps={properties} />
                    </Component>
                )
            }
        }
        )
    }

    const FormWrapper = !props.formWrapper ? null : props.formWrapper;
    const formWrapperProps = props.formWrapperProps || {};

    return (
        <ThemeProvider theme={theme}>
            <Dialog open={props.open} maxWidth="sm">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit((data, event) => {
                        submitForm(data, props.role, props.edit, props.userId);
                    })}><DialogTitle>
                            <Box display="flex" alignItems="center">
                                <Box flexGrow={1}>{props.title}</Box>
                                <Box>
                                    <IconButton onClick={props.close}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            {response &&
                                <Snackbar
                                    open={true}
                                    onClose={() => setResponse(null)}
                                    autoHideDuration={2000}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                >
                                    {success ?
                                    <Alert severity="success" style={{ marginBottom: "1rem" }}>
                                        {response.data.message}
                                    </Alert>
                                    : 
                                    <Alert severity="error" style={{ marginBottom: "1rem" }}>
                                        {response.response && response.response.data.message ? response.response.data.message :
                                        response.response && response.response.data.errors ? `${response.response.data.errors[0].param} error: ${response.response.data.errors[0].msg}` :
                                        response.data ? response.data.message :
                                        response.message}
                                    </Alert>
                                    }
                                </Snackbar>
                            }
                            <DialogContentText>
                                {props.description}
                            </DialogContentText>
                            {FormWrapper ? (
                                <FormWrapper {...formWrapperProps}>
                                    {getFormFields()}
                                </FormWrapper>
                            ) : getFormFields()}
                        </DialogContent>
                        <DialogActions>
                            <Button className={useStyles.bottomButtons} onClick={props.close} variant="contained"
                                style={{ 'backgroundColor': '#57C965', 'color': 'white', 'fontWeigth': 'bold' }}>Cancel</Button>
                            <Button className={useStyles.bottomButtons} type="submit" variant="contained"
                                style={{ 'backgroundColor': '#57C965', 'color': 'white', 'fontWeigth': 'bold' }}>Submit</Button>
                        </DialogActions>
                    </form>
                </FormProvider>
            </Dialog>
        </ThemeProvider>
    )
}

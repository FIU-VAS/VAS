import React, {useState} from "react";
import {FormControl, makeStyles, TextField, Select, InputLabel, MenuItem} from "@material-ui/core";
import {ThemeProvider} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {createMuiTheme} from '@material-ui/core/styles';
import {blueGrey, blue} from '@material-ui/core/colors';
import {useForm, FormProvider, useFormContext, Controller} from "react-hook-form";
import axios from "axios";
import Alert from '@material-ui/lab/Alert';

const theme = createMuiTheme({
    palette: {
        primary: blue,
    }
})

const useStyles = {
    bottomButtons: {
        backgroundColor: blueGrey[700],
        color: "white",
        fontWeight: "bold",
        '&:hover': {
            backgroundColor: blue[500],
        }
    },
}

const MuiSelect = (props) => {
    const {id, label, name, options} = props;

    return (
        <FormControl fullWidth={true} style={{marginBottom: "15px"}} margin="dense">
            <InputLabel id={id}>{label}</InputLabel>
            <Select
                {...props}
                labelId={id}
                name={name}
            >
                {options.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

const MaterialUIField = (props) => {
    const {register, control} = useFormContext();
    const {fieldProps} = props;

    switch (fieldProps.type) {
        case "text":
        case "textarea":
        case "email":
        case "tel":
        case "password":
            return (
                <Controller
                    as={TextField}
                    fullWidth={true}
                    style={{marginBottom: "15px"}}
                    margin="dense"
                    key={fieldProps.name}
                    control={control}
                    inputRef={register}
                    name={fieldProps.name}
                    label={fieldProps.label}
                    defaultValue={fieldProps.defaultValue}
                    type={fieldProps.type}
                />
            );
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
                    />
                </React.Fragment>
            );
        default:
            return <Controller key={fieldProps.name}/>;
    }
}

export const UserFormDialog = (props) => {
    let [message, setMessage] = useState("");
    let [success, setSuccess] = useState(false);

    const submitForm = (data) => {
        let response = axios.post(props.endpoint, data)
        .then(res => {
            setMessage(res.data.message);
            setSuccess(true);
        })
        .catch(err => {
            setMessage(err.message);
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

    const {register, handleSubmit, watch, errors} = methods;

    return (
        <ThemeProvider theme={theme}>
            <Dialog open={props.open} maxWidth="sm">
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>{props.edit ? `Edit ${props.role}` : `Create ${props.role}`}</Box>
                        <Box>
                            <IconButton onClick={props.close}>
                                <CloseIcon/>
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>  
                {message !== "" && <Alert severity={success ? "success" : "error"}>{message}</Alert>}
                <DialogContent>
                    <DialogContentText>
                        {props.edit ? `To edit a  ${props.role}, modify the following form and click SUBMIT` : `To create a ${props.role}, fill out the following form and click SUBMIT`}
                    </DialogContentText>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit((data, event) => {
                            submitForm(data, props.role, props.edit, props.userId);
                        })}>
                            {props.formProps.map(properties => {
                                if (!properties.wrapper || !properties.wrapper.component) {
                                    return (<MaterialUIField fieldProps={properties}/>)
                                } else {
                                    let Component = properties.wrapper.component;
                                    return (
                                        <Component {...properties.wrapper.props}>
                                            <MaterialUIField fieldProps={properties}/>
                                        </Component>
                                    )
                                }
                            })}
                            <Button className={useStyles.bottomButtons} onClick={props.close} variant="contained"
                                    color="primary">Cancel</Button>
                            <Button className={useStyles.bottomButtons} type="submit" variant="contained"
                                    color="primary">Submit</Button>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    )
}

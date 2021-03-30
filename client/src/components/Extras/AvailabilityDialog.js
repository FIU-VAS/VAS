import React, {useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography
} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import {Alert} from "@material-ui/lab";
import {useForm, Controller} from "react-hook-form";
import axios from "axios";

import AvailabilityForm, {validateAvailability} from "./AvailabilityForm";


export const AvailabilityDialog = (props) => {

    const {endpoint, open, close, onSubmit, userEmail} = props;

    const {handleSubmit, control, errors} = useForm();
    const [response, setResponse] = useState(null)

    const submitForm = async (data) => {
        try {
            const response = await axios.post(endpoint, {
                availability: data.availability,
                email: userEmail
            });
            if (response.data.success) {
                setResponse({
                    severity: "success",
                    message: "User updated successfully"
                })
                if (onSubmit) {
                    onSubmit(response.data);
                }
            }
        } catch (error) {
            setResponse({
                severity: "error",
                message: error.response ? error.response.statusText : error.toString()
            })
        }
    }

    return (
        <Dialog open={open} onClose={close} maxWidth="md" fullWidth={true}>
            <form onSubmit={handleSubmit(submitForm)} style={{width: "100%"}}>
                <DialogTitle>
                    <Grid container alignItems="center">
                        <Grid item xs={8}>
                            Set Availability
                        </Grid>
                        <Grid item xs={4} style={{textAlign: "right"}}>
                            <IconButton onClick={close}>
                                <Close/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    {response && (
                        <Alert severity={response.severity} style={{marginBottom: "1rem"}}>
                            {response.message}
                        </Alert>
                    )}
                    <Controller
                        control={control}
                        as={<AvailabilityForm/>}
                        name="availability"
                        label=""
                        rules={{
                            required: true,
                            validate: validateAvailability,
                        }}
                    />
                    {"availability" in errors && Object.keys(errors.availability).length && (
                        <Typography variant="subtitle2" color="error">
                            Invalid time slot
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions style={{justifyContent: "flex-start", paddingLeft: "1.5rem"}}>
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

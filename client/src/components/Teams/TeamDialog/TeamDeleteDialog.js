import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton
} from "@material-ui/core";
import React, {useState} from "react";
import {useForm, FormProvider} from "react-hook-form";
import axios from "axios";
import config from "../../../config";
import {MaterialUIField} from "../../Users/UserFormDialog";
import Box from '@material-ui/core/Box'
import CloseIcon from '@material-ui/icons/Close';
import {connect} from "react-redux";
import {updateCurrentTeams} from "../../../actions/teamActions";

const TeamDeleteDialogComponent = (props) => {
    const {open, close, onSubmit, deleteTeam, message} = props;

    const methods = useForm({
        defaultValues: {
            closureNotes: ""
        }
    });
    const [loading, setLoading] = useState(false)

    const submit = async (data) => {
        try {
            setLoading(true);
            const response = await axios.post(`${config.uri}${config.endpoints.team.delete}/${deleteTeam._id}`, {
                closureNotes: data.closureNotes
            });
            onSubmit(response.data);
            props.updateCurrentTeams(response.data.team);
            close()
        } catch (apiError) {
        }
        setLoading(false);
    }

    return (
        <Dialog
            open={open}
            onClose={close}
        >
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(submit)}>
                    <DialogTitle  style={{padding: "0rem 1rem", borderBottom: "none"}}>
                    <Box display="flex" alignItems="center">
                            <Box flexGrow={1}>Make Team Inactive</Box>
                            <Box>
                                <IconButton onClick={close}>
                                    <CloseIcon/>
                                </IconButton>
                            </Box>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {message}
                        </DialogContentText>
                        <MaterialUIField
                            fieldProps={{
                                type: "textarea",
                                name: "closureNotes",
                                label: "Closure Notes"
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" variant="contained" color="primary">
                            Delete
                        </Button>
                        <Button onClick={close} variant="contained" color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </FormProvider>
        </Dialog>
    )
}

export const TeamDeleteDialog = connect(
    null,
    {updateCurrentTeams}
)(TeamDeleteDialogComponent);
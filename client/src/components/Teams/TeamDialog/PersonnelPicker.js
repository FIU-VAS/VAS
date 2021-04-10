import React from "react";
import {Button, Grid, Typography} from "@material-ui/core";
import {Controller, useFormContext} from "react-hook-form";
import {SelectTimeFrame} from "../../Extras/SelectTimeFrame";
import PropTypes from "prop-types";


export const PersonnelPicker = (props) => {

    const {selectedPersonnel, onEditPersonnel} = props;

    const {control} = useFormContext();

    return selectedPersonnel.map((personnel, index) => {
        return (
            <Grid key={`personnel-availability-${index}`} container spacing={2}>
                {!personnel.availability || !personnel.availability.length ?
                    (
                        <React.Fragment>
                            <Grid key={personnel.email} item xs={8}>
                                <Typography color="error">
                                    {personnel.firstName} {personnel.lastName} has
                                    not set an availability. If you'd like to continue set one now
                                </Typography>
                            </Grid>
                            <Grid item xs={4} style={{textAlign: "right"}}>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => onEditPersonnel(personnel)}
                                    style={{'color':'black', 'borderColor':'red'}}
                                >
                                    Set Availability
                                </Button>
                            </Grid>
                        </React.Fragment>
                    )
                    : (
                        <Grid key={personnel.email} item container xs={12}>
                            <Grid item xs={12}>
                                <Controller
                                    control={control}
                                    as={<SelectTimeFrame
                                        times={personnel.availability}/>}
                                    name="availability"
                                    label="Team Schedule"
                                    rules={{
                                        validate: (value) => value.length > 0
                                    }}
                                />
                            </Grid>
                        </Grid>
                    )}
            </Grid>
        )
    })
}

PersonnelPicker.propTypes = {
    selectedPersonnel: PropTypes.array.isRequired,
    onEditPersonnel: PropTypes.func.isRequired,
}
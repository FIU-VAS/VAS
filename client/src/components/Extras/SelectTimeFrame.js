import React, {useState} from "react";
import {Button, Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {format, parseISO, isValid, isDate} from "date-fns";

export const SelectTimeFrame = React.forwardRef((props, ref) => {
    const {times, onChange, label} = props;

    const [selected, setSelected] = useState([]);


    const addTime = (id) => {
        let newSelected;
        if (isSelected(id)) {
            newSelected = selected.filter(time => time._id !== id);
        } else {
            newSelected = [...selected, times.filter(time => time._id === id)[0]];
        }
        setSelected(
            newSelected
        );
        if (!newSelected.length) {
            newSelected = "";
        }
        onChange(newSelected);
    }

    const isSelected = (id) => {
        return selected.find(time => time._id === id);
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6" style={{fontSize: "1rem"}}>
                    {label}
                </Typography>
            </Grid>
            {times.map((time, index) => {
                let startTime = isDate(time.startTime) && isValid(time.startTime) ? time.startTime : parseISO(time.startTime);
                let endTime = isDate(time.endTime) && isValid(time.endTime) ? time.endTime : parseISO(time.endTime);
                return (
                    <Grid key={index} item xs={4}>
                        <Button
                            style={{marginTop: "0.5rem"}}
                            onClick={() => addTime(time._id)}
                            variant={isSelected(time._id) ? "contained" : "outlined"}
                            color={isSelected(time._id) ? "primary" : "default"}
                        >
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" align="center" style={{textTransform: "capitalize"}}>
                                        {time.dayOfWeek}
                                    </Typography>
                                    <Typography align="center" variant="caption" style={{display: "block"}}>
                                        {format(startTime, "h:mm aa")} - {format(endTime, "h:mm aa")}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                )
            })}
        </Grid>
    )
})
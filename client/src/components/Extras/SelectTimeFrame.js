import React, {useState} from "react";
import {Button, Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {format, isEqual} from "date-fns";
import {fromUTC} from "../../utils/availability";

export const SelectTimeFrame = React.forwardRef((props, ref) => {
    // @TODO warn on different timeframes selected

    const {onChange, label} = props;

    const [selected, setSelected] = useState(props.value || []);

    const times = fromUTC(props.times);

    const addTime = (candidate) => {
        let newSelected;
        if (isSelected(candidate)) {
            newSelected = selected.filter(time => time._id !== candidate._id);
        } else {
            newSelected = [...selected, times.filter(time => time._id === candidate._id)[0]];
        }
        setSelected(
            newSelected
        );
        if (!newSelected.length) {
            newSelected = "";
        }
        onChange(newSelected);
    }

    const isSelected = (candidate) => {
        return selected.find(
            time => {
                return time.dayOfWeek === candidate.dayOfWeek
                && isEqual(time.startTime, candidate.startTime)
                && isEqual(time.endTime, candidate.endTime)
            }
        );
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6" style={{fontSize: "1rem"}}>
                    {label}
                </Typography>
            </Grid>
            {times.map((time, index) => {
                return (
                    <Grid key={index} item xs={4}>
                        <Button
                            style={{marginTop: "0.5rem"}}
                            onClick={() => addTime(time)}
                            variant={isSelected(time) ? "contained" : "outlined"}
                            color={isSelected(time) ? "primary" : "default"}
                        >
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" align="center" style={{textTransform: "capitalize"}}>
                                        {time.dayOfWeek}
                                    </Typography>
                                    <Typography align="center" variant="caption" style={{display: "block"}}>
                                        {format(time.startTime, "h:mm aa")} - {format(time.endTime, "h:mm aa")}
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
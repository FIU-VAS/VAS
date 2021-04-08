import {parseISO, isDate, format} from "date-fns";

export const fromUTC = (availability) => {

    return availability.map(value => {
        let {startTime, endTime} = value;
        startTime = typeof value.startTime === "string" ? parseISO(startTime) : startTime;
        endTime = typeof value.endTime === "string" ? parseISO(endTime) : endTime;
        return {
            ...value,
            startTime,
            endTime
        }
    })
}


export const toTimeSlot = (availability) => {
    return availability.map(value => {
        let {startTime, endTime} = value;
        if (!isDate(startTime)) {
            startTime = typeof value.startTime === "string" ? parseISO(startTime) : startTime;
        }
        if (!isDate(endTime)) {
            endTime = typeof value.endTime === "string" ? parseISO(endTime) : endTime;
        }
        startTime = format(startTime, "HH:mm");
        endTime = format(endTime, "HH:mm");
        return {
            ...value,
            startTime,
            endTime
        }
    })
}
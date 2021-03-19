import {addMinutes} from "date-fns";

export const REFERENCE_DATE = new Date(2000, 0, 3);

export const generateTimeSlots = (startTime, endTime) => {
    const slots = []

    while (startTime < endTime) {
        let start, end;
        slots.push(startTime);
        startTime = addMinutes(startTime, 60);
    }

    return slots
}
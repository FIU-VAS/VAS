import {parseISO} from "date-fns";

export const REFERENCE_DATE = new Date(2000, 0, 3);

export const parseAvailabilityISO = (availability) => {
    return [
        typeof availability.startTime === "string" ? parseISO(availability.startTime) : availability.startTime,
        typeof availability.endTime === "string" ? parseISO(availability.endTime) : availability.endTime,
    ]
}
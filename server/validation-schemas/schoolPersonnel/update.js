import {Days, validateTimeDate, REFERENCE_DATE} from "../../models/Teams/team";
import {parse} from "date-fns";

const validateAvailability = (values) => {
    return values.every(value => {
        value.dayOfWeek.toUpperCase() in Days
        && validateTimeDate(value.startTime)
        && validateTimeDate(value.endTime);
    })
}

export const schema = {
    email: {
        optional: {
            nullable: true,
            checkFalsy: true
        },
        isEmail: true
    },
    phoneNumber: {
        optional: {
            nullable: true,
            checkFalsy: true
        },
        isMobilePhone: {
            errorMessage: "Invalid phone number",
        },
    },
    availability: {
        custom: {
            options: (value) => {
                const date = parse(value, "HH:mm", REFERENCE_DATE);
                return validateAvailability(date);
            },
            errorMessage: "Invalid availability configuration"
        }
    },
}
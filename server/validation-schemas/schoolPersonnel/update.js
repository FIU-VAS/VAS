import {Days, validateTimeDate} from "../../models/Teams/team";

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
    // availability: {
    //     custom: {
    //         options: (value) => {
    //             return validateAvailability(value)
    //         },
    //         errorMessage: "Invalid availability configuration"
    //     }
    // },
}
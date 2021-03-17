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
        isEmail: true
    },
    firstName: {
        exists: {
            errorMessage: "First Name is required"
        }
    },
    lastName: {
        exists: {
            errorMessage: "Last Name is required"
        }
    },
    phoneNumber: {
        exists: {
            errorMessage: "Phone Number is required"
        },
        isMobilePhone: {
            errorMessage: "Invalid phone number"
        }
    },
    pantherID: {
        isNumeric: true,
        isLength: {
            options: {
                min: 7,
                max: 7
            }
        }
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
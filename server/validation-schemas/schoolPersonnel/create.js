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
    title: {
        exists: {
            errorMessage: "Title is required"
        }
    },
    isActive: {
        exists: {
            errorMessage: "Is Active is required"
        }
    },
    schoolCode: {
        exists: {
            errorMessage: "A school code is required"
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
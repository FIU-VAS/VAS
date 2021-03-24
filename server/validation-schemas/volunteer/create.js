import {validateAvailability} from "../../models/Teams/team";

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
    availability: {
        custom: {
            options: (value) => {
                return validateAvailability(value);
            },
            errorMessage: "Invalid availability configuration"
        }
    }
}
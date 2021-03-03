import {schema as userValidation} from "../common/user";
import {Days} from "../../models/Teams/team";

export const schema = {
    ...userValidation,
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
    availability: [{
        dayOfWeek: {
            type: String,
            enum: Object.values(Days),
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    }],
}
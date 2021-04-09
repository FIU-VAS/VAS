import {sanitizeAvailability, validateAvailability} from "../../models/Teams/team";

export const schema = {
    semester: {
        exists: true,
            errorMessage: "Term must be defined"
    },
    year: {
        isNumeric: true,
            isLength: {
            options: {
                min: 4,
                    max: 4
            },
        },
        errorMessage: "Year must be a number of 4 digits"
    },
    availability: {
        custom: {
            options: (value) => {
                return validateAvailability(value);
            },
            errorMessage: "Invalid availability configuration"
        },
        customSanitizer: {
            options: (value) => {
                return sanitizeAvailability(value)
            }
        }
    }
}
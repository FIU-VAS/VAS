import {sanitizeAvailability, validateAvailability} from "../../models/Teams/team";


export const schema = {
    availability: {
        optional: {
            nullable: true,
            checkFalsy: true
        },
        custom: {
            options: (values) => {
                values = values.map(value => JSON.parse(value))
                return validateAvailability(values);
            },
            errorMessage: "Invalid availability configuration"
        },
        customSanitizer: {
            options: (values) => {
                values = values.map(value => JSON.parse(value))
                return sanitizeAvailability(values)
            }
        }
    },
    semester: {
        optional: {
            nullable: true,
            checkFalsy: true
        },
        isAlpha: true
    },
    year: {
        optional: {
            nullable: true,
            checkFalsy: true
        },
        isAlphanumeric: true,
        isLength: {
            min: 4,
            max: 4
        }
    }
}
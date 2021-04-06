import {sanitizeAvailability, validateAvailability} from "../../models/Teams/team";

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
    pantherID: {
        optional: {
            nullable: true,
            checkFalsy: true
        },
        isNumeric: {
            errorMessage: "Panther ID should only have numbers",
        },
        isLength: {
            errorMessage: "Panther ID should have 7 digits",
            options: [
                {
                    min: 7,
                    max: 7,
                },
                {
                    checkFalsy: true
                }
            ]
        },
    },
    availability: {
        optional: {
            nullable: true,
            checkFalsy: true
        },
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
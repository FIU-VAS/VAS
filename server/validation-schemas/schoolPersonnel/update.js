import {validateAvailability, sanitizeAvailability} from "../../models/Teams/team";

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
        optional: {
            nullable: true,
            checkFalsy: true
        },
        custom: {
            options: (value) => {
                if (!value) return false;
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
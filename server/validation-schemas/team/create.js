import {Days, sanitizeAvailability, validateAvailability} from "../../models/Teams/team";
import School from "../../models/Schools/school";

const semesters = ['Fall', 'Spring', 'Summer'];

export const schema = {
    schoolCode: {
        custom: {
            options: async (value) => {
                const codes = await School.find({}, "schoolCode");
                return codes.map(x => x.schoolCode).indexOf(value) !== -1
            }
        },
        errorMessage: 'School code has not been registered',
    },
    semester: {
        custom: {
            options: (value) => semesters.indexOf(value) !== -1
        },
        errorMessage: 'Invalid school semester',
    },
    year: {
        isNumeric: {
            errorMessage: 'Invalid year',
        },
        isLength: {
            errorMessage: 'Invalid year',
            options: {
                max: 4,
                min: 4
            }
        }
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
    },
    volunteerPIs: {
        isArray: true,
        exists: true,
    },
    isActive: {
        optional: {
            checkFalsy: true
        },
        isBoolean: true,
    },
    timeStamp: {
        optional: {
            nullable: true,
            checkFalsy: true
        },
        isBoolean: true,
        isNumeric: true,
    },
    closureNotes: {
        optional: {
            nullable: true,
            checkFalsy: true
        },
        isBoolean: true,
        isAlphanumeric: true
    }
}

const mongoose = require('mongoose');
import {addDays, isDate, addHours, parse} from "date-fns";
import {zonedTimeToUtc, getTimezoneOffset} from "date-fns-tz"

export const Days = {
    MONDAY: 'monday',
    TUESDAY: 'tuesday',
    WEDNESDAY: 'wednesday',
    THURSDAY: 'thursday',
    FRIDAY: 'friday',
};

// First monday of 2000
function createDateAsUTC(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}
export const REFERENCE_DATE = createDateAsUTC();

export const validateTimeDate = (value) => {
    return isDate(value) && value.getFullYear() === 2000 && (value.getDate() >= 3 && value.getDate() <= 7)
    && value.getMonth() === 0 && (value.getDay() >= 1 && value.getDay() <= 6)
}

export const validateAvailability = (values) => {
    return values.every(value => {
        return value.dayOfWeek.toUpperCase() in Days
            && validateTimeDate(parse(value.startTime, "HH:mm", REFERENCE_DATE))
            && validateTimeDate(parse(value.endTime, "HH:mm", REFERENCE_DATE));
    })
}

export const sanitizeAvailability = (value) => {
    return value.map(available => {
        let startTime = addDays(parse(available.startTime, "HH:mm", REFERENCE_DATE), Object.values(Days).indexOf(available.dayOfWeek));
        let endTime = addDays(parse(available.endTime, "HH:mm", REFERENCE_DATE), Object.values(Days).indexOf(available.dayOfWeek));

        startTime = zonedTimeToUtc(startTime, 'America/New_York');
        endTime = zonedTimeToUtc(endTime, 'America/New_York');

        return {
            ...available,
            startTime,
            endTime
        }
    })
}

const Team = new mongoose.Schema({
    schoolCode: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true
    },
    schoolPersonnel: {
        type: Array,
        required: true
    },
    availability: [{
        dayOfWeek: {
            type: String,
            enum: Object.values(Days)
        },
        startTime: {
            type: Date,
            validate: {
                validator: validateTimeDate,
                message: "Invalid value for time"
            }
        },
        endTime: {
            type: Date,
            validate: {
                validator: validateTimeDate,
                message: "Invalid value for time"
            }
        }
    }],
    volunteerPIs: {
        type: Array,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    timeStamp: {
        type: Number,
        default: 0
    },
    closureNotes: {
        type: String,
        default: ''
    }
});

let model = mongoose.model('team', Team);
module.exports = model;
export default model;
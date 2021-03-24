const mongoose = require('mongoose');
import {startOfDay, isDate, format, parse} from "date-fns";

export const Days = {
    MONDAY: 'monday',
    TUESDAY: 'tuesday',
    WEDNESDAY: 'wednesday',
    THURSDAY: 'thursday',
    FRIDAY: 'friday',
};

// First monday of 2000
export const REFERENCE_DATE = new Date(2000, 0, 3);

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
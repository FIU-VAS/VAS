const mongoose = require('mongoose')

export const Days = {
    MONDAY: 'monday',
    TUESDAY: 'tuesday',
    WEDNESDAY: 'wednesday',
    THURSDAY: 'thursday',
    FRIDAY: 'friday',
};


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
            enum: Array.values(Days)
        },
        startTime: {
            type: String
        },
        endTime: {
            type: String
        }
    }],
    dayOfWeek: {
        monday: {
            type: Boolean,
            required: true,
            default: false
        },
        tuesday: {
            type: Boolean,
            default: false
        },
        wednesday: {
            type: Boolean,
            default: false
        },
        thursday: {
            type: Boolean,
            default: false
        },
        friday: {
            type: Boolean,
            default: false
        }
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true,
    },
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
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// export const Days = {
//     MONDAY: 'monday',
//     TUESDAY: 'tuesday',
//     WEDNESDAY: 'wednesday',
//     THURSDAY: 'thursday',
//     FRIDAY: 'friday',
// };


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
    dayOfWeek: {
        type: [String],
        enum: Object.values(Days),
        required: true
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

module.exports = mongoose.model('team', Team);
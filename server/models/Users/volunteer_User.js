import {Days, validateTimeDate} from "../Teams/team";

const mongoose = require('mongoose')
import User from "./user_Auth"

const VolunteerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    pantherID: {
        type: String,
        required: true
    },
    major: {
        type: String,
        default: ''
    },
    carAvailable: {
        type: Boolean,
        default: false
    },
    volunteerStatus: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    MDCPS_ID: {
        type: String,
        default: ''
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
}, { discriminatorKey: 'role' });

const Volunteer = User.discriminator('volunteer', VolunteerSchema);
export default mongoose.model('volunteer')
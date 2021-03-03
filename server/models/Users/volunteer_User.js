import {Days} from "../Teams/team";

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
        type: Number,
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
            enum: Object.values(Days),
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    }],
}, { discriminatorKey: 'role' });

const Volunteer = User.discriminator('Volunteer', VolunteerSchema);
export default mongoose.model('Volunteer')
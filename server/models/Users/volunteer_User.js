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
    }
});

const Volunteer = User.discriminator('Volunteer', VolunteerSchema, 'volunteer');
export default mongoose.model('Volunteer')
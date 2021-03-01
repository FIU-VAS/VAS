import User, {UserRoles} from "./user_Auth"
import {Days} from "../Teams/team";

const mongoose = require('mongoose')

const SchoolPersonnelSchema = new mongoose.Schema({
    schoolCode: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    availability: [{
        dayOfWeek: {
            type: String,
            enum: Object.values(Days)
        },
        startTime: {
            type: String
        },
        endTime: {
            type: String
        }
    }],
});

const SchoolPersonnel = User.discriminator('SchoolPersonnel', SchoolPersonnelSchema, {discriminatorKey: UserRoles.SchoolPersonnel});
export default mongoose.model('SchoolPersonnel')

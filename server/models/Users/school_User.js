import User, {UserRoles} from "./user_Auth"
import {Days, validateTimeDate} from "../Teams/team";

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
});

const SchoolPersonnel = User.discriminator('SchoolPersonnel', SchoolPersonnelSchema, {discriminatorKey: "role"});
export default mongoose.model('SchoolPersonnel')

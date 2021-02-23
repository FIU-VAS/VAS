const mongoose = require('mongoose')
import User from "./user_Auth"

const SchoolPersonnelSchema = new mongoose.Schema({
    schoolCode: {
        type: String,
        required: true
    },
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
    title: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
});

const SchoolPersonnel = User.discriminator('SchoolPersonnel', SchoolPersonnelSchema, 'schoolPersonnel');
export default mongoose.model('SchoolPersonnel')
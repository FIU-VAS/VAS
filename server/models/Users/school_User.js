const mongoose = require('mongoose')
import User from "./user_Auth"

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
});

const SchoolPersonnel = User.discriminator('SchoolPersonnel', SchoolPersonnelSchema, 'schoolPersonnel');
export default mongoose.model('SchoolPersonnel')
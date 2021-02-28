import User, {UserRoles} from "./user_Auth"

const mongoose = require('mongoose')

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

const SchoolPersonnel = User.discriminator('SchoolPersonnel', SchoolPersonnelSchema, {discriminatorKey: UserRoles.SchoolPersonnel});
export default mongoose.model('SchoolPersonnel')

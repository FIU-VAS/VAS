const mongoose = require('mongoose')
import User from "./user_Auth"

const AdminSchema = new mongoose.Schema({
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
    isActive: {
        type: Boolean,
        default: true
    },
    schoolForm:{
        type: String,
        default: ''
    },
    volunteerForm:{
        type: String,
        default: ''
    }
}, { discriminatorKey: 'role' });

const Admin = User.discriminator('admin', AdminSchema);
export default mongoose.model('admin')

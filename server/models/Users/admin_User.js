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
});

const Admin = User.discriminator('Admin', AdminSchema, { discriminatorKey: 'role' });
export default mongoose.model('Admin')
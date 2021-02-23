const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

export const UserRoles = Object.freeze({
    Admin: 'admin',
    Volunteer: 'volunteer',
    SchoolPersonnel: 'schoolPersonnel'
})

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required for new user'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required for new user']
    },
    role: {
        type: String,
        required: [true, 'Role is required for new user'],
        enum: Object.values(UserRoles)
    },
    token: {
        type: String
    }
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('User', UserSchema);
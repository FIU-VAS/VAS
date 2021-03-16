import validator from 'validator';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
import {isBefore} from 'date-fns';

export const UserRoles = Object.freeze({
    Admin: 'admin',
    Volunteer: 'volunteer',
    SchoolPersonnel: 'schoolPersonnel'
})

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required for new user'],
        unique: true,
        validator: validator.isEmail
    },
    password: {
        type: String,
        required: [true, 'Password is required for new user']
    },
    token: {
        type: String
    },
    resetPassword: {
        token: {
            type: String
        },
        expire: {
            type: Date
        }
    }
}, {discriminatorKey: "role"});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.statics.generateHashAsync = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 8, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.validResetToken = function (token) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(token, this.resetPassword.token, (err, result) => {
            if (err) reject(err);
            resolve(result && isBefore(new Date(), this.resetPassword.expire));
        })
    })
}

UserSchema.statics.generateResetToken = function () {
    return new Promise((resolve, reject) => {
        let token = crypto.randomBytes(32).toString('hex')
        bcrypt.hash(token, 10, (err, hash) => {
            if (err) {
                reject(err);
            }
            resolve([hash, token]);
        })
    })
}

export default mongoose.model('User', UserSchema);
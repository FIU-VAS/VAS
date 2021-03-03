const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const School = new mongoose.Schema({
    schoolName: {
        type: String,
        required: true,
    },
    schoolCode: {
        type: String,
        required: true
    },
    level: { //Elem, K-8, etc.
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
});

module.exports = mongoose.model('school', School);
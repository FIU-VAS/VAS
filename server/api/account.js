import express from 'express';

import User from '../models/Users/user_Auth';
import Admin from '../models/Users/admin_User';
import Volunteer from '../models/Users/volunteer_User';
import schPersonnel from '../models/Users/school_User';


// input validation
import validateCreateVolunteerInput from '../validation/volunteers/createVolunteer';
import validateCreateSchoolPersonnelInput from '../validation/schoolPersonnels/createSchoolPersonnel';
import validateCreateAdminInput from '../validation/admin/createAdmin';


import passport from "../config/passport"

const router = new express.Router();

router.post('/admin/signup', adminSignUp);
router.post('/volunteer/signup', volunteerSignUp);
router.post('/school-personnel/signup', schoolPersonnelSignUp);
router.post('/login', passport.authenticate('local', {session: false}, null), login);

function adminSignUp (req, res) {
    const { body } = req;
    const {
        firstName,
        lastName,
        password,
        phoneNumber,
        } = body;
        let {
            email
        } = body;

        // Form validation
	const { errors, isValid } = validateCreateAdminInput(req.body);

	// Check validation
	if (!isValid) {
		return res.status(400).json({success: false, errors});
	}

    email = email.toLowerCase();

    // Steps:
    // 1. Verify email doesn't exist
    // 2. Save to collection
    User.find({
        email: email
    }, (err, previousUsers) => {
        if (err) {
            return res.send({
                success: false,
                message: "Error: Server error."
            });
        } else if (previousUsers.length > 0) {
            return res.send({
                success: false,
                message: 'Error: Account already exists.'
            });
        }

        // Save new user to admin collection
        const newAdmin = new Admin();

        newAdmin.firstName = firstName;
        newAdmin.lastName = lastName;
        newAdmin.email = email;
        newAdmin.phoneNumber = phoneNumber;
        newAdmin.isActive = true;
        newAdmin.password = newAdmin.generateHash(password);
        newAdmin.role = 'admin'

        newAdmin.save((err, admin) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error.'
                });
            }
            return res.send({
                success: true,
                message: 'Successfully created administrator!'
            });
        });
    });
}

function volunteerSignUp (req, res) {
    const { body } = req;
    const {
        firstName,
        lastName,
        password,
        phoneNumber,
        pantherID,
        major,
        isActive,
        carAvailable,
        volunteerStatus,
        MDCPS_ID
        } = body;
        let {
            email
        } = body;

    // Form validation
	const { errors, isValid } = validateCreateVolunteerInput(req.body);

	// Check validation
	if (!isValid) {
		return res.status(400).json({success: false, errors});
	}

    email = email.toLowerCase();

    // Steps:
    // 1. Verify email doesn't exist
    // 2. Save to collection
    User.find({
        email: email
    }, (err, previousUsers) => {
        if (err) {
            return res.send({
                success: false,
                errors: {server: 'Server errors'}
            });
        } else if (previousUsers.length > 0) {
            return res.send({
                success: false,
                errors: {email: 'Account already exists'}
            });
        }

        // Save new user to volunteer collection
        const newVolunteer = new Volunteer();

        newVolunteer.firstName = firstName;
        newVolunteer.lastName = lastName;
        newVolunteer.email = email;
        newVolunteer.phoneNumber = phoneNumber;
        newVolunteer.pantherID = pantherID;
        newVolunteer.major = major;
        newVolunteer.carAvailable = carAvailable;
        newVolunteer.volunteerStatus = volunteerStatus;
        newVolunteer.isActive = true;
        newVolunteer.MDCPS_ID = MDCPS_ID;
        newVolunteer.password = newVolunteer.generateHash(password);
        newVolunteer.role = 'volunteer'

        newVolunteer.save((err, volunteer) => {
            if (err) {
                return res.send({
                    success: false,
                    errors: err
                });
            }
            return res.send({
                success: true,
                message: 'Successfully created volunteer!'
            });
        });
    });
}

function schoolPersonnelSignUp (req, res) {
    const { body } = req;
    const {
        schoolCode,
        firstName,
        lastName,
        password,
        title,
        phoneNumber,
        } = body;
        let {
            email
        } = body;

    // form validation
    const { errors, isValid } = validateCreateSchoolPersonnelInput(req.body);
    // check validation
    if (!isValid) {
        return res.status(400).json({success: false, errors});
    }

    email = email.toLowerCase();

    // Steps:
    // 1. Verify email doesn't exist
    // 2. Save to collection
    User.find({
        email: email
    }, (err, previousUsers) => {
        if (err) {
            return res.send({
                success: false,
                message: {server: 'Server errors'}
            });
        } else if (previousUsers.length > 0) {
            return res.send({
                success: false,
                errors: {email: 'Account already exists'}
            });
        }

        // Save new user to school personnel collection
        const newSchPersonnel = new schPersonnel();

        newSchPersonnel.firstName = firstName;
        newSchPersonnel.lastName = lastName;
        newSchPersonnel.email = email;
        newSchPersonnel.phoneNumber = phoneNumber;
        newSchPersonnel.schoolCode = schoolCode;
        newSchPersonnel.title = title;
        newSchPersonnel.isActive = true;
        newSchPersonnel.password = newSchPersonnel.generateHash(password);
        newSchPersonnel.role = 'schoolPersonnel';

        newSchPersonnel.save((err, schPersonnel) => {
            if (err) {
                return res.send({
                    success: false,
                    message: {server: 'Server errors'}
                });
            }
            return res.send({
                success: true,
                message: 'Successfully created school personnel!'
            });
        });
    });
}

function login (req, res) {
    // Gets called if passport authorization is successful
    console.log("Hello?");
    res.json({
        success: true,
        token: req.user.token
    })
}

export default {router};

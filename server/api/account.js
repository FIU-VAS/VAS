import express from 'express';
import {addHours} from "date-fns"

import User from '../models/Users/user_Auth';
import Admin from '../models/Users/admin_User';
import Volunteer from '../models/Users/volunteer_User';
import schPersonnel from '../models/Users/school_User';


// input validation
import validateCreateVolunteerInput from '../validation/volunteers/createVolunteer';
import validateCreateSchoolPersonnelInput from '../validation/schoolPersonnels/createSchoolPersonnel';
import validateCreateAdminInput from '../validation/admin/createAdmin';


import passport from "../config/passport"
import {sendMail} from "../config/mail";
import isEmpty from "is-empty";
import config from "../config/config";

const router = new express.Router();

router.post('/admin/signup', adminSignUp);
router.post('/volunteer/signup', volunteerSignUp);
router.post('/school-personnel/signup', schoolPersonnelSignUp);
router.post('/login', passport.authenticate('local', {session: false}, null), login);
router.post('/send-reset-password', sendResetPassword);
router.post('/reset-password', resetPassword);

function adminSignUp(req, res) {
    const {body} = req;
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
    const {errors, isValid} = validateCreateAdminInput(req.body);

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

function volunteerSignUp(req, res) {
    const {body} = req;
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
    const {errors, isValid} = validateCreateVolunteerInput(req.body);

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

function schoolPersonnelSignUp(req, res) {
    const {body} = req;
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
    const {errors, isValid} = validateCreateSchoolPersonnelInput(req.body);
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

function login(req, res) {
    // Gets called if passport authorization is successful
    console.log("Hello?");
    res.json({
        success: true,
        token: req.user.token
    })
}

/**
 * Generates a reset password token and sends an email to the user to
 * a form to reset the password. Link is /reset-password?token={token}&userId={userId}
 * Expects in the body of the request:
 * email: String
 * @param {any} req
 * @param {Request<P, ResBody, ReqBody, ReqQuery, Locals>|http.ServerResponse} res
 */
async function sendResetPassword(req, res) {
    const {body} = req;
    let user, token, resetLink;

    if (isEmpty(body.email)) {
        res.statusCode = 400;
        res.json({
            success: false,
            message: "Missing email"
        })
        return;
    }
    try {
        user = await User.findOne({email: body.email});
        let [_hash, _token] = await User.generateResetToken();
        token = _token;
        user.resetPassword = {
            token: _hash,
            expire: addHours(new Date(), 2)
        }
        await user.save();
        resetLink = config.appProtocol + "://" + config.appDomain + '/reset-password/?resetToken=' + token
            + "&userId=" + user.id;
    } catch (userNotFound) {
        res.statusCode = 400;
        res.json({
            success: false,
            message: "Email does not exist"
        })
    }

    try {
        const response = await sendMail(
            {
                from: "no-reply@cs-first.cs.fiu.edu",
                to: user.email,
                subject: "FIU VAS Reset Password",
                text: "Use the following link to reset your password: " + token + "\nExpires in 2 hours!",
            },
            config.mail.templates.resetPassword,
            {
                resetLink
            }
        );
        if (response.accepted.indexOf(user.email) !== -1) {
            res.json({
                success: true,
                message: "Reset link was sent successfully"
            })
        } else {
            res.json({
                success: false,
                message: "Unknown Error sending email"
            })
        }
    } catch (errorSendingEmail) {
        res.statusCode = 500;
        res.json({
            success: false,
            message: "Error sending email: " + errorSendingEmail.toString()
        })
    }

}

/**
 * Resets the password for a user
 * Expects in the body:
 * token: String (generated by sendResetPassword)
 * userId: String (sent to email by sendResetPassword)
 * password: String
 * @param {any} req
 * @param {Request<P, ResBody, ReqBody, ReqQuery, Locals>|http.ServerResponse} res
 */
async function resetPassword(req, res) {
    const {body} = req;
    let user, isValid;

    if (isEmpty(body.token) || isEmpty(body.userId)) {
        res.statusCode = 400;
        res.json({
            success: false,
            message: "Bad request: Missing token, userId, or new password"
        })
        return;
    }

    try {
        user = await User.findById(body.userId);
    } catch (notFound) {
        res.statusCode = 400;
        res.json({
            success: false,
            message: "Bad request: Missing token, userId, or new password"
        });
        return;
    }
    try {
        isValid = await user.validResetToken(body.token);
    } catch (errorComparing) {
        res.statusCode = 500;
        res.json({
            success: false,
            message: "Error comparing reset tokens: " + errorComparing.toString()
        })
    }

    if (isValid) {
        user.password = await User.generateHashAsync(body.password);
        user.resetPassword.token = null;
        user.resetPassword.expire = null;
        await user.save();
        res.json({
            success: true,
            message: "Password has been reset"
        })
    } else {
        res.statusCode = 403;
        res.json({
            success: false,
            message: "Invalid or expired reset token"
        })
    }
}

export default {router};

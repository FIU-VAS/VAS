import express from 'express';
import {addHours} from "date-fns"
import {omit} from "lodash";

import User from '../models/Users/user_Auth';
import Admin from '../models/Users/admin_User';


import passport from "../config/passport"
import {sendMail} from "../config/mail";
import isEmpty from "is-empty";
import config from "../config/config";
import {extendedCheckSchema} from "../utils/validation";
import {schema as adminSchema} from "../validation-schemas/admin/create";
import {schema as authSchema} from "../validation-schemas/auth/user";
import {checkAdminRole} from "../utils/passport";

const router = new express.Router();

router.post('/admin/signup', passport.authorize('jwt'), checkAdminRole, extendedCheckSchema(adminSchema), adminSignUp);
router.post('/login', passport.authenticate('local', {session: false}, null), login);
router.post('/send-reset-password', sendResetPassword);
router.post('/reset-password', extendedCheckSchema(authSchema), resetPassword);
router.get('/me', passport.authorize('jwt'), getCurrentUser);

async function adminSignUp(req, res) {

    const {body} = req;
    const {
        firstName,
        lastName,
        password,
        phoneNumber,
        email
    } = body;

    try {
        await Admin.create({
            firstName,
            lastName,
            password,
            phoneNumber,
            email: email.toLowerCase()
        })
        return res.send({
            success: true,
            message: 'Successfully created administrator!'
        });
    } catch (insertError) {
        // Means email is duplicated
        if (insertError.code === 11000) {
            return res.send({
                success: false,
                message: 'Error: Account already exists.'
            });
        } else {
            return res.send({
                success: false,
                message: "Error: Server error."
            });
        }
    }
}

function login(req, res) {
    // Gets called if passport authorization is successful
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
                text: "Use the following link to reset your password: " + resetLink + "\nExpires in 2 hours!",
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

async function getCurrentUser(req, res) {
    res.json(omit(req.account.toObject(), ['__v', 'token', 'password']))
}

export default {router};

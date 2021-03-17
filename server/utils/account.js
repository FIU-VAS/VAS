import util from "util";
import crypto from "crypto";
import User from "../models/Users/user_Auth";
import {addHours} from "date-fns";
import {map} from "lodash";
import config from "../config/config";
import {extendedCheckSchema} from "./validation";
import {sendMail} from "../config/mail";
import {checkAdminRole} from "./passport";

export const sendNewUserEmail = async (user, resetLink) => {
    return await sendMail(
        {
            from: "no-reply@cs-first.cs.fiu.edu",
            to: user.email,
            subject: "FIU VAS Account Created",
            text: "Use the following link to reset your password and log in. \nExpires in 2 hours!",
        },
        config.mail.templates.newUser,
        {
            resetLink
        }
    );
};

export const createNewUser = (Schema, validationSchema) => {
    let user, resetLink;

    let createUser = async (request, response) => {
        const [hash, token] = await User.generateResetToken();
        const randBytes = util.promisify(crypto.randomBytes);
        let randomPassword = await randBytes(12);
        const createProps = {
            password: randomPassword,
            resetPassword: {
                token: hash,
                expire: addHours(new Date(), 2)
            }
        };

        map(Schema.schema.obj, (value, key) => {
            if (key in ['_id', 'password', 'resetPassword', 'token']) {
                return true
            }
            if (key in request.body) {
                createProps[key] = request.body[key];
            }
        });

        try {
            user = await Schema.create(createProps);
            resetLink = config.appProtocol + "://" + config.appDomain + '/reset-password/?resetToken=' + token
                + "&userId=" + user.id;
        } catch (insertError) {
            if (insertError.code === 11000) {
                return response.send({
                    success: false,
                    message: 'Error: Account already exists.'
                });
            } else {
                response.statusCode = 500
                return response.send({
                    success: false,
                    message: "Error: Server error."
                });
            }
        }

        try {
            const emailResponse = await sendNewUserEmail(user, resetLink);
            if (emailResponse.accepted.indexOf(user.email) !== -1) {
                response.json({
                    success: true,
                    message: "Volunteer created successfully"
                })
            } else {
                response.json({
                    success: false,
                    message: "Email could not be sent"
                })
            }
        } catch (emailError) {
            response.statusCode = 500;
            response.json({
                success: false,
                message: "Error sending email: " + emailError.toString()
            })
        }
    }

    return [checkAdminRole, extendedCheckSchema(validationSchema), createUser]
};

export const updateUser = (Schema, validationSchema) => {
    let updateUser = async (request, response) => {
        const userId = request.params.id;

        const updateProps = {};

        map(Schema.schema.obj, (value, key) => {
            if (key in ['_id', 'password', 'resetPassword', 'token']) {
                return true
            }
            if (key in request.body) {
                updateProps[key] = request.body[key];
            }
        });

        try {
            const updateResult = await Schema.updateOne({_id: userId}, updateProps);
            if (updateResult.nModified === 1) {
                return response.send({
                    success: true,
                    message: "User updated successfully"
                });
            }
        } catch (insertError) {
            response.statusCode = 500
            return response.send({
                success: false,
                message: "Error: Server error."
            });
        }
    }
    return [checkAdminRole, extendedCheckSchema(validationSchema), updateUser]
}
import util from "util";
import crypto from "crypto";
import Site_Settings from "../models/Settings/siteSettings";
import {map} from "lodash";
import config from "../config/config";
import {extendedCheckSchema} from "./validation";
import {checkAdminRole} from "./passport";
import {UserRoles} from "../models/Users/user_Auth";
import site_Settings from "../models/Settings/siteSettings";

export const createLinks = (Schema, validationSchema) => {

    let createLinks = async (request, response) => {
        const {body} = request
        const{volunteerForm, schoolForm} = body;
        const createProps = {
            schoolForm: request.body.schoolForm,
            volunteerForm: request.body.volunteerForm
        };

        map(Schema.schema.obj, (value, key) => {
            if (key in ['schoolForm', 'volunteerForm']) {
                return true
            }
            if (key in request.body) {
                createProps[key] = request.body[key];
            }
        });

        try {
            await site_Settings.create(createProps);
            return response.send({
                success: true,
                message: 'Successfully created links!'
            });
        } catch (insertError) {
            return response.send({
                success: false,
                message: "Error: Server error."
            });
        }
    }

    return [checkAdminRole,extendedCheckSchema(validationSchema), createLinks]
};

export const updateLinks = (Schema, validationSchema) => {
    let updateLinks = async (request, response) => {
        const userId = request.params.id;

        const updateProps = {};

        if (request.account.role !== UserRoles.Admin) {
            if (request.account.email !== request.body.email) {
                response.statusCode = 401;
                return response.json({
                    success: false,
                    message: "Forbidden Action"
                })
            }
        }

        map(Schema.schema.obj, (value, key) => {
            if (key in ['schoolForm', 'volunteerForm']) {
                return true
            }
            if (key in request.body) {
                updateProps[key] = request.body[key];
            }
        });

        try {
            const updateResult = await Schema.updateOne({_id: userId}, updateProps);
            const newUser = await Schema.findOne({_id: userId});
            console.log(newUser);
            if (updateResult.nModified === 1) {
                return response.send({
                    success: true,
                    message: "Links updated successfully",
                    result: newUser
                });
            }
        } catch (insertError) {
            response.statusCode = 500
            return response.send({
                success: false,
                message: "Error: Server error.\n" + insertError.toString()
            });
        }
    }
    return [extendedCheckSchema(validationSchema), updateLinks]
}

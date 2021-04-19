import express from 'express';
import passport from "../config/passport";

import SiteSettings from '../models/Settings/siteSettings';

// input validation
import {schema as siteSettingsSchema} from "../validation-schemas/settings/create";
import {schema as siteSettingsUpdateSchema} from "../validation-schemas/settings/update"

import {checkAdminRole} from "../utils/passport";
import {map} from "lodash";
import siteSettings from "../models/Settings/siteSettings";
import {extendedCheckSchema} from "../utils/validation";

const router = new express.Router();

router.post('/', passport.authorize('jwt'), checkAdminRole, extendedCheckSchema(siteSettingsSchema), createOrUpdateLinks);
router.get('/', fetchLinks);

async function fetchLinks(request, response) {
    try {
        const results = await SiteSettings.find({}, 'schoolForm volunteerForm');
        response.json(results);
    } catch (dbError) {
        response.statusCode = 500;
        response.json({
            message: "Server error while fetching admin"
        })
    }
}

async function createOrUpdateLinks(request, response)  {
    const createProps = {
        schoolForm: request.body.schoolForm,
        volunteerForm: request.body.volunteerForm
    };

    map(siteSettings.schema.obj, (value, key) => {
        if (!(key in ['schoolForm', 'volunteerForm'])) {
            return true
        }
        if (key in request.body) {
            createProps[key] = request.body[key];
        }
    });

    try {
        await siteSettings.updateOne({}, {$set: createProps}, {upsert: true});
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

export default {router};

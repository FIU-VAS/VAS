import express from 'express';
import {checkSchema} from "express-validator"

import Admin from '../models/Users/admin_User';
import User from '../models/Users/user_Auth';
const bcrypt = require('bcrypt')
import passport from "../config/passport"

// input validation
import validateUpdateAdminInput from '../validation/admin/updateAdmin'
import {schema as adminSchema} from "../validation-schemas/admin/create";

import {checkAdminRole} from "../utils/passport";
import {extendedCheckSchema} from "../utils/validation";

const router = new express.Router();

router.put('/update/', passport.authorize('jwt'), extendedCheckSchema(adminSchema), checkAdminRole, updateAdmin);
router.get('/', passport.authorize('jwt'), checkAdminRole, fetchAdmins);
router.get('/:id', passport.authorize('jwt'), checkAdminRole, fetchAdminById);

async function updateAdmin(request, response) {

	const { body } = request;
	// check if user made changes to email or password to update both auth table and admin table
	// if no changes to email or password, only update admin table
	let properties = {
		...body
	}

	// We don't need to update if the passwords are the same
	if (User.validPassword(properties.password)) {
		delete properties.password
	} else {
		properties.password = await User.generateHashAsync(properties.password);
	}

	try {
		await Admin.updateOne({email: request.account.email}, {
			$set: {
				...properties
			}
		});
		response.statusCode = 200;
		response.json({
			success: true,
			message: "Admin updated successfully"
		});
	} catch (apiError) {
		response.statusCode = 500;
		response.json({
			success: false,
			message: "Error when updating Admin"
		});
	}
}

function fetchAdmins(request, response) {
	Admin.find({}, (err, result) => {
		if (err) {
		  console.log(err);
		} else {
		  response.json(result);
		}
	});
}

function fetchAdminById(request, response) {
	Admin.findById(request.params.id, (err, result) => {
		if (err) {
			console.log(err);
		  } else {
            const payload = {
                role: 'Admin',
                id: result.id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                phoneNumber: result.phoneNumber
            }
            response.json(payload);
		  }
	});
}

export default {router};

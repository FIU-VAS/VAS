import express from 'express';

import Admin from '../models/Users/admin_User';
import User from '../models/Users/user_Auth';

// input validation
import {schema as adminSchema} from "../validation-schemas/admin/create";
import {schema as adminUpdateSchema} from "../validation-schemas/admin/create"

import {checkAdminRole} from "../utils/passport";
import {createNewUser, updateUser} from "../utils/account";

const router = new express.Router();

router.put('/', createNewUser(Admin, adminSchema));
router.put('/:id', updateUser(Admin, adminUpdateSchema));
router.get('/', fetchAdmins);
router.get('/:id', checkAdminRole, fetchAdminById);

async function updateAdmin(request, response) {

	const { body } = request;
	// check if user made changes to email or password to update both auth table and admin table
	// if no changes to email or password, only update admin table
	let properties = {
		...body
	}

	// We don't need to update if the passwords are the same
	const user = request.account;

	if (user.validPassword(properties.password)) {
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

async function fetchAdmins(request, response) {
	try {
		const results = await Admin.find({}, 'id role firstName lastName email phoneNumber isActive');
		response.json(results);
	} catch (dbError) {
		response.statusCode = 500;
		response.json({
			message: "Server error while fetching admin"
		})
	}
}

async function fetchAdminById(request, response) {
	try {
		const result = await Admin.findById(
			request.params.id,
			'id role firstName lastName email phoneNumber'
		);
		response.json(result);
	} catch (dbError) {
		response.statusCode = 500;
		response.json({
			message: "Server error while fetching admin"
		})
	}
}

export default {router};

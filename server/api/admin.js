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

import express from 'express';

import Admin from '../models/Users/admin_User';

// input validation
import {schema as adminSchema} from "../validation-schemas/admin/create";
import {schema as adminUpdateSchema} from "../validation-schemas/admin/update"

import {checkAdminRole} from "../utils/passport";
import {createNewUser, updateUser} from "../utils/account";

const router = new express.Router();

router.post('/', createNewUser(Admin, adminSchema));
router.post('/:id', updateUser(Admin, adminUpdateSchema));
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

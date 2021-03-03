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
		// await
	}

	if ((prevEmail != email) || !(admin.password === '')) {

		// both email and password
		if ((prevEmail != email) && !(admin.password === '')) {
			User.find({email: email},
				(err, previousUsers) => {
					if (err) {
						return response.send({
							success: false,
							errors: {server: 'Server errors'}
						});
					}
					else if (previousUsers.length > 0) {
						return response.send({
							success: false,
							errors: {email: 'Email already exists'}
						});
					}

					let password = bcrypt.hashSync(admin.password, bcrypt.genSaltSync(8), null);

					User.updateOne({email: prevEmail}, {email: email, password: password}, (err, result) => {

						if (err) {
							console.log(err);
						} else {
							if (result.n === 1) {
								delete admin.prevEmail;

								Admin.updateOne({_id: request.params.id}, admin, (err, result) => {

									if (err) {
										console.log(err);
									} else {
										if (result.n === 1) {
											response.json({
												success: true,
												message: 'Successfully updated administrator!'
											});
										}
										else {
											response.json({
												success: false,
												errors: {server: 'Server error'}
											})
										}
									}
								});
							}
							else {
								response.json({
									success: false,
									errors: {server: 'Server error'}
								})
							}
						}
					});
			});
		}

		//password
		if ((prevEmail === email) && !(admin.password === '')) {

			let password = bcrypt.hashSync(admin.password, bcrypt.genSaltSync(8), null);

			User.updateOne({email: prevEmail}, {password: password}, (err, result) => {

				if (err) {
					console.log(err);
				}
				else {
					if (result.n === 1) {
						delete admin.prevEmail;

						Admin.updateOne({_id: request.params.id}, admin, (err, result) => {
							if (err) {
								console.log(err);
							}
							else {
								if (result.n === 1) {
									response.json({
										success: true,
										message: 'Successfully updated administrator!'
									});
								}
								else {
									response.json({
										success: false,
										errors: {server: 'Server error'}
									})
								}
							}
						});
					}
					else {
						response.json({
							success: false,
							errors: {server: 'Server error'}
						})
					}
				}
			});
		}

		//email
		if ((prevEmail != email) && (admin.password === '')) {
			User.find({email: email},
				(err, previousUsers) => {
					if (err) {
						return response.send({
							success: false,
							errors: {server: 'Server errors'}
						});
					}
					else if (previousUsers.length > 0) {
						return response.send({
							success: false,
							errors: {email: 'Email already exists'}
						});
					}

					User.updateOne({email: prevEmail}, {email: email}, (err, result) => {

						if (err) {
							console.log(err);
						}
						else {
							if (result.n === 1) {
								delete admin.prevEmail;

								Admin.updateOne({_id: request.params.id}, admin, (err, result) => {

									if (err) {
										console.log(err);
									} else {
										if (result.n === 1) {
											response.json({
												success: true,
												message: 'Successfully updated administrator!'
											});
										}
										else {
											response.json({
												success: false,
												errors: {server: 'Server error'}
											})
										}
									}
								});
							}
							else {
								response.json({
									success: false,
									errors: {server: 'Server error'}
								})
							}
						}
					});
			});
		}
	}
	else {

		delete admin.prevEmail;

		Admin.updateOne({_id: request.params.id}, admin, (err, result) => {

			if (err) {
				console.log(err);
			} else {
				if (result.n === 1) {
					response.json({
						success: true,
						message: 'Successfully updated administrator!'
					});
				}
				else {
					response.json({
						success: false,
						errors: {server: 'Server error'}
					})
				}
			}
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

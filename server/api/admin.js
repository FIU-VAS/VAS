import express from 'express';
import Admin from '../models/Users/admin_User';
import User from '../models/Users/user_Auth';
const bcrypt = require('bcrypt')
import passport from "../config/passport"

// input validation
import validateUpdateAdminInput from '../validation/admin/updateAdmin'
import {checkRole} from "../utils/passport";

const router = new express.Router();

router.put('/update/:id', passport.authorize('jwt'), updateAdmin);
router.get('/', passport.authorize('jwt'), checkRole, fetchAdmins);
router.get('/:id', passport.authorize('jwt'), checkRole, fetchAdminById);

function updateAdmin(request, response) {
	let admin = {};
	
	let admin_req = request.body;

	admin = {
		firstName: admin_req.firstName,
		lastName: admin_req.lastName,
		email: admin_req.email.toLowerCase(),
		phoneNumber: admin_req.phoneNumber,
		prevEmail: admin_req.prevEmail,
		password: admin_req.password
	}

	// Form validation
	const { errors, isValid } = validateUpdateAdminInput(admin);

	// Check validation
	if (!isValid) {
		return response.status(400).json({success: false, errors});
	}
	const email = admin.email.toLowerCase();
	const prevEmail = admin.prevEmail.toLowerCase();

	// check if user made changes to email or password to update both auth table and admin table
	// if no changes to email or password, only update admin table
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
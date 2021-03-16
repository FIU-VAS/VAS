import express from 'express';
import schPersonnel from '../models/Users/school_User';
import User from '../models/Users/user_Auth';

const bcrypt = require('bcrypt')

// input validation
import validateUpdateSchoolPersonnelInput from '../validation/schoolPersonnels/updateSchoolPersonnel'
import {createNewUser, updateUser} from "../utils/account";
import {schema as schoolPersonnelSchema} from "../validation-schemas/schoolPersonnel/create"
import {schema as schoolPersonnelUpdateSchema} from "../validation-schemas/schoolPersonnel/create"

const router = new express.Router();

router.post('/', createNewUser(schPersonnel, schoolPersonnelSchema));
router.post('/:id', updateUser(schPersonnel, schoolPersonnelUpdateSchema));
router.get('/', fetchSchoolPersonnels);
router.get('/:id', fetchSchoolPersonnelById);
router.get('/getPersonnelInfo/:codes', fetchSchoolPersonnelByCode);

function updateSchoolPersonnel(request, response) {
    if (request.params.id !== 'null') {
        // Form validation
        const {errors, isValid} = validateUpdateSchoolPersonnelInput(request.body);

        // Check validation
        if (!isValid) {
            return response.status(400).json({success: false, errors});
        }

        schPersonnel.updateOne({_id: request.params.id}, request.body, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.n === 1) {
                    response.json({
                        success: true,
                        message: 'Successfully updated school personnel!'
                    });
                } else {
                    response.json({
                        success: false,
                        errors: {server: 'Server error'}
                    })
                }
            }
        });
    } else {
        const {body} = request;
        const {
            schoolCode,
            firstName,
            lastName,
            title,
            phoneNumber,
        } = body;
        let {
            email
        } = body;

        // form validation
        const {errors, isValid} = validateCreateSchoolPersonnelInput(request.body);

        // check validation
        if (!isValid) {
            return response.status(400).json({success: false, errors});
        }

        email = email.toLowerCase();

        // Steps:
        // 1. Verify email doesn't exist
        // 2. Save to collection
        User.find({
            email: email
        }, (err, previousUsers) => {
            if (err) {
                return response.json({
                    success: false,
                    message: {server: 'Server errors'}
                });
            } else if (previousUsers.length > 0) {
                return response.json({
                    success: false,
                    errors: {email: 'Account already exists'}
                });
            }

            // Save new user to school personnel collection
            const newSchPersonnel = new schPersonnel();

            newSchPersonnel.firstName = firstName;
            newSchPersonnel.lastName = lastName;
            newSchPersonnel.email = email;
            newSchPersonnel.phoneNumber = phoneNumber;
            newSchPersonnel.schoolCode = schoolCode;
            newSchPersonnel.title = title;
            newSchPersonnel.isActive = true;
            newSchPersonnel.password = newSchPersonnel.generateHash("t0_B3_uPD4teD");
            newSchPersonnel.role = 'schoolPersonnel';

            newSchPersonnel.save((err, schPersonnel) => {
                if (err) {
                    return response.json({
                        success: false,
                        message: {server: 'Server errors'}
                    });
                }
                return response.json({
                    success: true,
                    message: 'Successfully created school personnel!'
                });
            });
        });
    }

}

function fetchSchoolPersonnels(request, response) {
    schPersonnel.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            response.json(result);
        }
    });
}

function fetchSchoolPersonnelById(request, response) {
    schPersonnel.findById(request.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            response.json(result);
        }
    });
}

function fetchSchoolPersonnelByCode(request, response) {

    const schoolCodes = request.params.codes

    const codes = schoolCodes.split(',');

    schPersonnel.find({
        schoolCode: codes
    }, (err, result) => {
        if (err) {
            response.statusCode = 500;
            response.json({
                message: "Internal server error"
            });
            console.log(err);
        } else {
            response.json(result);
        }
    });
}

export default {router};

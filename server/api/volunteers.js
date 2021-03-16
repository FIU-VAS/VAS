import express from 'express';
import Volunteer from '../models/Users/volunteer_User';
import User from '../models/Users/user_Auth';
import Team from '../models/Teams/team';

const bcrypt = require('bcrypt')

// input validation
import validateUpdateVolunteerInput from '../validation/volunteers/updateVolunteer'
<<<<<<< HEAD
import validateCreateVolunteerInput from '../validation/volunteers/createVolunteer';
import {checkVolunteerRole} from "../utils/passport";
import passport from "../config/passport";

const router = new express.Router();

router.post('/update/:id', updateVolunteer);
=======
import {checkAdminRole} from "../utils/passport";
import {extendedCheckSchema} from "../utils/validation";
import {schema as volunteerSchema} from "../validation-schemas/volunteer/create"

const router = new express.Router();

router.post('/', checkAdminRole, extendedCheckSchema(volunteerSchema), createVolunteer);
router.post('/:id', updateVolunteer);
router.put('/update/:id', updateVolunteer);
>>>>>>> 18542a2f59796c41381afc4d8e422149498a13eb
router.put('/updateProfile/:id', updateVolunteerProfile);
router.get('/', fetchVolunteers);
router.get('/:id', fetchVolunteerById);
router.get('/getVolunteerInfo/:pids', fetchVolunteerByPID);

async function createVolunteer(request, response) {
    Volunteer.create({

    })
}

function updateVolunteerProfile(request, response) {
    Volunteer.updateOne({_id: request.params.id}, request.body, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.n === 1) {
                //response.json('success');
                response.json(request.params)

            } else {
                response.json('failed')
            }
        }
    });
}

function updateVolunteer(request, response) {
    if (request.params.id !== 'null') {

        // Form validation
        const {errors, isValid} = validateCreateVolunteerInput(request.body);
    
        // Check validation
        if (!isValid) {
            return response.status(400).json({success: false, errors});
        }

        Volunteer.updateOne({_id: request.params.id}, request.body, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.n === 1) {
                    response.json({
                        success: true,
                        message: 'Successfully updated volunteer!'
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
            firstName,
            lastName,
            phoneNumber,
            pantherID,
            major,
            isActive,
            carAvailable,
            volunteerStatus,
            MDCPS_ID
        } = body;
        let {
            email
        } = body;
    
        // Form validation
        const {errors, isValid} = validateCreateVolunteerInput(request.body);
    
        // Check validation
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
                    errors: {server: 'Server errors'}
                });
            } else if (previousUsers.length > 0) {
                return response.json({
                    success: false,
                    errors: {email: 'Account already exists'}
                });
            }
    
            // Save new user to volunteer collection
            const newVolunteer = new Volunteer();
    
            newVolunteer.firstName = firstName;
            newVolunteer.lastName = lastName;
            newVolunteer.email = email;
            newVolunteer.phoneNumber = phoneNumber;
            newVolunteer.pantherID = pantherID;
            newVolunteer.major = major;
            newVolunteer.carAvailable = carAvailable;
            newVolunteer.volunteerStatus = volunteerStatus;
            newVolunteer.isActive = true;
            newVolunteer.MDCPS_ID = MDCPS_ID;
            newVolunteer.password = newVolunteer.generateHash("t0_B3_uPD4teD");
            newVolunteer.role = 'volunteer'
    
            newVolunteer.save((err, volunteer) => {
                if (err) {
                    return response.json({
                        success: false,
                        errors: err
                    });
                }
                return response.json({
                    success: true,
                    message: 'Successfully created volunteer!'
                });
            });
        });
    }

}

function fetchVolunteers(request, response) {
    Volunteer.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            response.json(result);
        }
    });
}

function fetchVolunteerById(request, response) {
    Volunteer.findById(request.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            const payload = {
                role: 'Volunteer',
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                phoneNumber: result.phoneNumber,
                pantherID: result.pantherID,
                major: result.major,
                carAvailable: result.carAvailable,
                volunteerStatus: result.volunteerStatus,
                isActive: result.isActive,
                MDCPS_ID: result.MDCPS_ID,
                id: result.id,
            }
            response.json(payload);
        }
    });
}

function fetchVolunteerByPID(request, response) {


    const pantherIDs = request.params.pids

    let PIDs = pantherIDs.split(',');

    Volunteer.find({
        pantherID: {$in: PIDs}
    }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            response.json(result);
            /* response.json(result); */
        }
    })
}

export default {router};

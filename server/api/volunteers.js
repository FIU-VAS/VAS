import express from 'express';
import bcrypt from 'bcrypt';

import Volunteer from '../models/Users/volunteer_User';
import User from '../models/Users/user_Auth';


// input validation
import {schema as volunteerSchema} from "../validation-schemas/volunteer/create"
import {schema as volunteerUpdateSchema} from "../validation-schemas/volunteer/update"
import {createNewUser, updateUser} from "../utils/account";

const router = new express.Router();

router.post('/', createNewUser(Volunteer, volunteerSchema));
router.post('/:id', updateUser(Volunteer, volunteerUpdateSchema));
router.get('/', fetchVolunteers);
router.get('/:id', fetchVolunteerById);
router.get('/getVolunteerInfo/:pids', fetchVolunteerByPID);

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

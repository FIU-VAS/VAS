import express from 'express';
import bcrypt from 'bcrypt';

import Volunteer from '../models/Users/volunteer_User';
import User from '../models/Users/user_Auth';

// input validation
import {createNewUser, updateUser} from "../utils/account";
import {schema as volunteerSchema} from "../validation-schemas/volunteer/create"
import {schema as volunteerUpdateSchema} from "../validation-schemas/volunteer/update"
import {UserRoles} from "../models/Users/user_Auth";
import Team from "../models/Teams/team";
import SchoolPersonnel from "../models/Users/school_User";

const router = new express.Router();

router.post('/', createNewUser(Volunteer, volunteerSchema));
router.post('/:id', updateUser(Volunteer, volunteerUpdateSchema));
router.get('/', fetchVolunteers);
router.get('/:id', fetchVolunteerById);
router.get('/getVolunteerInfo/:pids', fetchVolunteerByPID);

async function fetchVolunteers(request, response) {

    if (request.account.role !== UserRoles.Admin) {
        switch (request.account.role) {
            case UserRoles.Volunteer:
                const teams = await Team.find({volunteerPIs: request.account.pantherID});
                const allowedVolunteersPIs = teams.map (team => team.volunteerPIs).reduce((acc, value) => {
                    return acc.concat(value)}, []);
                const allowedVolunteers = await Volunteer.find({pantherID: {$in: allowedVolunteersPIs}});
                return response.json(allowedVolunteers)
            case UserRoles.SchoolPersonnel:
                const schoolTeams = await Team.find({schoolCode: request.account.schoolCode});
                const allowVolunteersPIs = schoolTeams.map (team => team.volunteerPIs).reduce((acc, value) => {
                    return acc.concat(value)}, []);
                const results = await Volunteer.find({pantherID: {$in: allowVolunteersPIs}});
                return response.json(results);
        }
    }
    const allVolunteers = await Volunteer.find({});
    response.json(allVolunteers);
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

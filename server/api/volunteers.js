import express from 'express';
import bcrypt from 'bcrypt';

import Volunteer from '../models/Users/volunteer_User';
import User from '../models/Users/user_Auth';

// input validation
import {createNewUser, updateUser} from "../utils/account";
import {schema as volunteerSchema} from "../validation-schemas/volunteer/create"
import {schema as volunteerUpdateSchema} from "../validation-schemas/volunteer/update"
import {schema as volunteerFetchSchema} from "../validation-schemas/volunteer/fetch"
import {UserRoles} from "../models/Users/user_Auth";
import Team from "../models/Teams/team";
import {extendedCheckSchema} from "../utils/validation";
import {buildVolunteerByAvailability} from "../utils/team-query";

const router = new express.Router();

router.post('/', createNewUser(Volunteer, volunteerSchema));
router.post('/:id', updateUser(Volunteer, volunteerUpdateSchema));
router.get('/', extendedCheckSchema(volunteerFetchSchema), fetchVolunteers);
router.get('/:id', fetchVolunteerById);
router.get('/getVolunteerInfo/:pids', fetchVolunteerByPID);
router.post('/', )

async function fetchVolunteers(request, response) {

    const {availability, semester, year} = request.query;

    if (availability && semester && year && request.account.role === UserRoles.Admin) {
        let aggregation = buildVolunteerByAvailability(semester, year, availability);
        const results = await Volunteer.aggregate(aggregation);
        return response.json(results);
    }

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

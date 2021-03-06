import express from 'express';
import SchoolPersonnel from '../models/Users/school_User';


// input validation
import {createNewUser, updateUser} from "../utils/account";
import {schema as schoolPersonnelSchema} from "../validation-schemas/schoolPersonnel/create"
import {schema as schoolPersonnelUpdateSchema} from "../validation-schemas/schoolPersonnel/update"
import {UserRoles} from "../models/Users/user_Auth";
import Team, {sanitizeAvailability, validateAvailability} from "../models/Teams/team";
import {extendedCheckSchema} from "../utils/validation";

const router = new express.Router();

router.post('/', createNewUser(SchoolPersonnel, schoolPersonnelSchema));
router.post('/:id', updateUser(SchoolPersonnel, schoolPersonnelUpdateSchema));
router.get('/', extendedCheckSchema({
    schoolCode: {
        isNumeric: true,
        optional: {
            nullable: true,
            checkFalsy: true
        },
    }
}), fetchSchoolPersonnels);
router.get('/:id', fetchSchoolPersonnelById);
router.get('/getPersonnelInfo/:codes', fetchSchoolPersonnelByCode);

async function fetchSchoolPersonnels(request, response) {
    let conditions = {};

    if (request.query.schoolCode) {
        conditions.schoolCode = request.query.schoolCode
    }

    if (request.query.availability) {
        // Return aggregation instead of find

    }

    if (request.account.role !== UserRoles.Admin) {
        switch (request.account.role) {
            case UserRoles.Volunteer:
                const teams = await Team.find({volunteerPIs: request.account.pantherID});
                const allowedSchools = teams.map(team => team.schoolCode);
                const allowedSchoolPersonnel = SchoolPersonnel.find({schoolCode: {$in: allowedSchools}});
                return response.json(allowedSchoolPersonnel)
            case UserRoles.SchoolPersonnel:
                const results = await SchoolPersonnel.find({schoolCode: request.account.schoolCode});
                return response.json(results);
        }
    }
    const all = await SchoolPersonnel.find(conditions);
    response.json(all);
}

function fetchSchoolPersonnelById(request, response) {
    SchoolPersonnel.findById(request.params.id, (err, result) => {
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

    SchoolPersonnel.find({
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

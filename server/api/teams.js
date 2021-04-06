import express from 'express';
import mongoose from "mongoose"

import Team from '../models/Teams/team';
import {UserRoles} from '../models/Users/user_Auth';
import SchoolPersonnel from '../models/Users/school_User';
import Volunteer from '../models/Users/volunteer_User';

//input validation
import {schema as teamDataSchema} from "../validation-schemas/team/team-data"
import {schema as teamFetchSchema} from "../validation-schemas/team/fetch"
import {schema as teamCreateSchema} from "../validation-schemas/team/create"
import {schema as teamDeleteSchema} from "../validation-schemas/team/delete"
import validateUpdateTeamInput from '../validation/teams/updateTeam';
import {checkAdminRole} from "../utils/passport";
import {extendedCheckSchema} from "../utils/validation";
import {buildQuery} from "../utils/team-query";

const router = new express.Router();

router.post('/', extendedCheckSchema(teamCreateSchema), checkAdminRole, createUpdateTeam);
router.post('/delete/:id', extendedCheckSchema(teamDeleteSchema), checkAdminRole, deleteTeam);
router.put('/update/:id', checkAdminRole, updateTeam);
router.get('/getTeamInfo/:pid', fetchTeamByPantherID);
router.get('/', extendedCheckSchema(teamFetchSchema), fetchTeams);
router.get('/getTeamInfoSch/:schoolCode', fetchTeamBySchoolCode);
router.get('/getTeamData/:id', extendedCheckSchema(teamDataSchema), getTeamData)
router.get('/suggest', checkAdminRole, extendedCheckSchema({
    semester: {
        exists: true,
        errorMessage: "Term must be defined"
    },
    year: {
        isNumeric: true,
        isLength: {
            options: {
                min: 4,
                max: 4
            },
        },
        errorMessage: "Year must be a number of 4 digits"
    }
}), teamSuggestions);
router.get('/:id', fetchTeamById);


async function deleteTeam(req, res) {
    const {id, closureNotes} = req.body;

    let update = {
        isActive: false,
        closureNotes: closureNotes || ''
    }

    try {
        await Team.updateOne({_id: id}, {$set: update})
        return res.json({
            success: true,
            message: "Successfully deleted Team: " + id
        });
    } catch (dbError) {
        return res.json({
            success: false,
            message: "Error when deleting Team: " + dbError.toString()
        });
    }
}

async function createUpdateTeam(req, res) {
    const {body} = req;

    let properties = {};
    let result;

    for (let prop in Team.schema.obj) {
        if (prop in body) {
            properties[prop] = body[prop];
        }
    }

    try {
        if (body._id) {
            await Team.updateOne({_id: body._id}, properties)
            result = await Team.findById(body._id);
        } else {
            result = await Team.create(properties)
        }

        return res.json({
            success: true,
            team: result,
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Could not update " + error.toString()
        });
    }
}

function updateTeam(request, response) {
    let {body} = request;

    //deconstruct PIDs into an array
    body.volunteerPIs = body.volunteerPIs.split(',')

    // form validation
    const {errors, isValid} = validateUpdateTeamInput(request.body);
    // check validation
    if (!isValid) {
        return response.status(400).json({success: false, errors});
    }

    //check if team is being deativated to change timestamp
    if (body.isActive === 'false') {
        body.timeStamp = Date.now()
    }

    Team.updateOne({_id: request.params.id}, body, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.n === 1) {
                Team.findById(request.params.id)
                    .then(result => {
                        return response.send({
                            success: true,
                            message: 'Successfully updated team!'
                        });
                    })
                    .catch(error => {
                        response.json({
                            success: false,
                            message: error.toString()
                        })
                    })
            } else {
                response.json({
                    success: false,
                    message: "Could not update"
                });
            }
        }
    });

}

function fetchTeams(request, response) {
    let {semester, year} = request.query;

    let conditions = {
        isActive: true
    };

    if (semester) {
        conditions.semester = semester;
    }

    if (year) {
        conditions.year = year;
    }

    switch (request.account.role) {
        case UserRoles.Volunteer:
            conditions.volunteerPIs = request.account.pantherID;
            break;
        case UserRoles.SchoolPersonnel:
            conditions.schoolCode = request.account.schoolCode;
            break;
    }



    Team.find(conditions, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            response.json(result);
        }
    });
}

function fetchTeamById(request, response) {
    Team.findById(request.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            response.json(result);
        }
    });
}

function fetchTeamByPantherID(request, response) {

    const pantherID = request.params.pid

    Team.find({
        volunteerPIs: pantherID
    }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            response.json(result);
        }
    });
}

function fetchTeamBySchoolCode(request, response) {

    const schoolCode = request.params.schoolCode

    Team.find({
        schoolCode: schoolCode
    }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            response.json(result);
        }
    });
}

async function getTeamData(request, response) {
    const fieldMaps = {
        volunteers: {
            from: "users",
            localField: "volunteerPIs",
            foreignField: "pantherID",
            as: "volunteers"
        },
        school: {
            from: "schools",
            localField: "schoolCode",
            foreignField: "schoolCode",
            as: "school"
        },
        schoolPersonnel: {
            from: "users",
            localField: "schoolCode",
            foreignField: "schoolCode",
            as: "schoolPersonnel"
        }
    }

    const {related} = request.query;

    if (!related.every(field => field in fieldMaps)) {
        response.statusCode = 400;
        return response.json({
            success: false,
            message: "Invalid field provided in request. Allowed [volunteers, school, schoolPersonnel]"
        });
    }

    let aggregation = [
        {
            $match: {_id: mongoose.Types.ObjectId(request.params.id)}
        },
        ...related.map(field => {
            return {
                $lookup: fieldMaps[field]
            }
        })
    ];


    switch (request.account.role) {
        case UserRoles.SchoolPersonnel:
            aggregation[0].$match.schoolCode = request.account.schoolCode
            break;
        case UserRoles.Volunteer:
            aggregation[0].$match.volunteerPIs = request.account.pantherID;
            break
    }

    const results = await Team.aggregate(aggregation);

    return response.json({
        success: true,
        team: results.length ? results[0] : {}
    });
}

async function teamSuggestions(request, response) {
    // @TODO Improve logic to use less queries to db
    const {semester, year} = request.params;
    let matchesQuery = "";

    try {
        const schoolPersonnel = await SchoolPersonnel.find({}, "email availability schoolCode");
        matchesQuery = buildQuery(schoolPersonnel, {isActive: true}, "volunteer", {pantherID: 1, email: 1, firstName: 1, lastName: 1}, 3);
        console.log(matchesQuery);
        const matches = await Volunteer.aggregate(matchesQuery);
        if (matches.length) {
            const teams = schoolPersonnel.map(personnel => {
                return {
                    schoolCode: personnel.schoolCode,
                    semester: semester,
                    year: year,
                    availability: personnel.availability,
                    volunteers: matches[0][personnel._id],
                }
            })
            return response.json({
                success: true,
                teams
            })
        }
        return response.json(matches)
    } catch (error) {
        response.statusCode = 500
        response.json({
            success: false,
            message: `Internal Server Error: [${error.toString()}]`,
            query: matchesQuery
        })
    }
}

export default {router};
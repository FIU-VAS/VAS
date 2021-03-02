import express from 'express';
import isEmpty from "is-empty";
import {parse} from "date-fns";

import Team, {Days} from '../models/Teams/team';
import Volunteer from '../models/Users/volunteer_User';
import SchoolPersonnel from '../models/Users/school_User';

//input validation
import validateCreateTeamInput from '../validation/teams/createTeam';
import validateUpdateTeamInput from '../validation/teams/updateTeam';
import {checkAdminRole, checkVolunteerRole} from "../utils/passport";
import passport from "../config/passport";

const router = new express.Router();

router.post('/create',passport.authorize('jwt'), checkAdminRole, createTeam);
router.put('/update/:id',passport.authorize('jwt'), checkAdminRole, updateTeam);
router.get('/:id',passport.authorize('jwt'), checkVolunteerRole, fetchTeamById);
router.get('/getTeamInfo/:pid',passport.authorize('jwt'), checkVolunteerRole, fetchTeamByPantherID);
router.get('/',passport.authorize('jwt'), checkVolunteerRole, fetchTeams);
router.get('/getTeamInfoSch/:schoolCode',passport.authorize('jwt'), checkVolunteerRole, fetchTeamBySchoolCode);
router.get('/suggest/:term',passport.authorize('jwt'), checkVolunteerRole, fetchTeamBySchoolCode);

function createTeam(req, res) {
    const {body} = req;
    let {
        schoolCode,
        semester,
        year,
        startTime,
        endTime,
        volunteerPIs,
        isActive
    } = body;

    //deconstruct PIDs into an array
    volunteerPIs = volunteerPIs.split(',')

    // form validation
    const {errors, isValid} = validateCreateTeamInput(req.body);
    // check validation
    if (!isValid) {
        return res.status(400).json({success: false, errors});
    }

    const newTeam = new Team;

    newTeam.schoolCode = schoolCode;
    newTeam.semester = semester;
    newTeam.year = year;
    newTeam.dayOfWeek.monday = body['dayOfWeek[monday]'];
    newTeam.dayOfWeek.tuesday = body['dayOfWeek[tuesday]'];
    newTeam.dayOfWeek.wednesday = body['dayOfWeek[wednesday]'];
    newTeam.dayOfWeek.thursday = body['dayOfWeek[thursday]'];
    newTeam.dayOfWeek.friday = body['dayOfWeek[friday]'];
    newTeam.startTime = startTime;
    newTeam.endTime = endTime;
    newTeam.volunteerPIs = volunteerPIs;
    newTeam.isActive = 'true';
    newTeam.timeStamp = Date.now()

    newTeam.save((err, team) => {
        if (err) {
            return res.send({
                success: false,
                errors: 'Error: Server error'
            });
        }
        return res.send({
            success: true,
            message: 'Successfully created team!'
        });
    });

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
                return response.send({
                    success: true,
                    message: 'Successfully updated team!'
                });
            } else {
                response.json('failed')
            }
        }
    });

}

function fetchTeams(request, response) {
    Team.find({isActive: true}, (err, result) => {
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

function teamSuggestions(request, response) {
    const term = request.params.term;
    if (isEmpty(term)) {
        response.statusCode = 400;
        response.json({
            message: "Bad request: Term must be defined"
        })
    }

    const volunteers = Volunteer.find({isActive: true, year: term})
    const schoolPersonnel = SchoolPersonnel.find({isActive: true})

    let schoolPersonnelByDay = [];

    const days = Object.values(Days);

    schoolPersonnel
    const parseTime = (objs) => {
        return objs.map(obj => obj.toObject().availability.map(av => ({
            ...av,
            startTime: parse(av.startTime, "HH:mm", new Date()),
            endTime: parse(av.endTime, "HH:mm", new Date())
        })));
    }

    let volunteersObj = parseTime(volunteers);
    let schoolPersonnelObj = parseTime(schoolPersonnel);

    volunteersObj.forEach(volunteer => {

    })
}

export default {router};

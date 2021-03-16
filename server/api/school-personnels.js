import express from 'express';
import schPersonnel from '../models/Users/school_User';


// input validation
import {createNewUser, updateUser} from "../utils/account";
import {schema as schoolPersonnelSchema} from "../validation-schemas/schoolPersonnel/create"
import {schema as schoolPersonnelUpdateSchema} from "../validation-schemas/schoolPersonnel/create"

const router = new express.Router();

router.post('/', createNewUser(schPersonnel, schoolPersonnelSchema));
router.post('/:id', updateUser(schPersonnel, schoolPersonnelUpdateSchema));
router.get('/', fetchSchoolPersonnels);
router.get('/:id', fetchSchoolPersonnelById);
router.get('/getPersonnelInfo/:codes', fetchSchoolPersonnelByCode);

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

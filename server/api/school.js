import express from 'express';

const School = require('../models/Schools/school')
import mongoose from "mongoose"

// input validation
import validateCreateSchoolInput from '../validation/schools/createSchool';
import validateUpdateSchoolInput from '../validation/schools/updateSchool';

import {checkRole} from "../utils/passport";
import passport from "../config/passport";

const router = new express.Router();

router.post('/create',passport.authorize('jwt'), createSchool);
router.put('/update/:id',passport.authorize('jwt'), updateSchool);
router.get('/:id',passport.authorize('jwt'), fetchSchoolById);
router.get('/getSchoolInfo/:codes',passport.authorize('jwt'), fetchSchoolByCode);
router.get('/',passport.authorize('jwt'), fetchSchools);


function createSchool (req, res) {

    const { body } = req;
    const {
        schoolName,
        schoolCode,
        level,
        phoneNumber,
        address,
        city,
        state,
        zipCode,
        isActive
        } = body;


        // form validation
        const { errors, isValid } = validateCreateSchoolInput(req.body);
        // check validation
        if (!isValid) {
            return res.status(400).json({success: false, errors});
        }

        School.find({
            schoolCode: schoolCode
        }, (err, previousSchool) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            } else if (previousSchool.length > 0) {
                return res.send({
                    success: false,
                    message: 'Error: A school by this code already exists'
                });
            }


        const newSchool = new School;

        newSchool.schoolName = schoolName;
        newSchool.schoolCode = schoolCode;
        newSchool.level = level;
        newSchool.phoneNumber = phoneNumber;
        newSchool.address = address;
        newSchool.city = city;
        newSchool.state = state;
        newSchool.zipCode = zipCode;
        newSchool.isActive = 'true';

        newSchool.save((err, school) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }
            return res.send({
                success: true,
                message: 'Successfully created school!'
            });
        });
    });

}

function updateSchool(request, response) {
    // form validation
    const { errors, isValid } = validateUpdateSchoolInput(request.body);
    // check validation
    if (!isValid) {
        return response.status(400).json({success: false, errors});
    }

	School.updateOne({_id: request.params.id}, request.body, (err, result) => {
		if (err) {
			console.log(err);
		  } else {
			if (result.n === 1) {
				return response.send({
                    success: true,
                    message: 'Successfully updated school!'
                });
			}
			else {
				response.json('failed')
			}
		  }
	});
}

function fetchSchools(request, response) {
	School.find({}, (err, result) => {
		if (err) {
		  console.log(err);
		} else {
		  response.json(result);
		}
	});
}

function fetchSchoolById(request, response) {
    if (!request.params.id) {
        response.statusCode = 400;
        response.json({
            message: "Bad Request"
        })
    }

	School.findById(request.params.id, (err, result) => {
		if (err) {
		    response.statusCode = 400;
		    response.json({
                message: "Bad Request"
            })
		  } else {
			response.json(result);
		  }
	});
}

function fetchSchoolByCode(request, response) {

    const schoolCodes = request.params.codes
    console.log("CODEs: ", schoolCodes);

    var CODES = schoolCodes.split(',');
	//CODES = CODES.map(Number)

    School.find({
        schoolCode: CODES
          }, (err, result) => {
              if (err) {
            console.log(err);
          } else {
            response.json(result);
          }
      });
  }

export default {router};

import {Days} from "../../models/Teams/team";
import School from "../../models/Schools/school";

const codes = School.aggregate([{$project: {_id: 0, schoolCode: 1}}]).map(x => x.schoolCode);
const semesters = ['Fall', 'Spring', 'Summer'];

const getSchema = (req) => ({
    schoolCode: {
        custom: (value) => codes.indexOf(value) !== -1,
        errorMessage: 'School code has not been registered',
    },
    semester: {
        custom: (value) => semesters.indexOf(value) !== -1,
        errorMessage: 'Invalid school semester',
    },
    year: {
        isNumeric: {
            errorMessage: 'Invalid year',
        },
        isLength: {
            errorMessage: 'Invalid year',
            options: {
                max: 4,
                min: 4
            }
        }
    },
    availability: {
        custom: (values) => {
            return (values.map(value => {
                return Object.values(Days).indexOf(value.dayOfWeek) !== -1
                    && value.startTime.length > 0 && value.endTime.length > 0
            }).filter(Boolean)).length === values.length;
        },
        errorMessage: "Invalid availability object provided"
    },
    volunteerPIs: {
        type: Array,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    timeStamp: {
        type: Number,
        default: 0
    },
    closureNotes: {
        type: String,
        default: ''
    }
})
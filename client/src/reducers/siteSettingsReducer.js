import {SET_SETTINGS} from "../actions/types";
import {forEach} from "lodash";

const initialState = {
    schoolForm: '',
    volunteerForm: ''
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_SETTINGS:
            let newState = {};
            forEach(initialState, (value, key) => {
                if (key in action.payload){
                    newState[key] = action.payload[key];
                }
            });
            return newState
        default:
            return state;
    }
}

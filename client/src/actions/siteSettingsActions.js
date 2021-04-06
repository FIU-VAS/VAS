import {SET_SETTINGS} from "./types";

export const setCurrentSettings = settings => {
    return {
        type: SET_SETTINGS,
        payload: settings
    };
};

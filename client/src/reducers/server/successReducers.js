import { GET_SUCCESS, CLEAR_SUCCESS, REDIRECT } from '../../actions/types';

const initialState = {
    message: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SUCCESS:
      return { message: action.payload };
    case REDIRECT:
      return {
        ...state,
        redirectTo: action.payload 
      };
    case CLEAR_SUCCESS:
      return action.payload;  
    default:
      return state;
  }
}
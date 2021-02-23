import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common['Authorization'] = "Bearer " + token;
  }
  else {
    // Delete auth header

    // ERROR is i leave this and Logout
    //delete request.headers.Authorization
  }
};

export default setAuthToken;
import React, { Component } from 'react';
import ResetPasswordForm from '../components/ResetPassword/ResetPasswordForm';
import NavBar from '../components/AppBar/NavBar';
class ResetPassword extends Component{    
    render(){
        return (
            <div>
                <NavBar/>
                <ResetPasswordForm/>
            </div>
        )
    }
}

export default ResetPassword;
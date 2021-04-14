import React, {Component} from 'react';
import isEmpty from 'is-empty';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import { blueGrey, grey } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import './LoginForm.css';
import {Redirect, withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {loginUser} from "../../actions/authActions";
import {clearErrors} from "../../actions/server/errorActions";
import {clearSuccess} from "../../actions/server/successActions";
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';


// Login Styling
const theme = createMuiTheme({
    palette: {
      primary: grey,
    }
    
  });

const useStyles = {
  loginform: {

    
  },
  paper: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: blueGrey[500],
    alignItems: 'left',
    '&:hover': {
        backgroundColor: grey[900],
    }
    
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    
    
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#57C965',
    color: "black",
    '&:hover': {
        backgroundColor: '#57C965',
    }
  
  },
  logo: {
    height: '80px',
    marginBottom: '0px'
  },
};

// Login Styling END

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            submitted: false,
            forgotPasswordDialog: false,
            errors: {}
        };

        this.toggleForgotPasswordDialog = this.toggleForgotPasswordDialog.bind(this);
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }

        this.props.clearErrors();
    }

    toggleForgotPasswordDialog() {
        this.setState(prevState => ({
            forgotPasswordDialog: !prevState.forgotPasswordDialog
        }));
    }

    handleInput = (e) => {
        const value = e.target.value
        const name = e.target.name

        this.setState({
            [name]: value
        })
    }

    submitLogin = async (e) => {
        e.preventDefault();
        this.props.clearSuccess();

        if (this.validate()) {

            const userData = {
                email: this.state.email,
                password: this.state.password
            };

            //redirect is handled within loginUser()
            this.props.loginUser(userData);
        }
    }

    inputError = (error) => {
        return (
            <Alert severity="error">{error}</Alert>
        )
    };

    responseMessage = () => {
        if (!isEmpty(this.props.success.message))
            return (
                <Alert severity="success">{this.props.success.message}</Alert>
            )
        else if (!isEmpty(this.props.errors)) {
                return (
                    <Alert severity="error">{this.props.errors}</Alert>
                )
        }
    }

    validate = async (e) => {
        let email = this.state.email;
        let password = this.state.password;
        let errors = {};
        let isValid = true;


        if (!password) {
            isValid = false;
            errors["password"] = "Please enter password.";
        }

        if (typeof email !== "undefined") {

            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(email)) {
                isValid = false;
                errors["email"] = "Please enter valid email address.";
            }
        }
        this.setState({
            errors: errors
        });

        return isValid;
    };


    render() {
        if (this.props.auth.isAuthenticated) {
            return <Redirect to="/dashboard"/>
        }
        return (
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <div className={this.props.classes.paper}>

                        <img
                            className={this.props.classes.logo}
                            src={require("../../images/VAS_LOGO.png").default}
                            alt="logo"
                        />

                        <Typography component="h1" variant="h5">
                            Login
                        </Typography>
                        {this.responseMessage()}
                        <form className={this.props.classes.form} onSubmit={this.submitLogin.bind(this)} noValidate>
                            <div>
                                <TextField
                                    variant="outlined"
                                    color="primary"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    onChange={this.handleInput}
                                    value={this.state.email}
                                />
                                {this.state.errors.hasOwnProperty("email") && this.inputError(this.state.errors.email)}
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={this.handleInput}
                                    value={this.state.password}
                                />
                                {this.state.errors.hasOwnProperty("password") && this.inputError(this.state.errors.password)}
                            </div>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                className={this.props.classes.submit}
                            >
                                Login
                            </Button>

                        </form>

                        <Button onClick={this.toggleForgotPasswordDialog}>
                            Forgot Password?
                        </Button>
                    </div>
                    {this.state.forgotPasswordDialog && <ForgotPasswordDialog open={this.state.forgotPasswordDialog}
                                                                              close={this.toggleForgotPasswordDialog}/>}
                </Container>
            </ThemeProvider>
        );
    }
}

// define types
LoginForm.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// allows us to get our state from Redux and map it to props
const mapStateToProps = state => ({
    auth: state.auth,
    success: state.success,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    {loginUser, clearSuccess, clearErrors}
)(withRouter(withStyles(useStyles)(LoginForm)));
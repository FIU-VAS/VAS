import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {blueGrey, blue} from '@material-ui/core/colors';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/core/styles';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {resetPassword} from "../../actions/authActions";
import {Redirect} from "react-router-dom";
import Alert from '@material-ui/lab/Alert';

const theme = createMuiTheme({
    palette: {
        primary: blue,
    }
});

const useStyles = {
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: blueGrey[500],
        '&:hover': {
            backgroundColor: blue[500],
        }
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: '#57C965',
        color: "white",
        fontWeight: "bold",
        '&:hover': {
            backgroundColor: '#57C965',
        }
    },
    logo: {
        height: '80px',
        marginBottom: '0px'
    },
};

class ResetPasswordForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirmPwd: '',
            token: '',
            userId: '',
            errors: {}
        };
    }

    componentDidMount() {
        var params = new URLSearchParams(window.location.search);

        this.setState({
            token: params.get("resetToken"),
            userId: params.get("userId")
        });
    }

    handleInput = (e) => {
        const value = e.target.value
        const name = e.target.name

        this.setState({
            [name]: value
        })
    }

    submitResetPassword = async (e) => {
        e.preventDefault();

        let valid = await this.validate();
        if (valid) {
            const resetData = {
                token: this.state.token,
                userId: this.state.userId,
                password: this.state.password
            };

            this.props.resetPassword(resetData);
        }
    }

    inputError = (error) => {
        return (
            <Alert severity="error">{error}</Alert>
        )
    };

    redirect() {
        if (this.props.success.hasOwnProperty("redirectTo")) {
            return true;
        }

        return false;
    }

    validate = async (e) => {
        let password = this.state.password;
        let confirm = this.state.confirmPwd;
        let errors = {};
        let isValid = true;

        if (password.length === 0) {
            isValid = false;
            errors["password"] = "This field is required.";
        }

        if (confirm.length === 0) {
            isValid = false;
            errors["confirmPwd"] = "This field is required.";
        }

        if (password !== confirm) {
            isValid = false;
            errors["confirmPwd"] = "Passwords do not match.";
        }

        this.setState({
            errors: errors
        });

        return isValid;
    };

    render() {
        if (this.redirect()) {
            return <Redirect to={this.props.success.redirectTo}/>;
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

                        {!!this.props.errors && !!this.props.errors.length ? (
                            <Alert severity="error" style={{margin: "1rem 0"}}>
                                {
                                    this.props.errors.filter(error => error.param === "password").length
                                        ? this.props.errors.filter(error => error.param === "password")[0].msg
                                        : ""
                                }
                            </Alert>
                        ) : ""}
                        <Typography component="h1" variant="h5">
                            Reset Password
                        </Typography>
                        <form className={this.props.classes.form} onSubmit={this.submitResetPassword.bind(this)}
                              noValidate>
                            <div>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="New Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={this.handleInput}
                                    value={this.state.password}
                                />
                                {this.state.errors.hasOwnProperty("password") && this.inputError(this.state.errors.password)}
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="confirmPwd"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPwd"
                                    autoComplete="new-password"
                                    onChange={this.handleInput}
                                    value={this.state.confirmPwd}
                                />
                                {this.state.errors.hasOwnProperty("confirmPwd") && this.inputError(this.state.errors.confirmPwd)}
                            </div>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                className={this.props.classes.submit}
                            >
                                Reset Password
                            </Button>
                        </form>
                    </div>
                </Container>
            </ThemeProvider>
        );
    }
}

// define types
ResetPasswordForm.propTypes = {
    classes: PropTypes.object.isRequired,
    resetPassword: PropTypes.func.isRequired,
    errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired
};

// allows us to get our state from Redux and map it to props
const mapStateToProps = state => ({
    success: state.success,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    {resetPassword}
)(withRouter(withStyles(useStyles)(ResetPasswordForm)));
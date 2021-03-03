import React, { Component } from 'react';
import isEmpty from 'is-empty';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import { createMuiTheme } from '@material-ui/core/styles';
import { blueGrey, blue } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { clearErrors } from '../../actions/server/errorActions'
import { requestPasswordReset } from "../../actions/authActions";
import { clearSuccess } from '../../actions/server/successActions'
import Alert from '@material-ui/lab/Alert';

const theme = createMuiTheme({
    palette: {
      primary: blue,
    }
  });

const useStyles = {
    bottomButtons: {
        backgroundColor: blueGrey[700],
        color: "white",
        fontWeight: "bold",
        '&:hover': {
            backgroundColor: blue[500],
        }
    },
};

class ForgotPasswordDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }

        this.requestPasswordReset = this.requestPasswordReset.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.exitDialog = this.exitDialog.bind(this);
        this.props.clearErrors();
        this.props.clearSuccess();
    }    


    requestPasswordReset() {
        this.props.clearErrors();
        this.props.clearSuccess();
        this.props.requestPasswordReset(this.state)
    }

    handleInput = (e) => {
        const value = e.target.value
        const name = e.target.name
    
        this.setState({
          [name]: value 
        })
    }

    exitDialog() {
        this.props.clearErrors();
        this.props.clearSuccess();
        this.props.close();
    }

    successMessage() {
        if (!isEmpty(this.props.success.message)) {
          return <Alert severity="success">{this.props.success.message}</Alert> 
        }
        else if (!isEmpty(this.props.errors.message)) {
            return <Alert severity="error">{this.props.errors.message}</Alert>
        }
    }

    render() {

        const {open} = this.props

        return (
            <ThemeProvider theme={theme}>
            <Dialog
            open={open}
            >
                <DialogTitle>
                  <Box display="flex" alignItems="center">
                    <Box flexGrow={1} >Reset Password</Box>
                    <Box>
                      <IconButton onClick={this.exitDialog}>
                          <CloseIcon />
                      </IconButton>
                  </Box>
                </Box>                
                </DialogTitle>
                { this.successMessage() }
                <DialogContent>
                    <DialogContentText>
                    Please enter the email address for your account
                    </DialogContentText>
                    <br></br>                 
                    <TextField 
                        label="Email"
                        style={{marginBottom : "15px"}}
                        margin="dense"
                        name="email"
                        onChange={this.handleInput}
                        type="email"
                        fullWidth
                        error={!isEmpty(this.props.errors.email)}
                        helperText={this.props.errors.email}
                    />
                    <br></br>   
                </DialogContent>
                <DialogActions>
                    <Button className={this.props.classes.bottomButtons} onClick={this.exitDialog} variant="contained" color="primary">Cancel</Button>
                    <Button className={this.props.classes.bottomButtons} onClick={this.requestPasswordReset}  variant="contained" color="primary">Submit</Button>
                </DialogActions>
            </Dialog>
            </ThemeProvider>
        );
    }
}

ForgotPasswordDialog.propTypes = {
    requestPasswordReset: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    errors: state.errors,
    success: state.success
  });

export default connect (
    mapStateToProps,
    { requestPasswordReset, clearErrors, clearSuccess }  
)(withRouter(withStyles(useStyles)(ForgotPasswordDialog)));
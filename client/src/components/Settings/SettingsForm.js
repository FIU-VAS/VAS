import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { blue, blueGrey } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { connect } from "react-redux";
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { ThemeProvider } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';


const theme = createMuiTheme({
    palette: {
      primary: blue,
    }
  });

// Profile Styling
const useStyles = {
    all: {
        backgroundColor: '#fafafa',
        height: '100vh'
    },
    card: {
        marginTop: theme.spacing(12),
        minWidth: 650,
        maxWidth: 800,
        height: 400,
        backgroundColor: 'white'
    },
    title: {
        fontSize: 16,
        alignItems: 'right',
        color: 'black'
    },
    form: {
        width: '100%',
    },
    textfield:{
        // boxShadow:'0 0 15px 4px rgba(0,0,0,0.06)'
    },
    Button: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
        
    },
    editButton: {
        backgroundColor: "black",
        color: "white",
        fontWeight: "bold",
        '&:hover': {
            backgroundColor: "black",
        },
        width: "70px",
        "&:disabled": {
            backgroundColor: blueGrey[100],
            color: "white",
          }
    },

  };
// Login Styling END

class Settings_Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editDisabled: true,
            schoolForm: "",
            volunteerForm: "",

        }

        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount() {  
        this.setState({
            
            schoolForm: this.props.schoolForm,
            volunteerForm: this.props.volunteerForm,
        });

    }

    handleInput = (e) =>{
        const value = e.target.value
    }

    editable = () => {
        this.setState({
            editDisabled: !this.state.editDisabled
        })
    }

  render(){   

    return (
        <ThemeProvider theme={theme}>
        <div className={this.props.classes.all}>
        <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center">
            <Box 
            borderRadius= "10px"
            className={this.props.classes.card} 
            variant="outlined"
            justify="center">
                <CardContent>
                    <Typography className={this.props.classes.title} color="textSecondary" variant="h2" gutterBottom>
                        Site Settings
                    </Typography>
                    <form className={this.props.classes.form} noValidate>

                    {/* Register School Form */}
                    <TextField
                        variant="standard"
                        margin="normal"
                        disabled={this.state.editDisabled}
                        className={this.props.classes.textfield}
                        fullWidth
                        label="Register_School Form Link"
                        name="registerschoollink"
                        autoFocus
                        onChange={this.handleInput}
                        value={this.state.schoolForm}
                    />
                    {/* Volunteer Form */}
                    <TextField
                        variant="standard"
                        margin="normal"
                        disabled={this.state.editDisabled}
                        className={this.props.classes.textfield}
                        fullWidth
                        label="Volunteer Form Link"
                        name="volunteerlink"
                        autoFocus
                        onChange={this.handleInput}
                        value={this.state.volunteerForm}
                    />
                    </form>
                </CardContent>
                <div className={this.props.classes.Button}>
                <CardActions>
                    <Button 
                    className={this.props.classes.editButton}
                    onClick={this.editable} 
                    size="small"
                    disabled={!this.state.editDisabled}
                    endIcon={<EditIcon />}>
                        Edit
                    </Button>
                    <Button 
                    className={this.props.classes.editButton}
                    onClick={this.editable}
                    size="small"
                    disabled={this.state.editDisabled}
                    endIcon={<SaveIcon />}>
                        Save
                    </Button>
                </CardActions>
                </div>
            </Box>

        </Grid>
        </div>
        </ThemeProvider>
    );
  }
}


export default withStyles(useStyles)(Settings_Form);
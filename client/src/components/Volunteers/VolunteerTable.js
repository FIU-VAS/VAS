import React, { Component, Fragment } from 'react';
import isEmpty from 'is-empty';
import serverConf from '../../config'
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { AvailabilityDialog } from "../Extras/AvailabilityDialog";
import { getVolunteers } from '../../actions/volunteerActions';
import { UserFormDialog } from '../Users/UserFormDialog';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CreateIcon from '@material-ui/icons/Create';
import { IconButton } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { format, parseISO } from 'date-fns';

const theme = createMuiTheme({
    palette: {
      primary: {main: green[600]}, // For isActive is true
      secondary: {main: red[600]},// For isActive is false
    }
  });

const useStyles = ({
    table: {
      minWidth: 200,
    },
    all: {
        backgroundColor: '#fafafa',
        height: 322
    },
    card: {
        marginTop: 10,
        minWidth: 300,
        maxWidth: 450,
        height: 300
    },
    title: {
        fontSize: 14,
        alignItems: 'right'
    },
    subHeading: {
        fontSize: 15,
        alignItems: 'right'
    },
    body: {
        fontSize: 13,
        alignItems: 'right'
    }
  });

class VolunteerTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedVolunteer: {},
            userFormDialog: false,
            availabilityDialog: false,
            edit: false
        }

        this.toggleUserFormDialog= this.toggleUserFormDialog.bind(this);
        this.toggleAvailabilityDialog = this.toggleAvailabilityDialog.bind(this);
    }

    componentDidMount() {
        this.props.getVolunteers();
    }

    toggleUserFormDialog() {
        if (this.state.userFormDialog) {
            this.setState(prevState => ({
                ...prevState,
                userFormDialog: false,
                selectedVolunteer: {}
            }));
            this.props.getVolunteers();
        }
        else {
            this.setState(prevState => ({
                ...prevState,
                userFormDialog: true,
            }));
        }
    }

    toggleAvailabilityDialog() {
        if (this.state.availabilityDialog) {
            this.setState(prevState => ({
                ...prevState,
                availabilityDialog: false,
            }));
            this.props.getVolunteers();
        }
        else {
            this.setState(prevState => ({
                ...prevState,
                availabilityDialog: true,
            }));
        }
    }

    setColor(text) {
        if (text === true) {
            return "primary";
        }
        else if (text === false) {
            return "secondary";
        }
        else {
            return "textPrimary";
        }
    }

    render() {
        const edit = !isEmpty(this.state.selectedVolunteer);
        const endpoint = edit ? `${serverConf.uri}${serverConf.endpoints.volunteers.update}/${this.state.selectedVolunteer._id}` : `${serverConf.uri}${serverConf.endpoints.volunteers.signup}/`;

        const formProps = [
            {
                label: "First Name",
                name: "firstName",
                defaultValue: edit ? this.state.selectedVolunteer.firstName : "",
                type: "text"
            }, 
            {
                label: "Last Name",
                name: "lastName",
                defaultValue: edit ? this.state.selectedVolunteer.lastName : "",
                type: "text"
            },
            {
                label: "Email",
                name: "email",
                defaultValue: edit ? this.state.selectedVolunteer.email : "",
                type: "email"
            },
            {
                label: "Phone Number",
                name: "phoneNumber",
                defaultValue: edit ? this.state.selectedVolunteer.phoneNumber : "",
                type: "tel"
            },
            {
                label: "Panther ID",
                name: "pantherID",
                defaultValue: edit ? this.state.selectedVolunteer.pantherID : "",
                type: "text"

            },
            {
                label: "Major",
                name: "major",
                defaultValue: edit ? this.state.selectedVolunteer.major : "",
                type: "text"
            },
            {
                label: "Is Active",
                name: "isActive",
                id: "is-active",
                defaultValue: edit ? this.state.selectedVolunteer.isActive : true,
                type: "select",
                options: [
                    {value: true, label: "Yes"}, 
                    {value: false, label: "No"}
                ]
            },
            {
                label: "Car Available",
                name: "carAvailable",
                id: "car-available",
                defaultValue: edit ? this.state.selectedVolunteer.carAvailable : true,
                type: "select",
                options: [
                    {value: true, label: "Yes"}, 
                    {value: false, label: "No"}
                ]
            },
            {
                label: "Volunteer Status",
                name: "volunteerStatus",
                id: "volunteer-status",
                defaultValue: edit ? this.state.selectedVolunteer.volunteerStatus : true,
                type: "select",
                options: [
                    {value: true, label: "Approved"}, 
                    {value: false, label: "Not Approved"}
                ]
            },
            {
                label: "MDCPS ID",
                name: "MDCPS_ID",
                defaultValue: edit ? this.state.selectedVolunteer.MDCPS_ID : "",
                type: "text"
            }
        ];

        return (
            <Fragment>
                <MaterialTable
                    title="Volunteers"
                    columns={
                        [
                            { title: 'First Name', field: 'firstName' },
                            { title: 'Last Name', field: 'lastName' },
                            { title: 'Email', field: 'email'},
                            { title: 'Phone #', field: 'phoneNumber'}
                        ]
                    }
                    data={this.props.volunteers}
                    actions={[
                        {
                        icon: 'person_add',
                        tooltip: 'Add Volunteer',
                        isFreeAction: true,
                        onClick: this.toggleUserFormDialog
                        },
                        {
                        icon: 'edit',
                        tooltip: 'Edit Volunteer',
                        onClick: (event, rowData) => {this.setState({selectedVolunteer: rowData}); this.toggleUserFormDialog()}
                        }
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                        headerStyle: {
                            backgroundColor: '#b0bec5',
                            color: '#212121'
                        },
                        searchFieldStyle: {
                            backgroundColor: '#eeeeee',
                        },
                        cellStyle: {
                            width: 250,
                            maxWidth: 700
                          },
                          pageSizeOptions: [10, 20, 50, 100],
                          pageSize: 10,
                          paging: true,
                          exportButton: true,
                    }}
                    detailPanel={rowData => { 
                        return (
                            <ThemeProvider theme={theme}>
                            <div className={this.props.classes.all} >
                            <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center">
                                <Card 
                                className={this.props.classes.card} 
                                variant="outlined"
                                justify="center">
                                    <CardContent>
                                    {/* PantherID */}
                                    <Typography className={this.props.classes.subHeading} color="textPrimary" variant="h6" display="inline" >
                                        Panther ID: &nbsp;
                                    </Typography>
                                    <Typography className={this.props.classes.body} color="textPrimary" variant="body1" display="inline" gutterBottom>
                                        {rowData.pantherID}<br/>
                                    </Typography>

                                    {/* Major */}
                                    <Typography className={this.props.classes.subHeading} color="textPrimary" variant="h6" display="inline" >
                                        Major: &nbsp;
                                    </Typography>
                                    <Typography className={this.props.classes.body} color="textPrimary" variant="body1" display="inline" gutterBottom>
                                        {rowData.major}<br/>
                                    </Typography>

                                    {/* Car Available */}
                                    <Typography className={this.props.classes.subHeading} color="textPrimary" variant="h6" display="inline" >
                                        Car Available: &nbsp;
                                    </Typography>
                                    <Typography className={this.props.classes.body} color="textPrimary" variant="body1" display="inline" gutterBottom>
                                        {rowData.carAvailable ? "Yes": "No"}<br/>
                                    </Typography>

                                    {/* Volunteer Status */}
                                    <Typography className={this.props.classes.subHeading} color="textPrimary" variant="h6" display="inline" >
                                        Volunteer Status: &nbsp;
                                    </Typography>
                                    <Typography className={this.props.classes.body} color="textPrimary" variant="body1" display="inline" gutterBottom>
                                        {rowData.volunteerStatus ? "Approved": "Not yet Approved"}<br/>
                                    </Typography>

                                    {/* MDCPS ID */}
                                    <Typography className={this.props.classes.subHeading} color="textPrimary" variant="h6" display="inline" >
                                        MDCPS ID: &nbsp;
                                    </Typography>
                                    <Typography className={this.props.classes.body} color="textPrimary" variant="body1" display="inline" gutterBottom>
                                        {rowData.MDCPS_ID ? rowData.MDCPS_ID : "NA"}<br/>
                                    </Typography>

                                     {/* is Active*/}
                                     <Typography className={this.props.classes.subHeading} color="textPrimary" variant="h6" display="inline" >
                                        Activation status: &nbsp;
                                    </Typography>
                                    <Typography className={this.props.classes.body} variant="h6" display="inline" color={this.setColor(rowData.isActive)} gutterBottom>
                                        {rowData.isActive ? 'Active' : 'Not Active'}<br/>
                                    </Typography>
                                    {/* Availability*/}
                                     <Typography className={this.props.classes.subHeading} color="textPrimary" variant="h6" display="inline" >
                                        Availability: {rowData.availability && rowData.availability.length === 0 && <IconButton onClick={this.toggleAvailabilityDialog} size="small"><CreateIcon /></IconButton>}<br/>
                                    </Typography>
                                    {rowData.availability.length === 0 ?                                     
                                        <Typography className={this.props.classes.body} color="textPrimary" variant="body1" display="inline" gutterBottom>
                                        Availability has not been set.<br/>
                                        </Typography> :
                                        rowData.availability.map(timeSlot => {
                                            return(
                                            <Typography className={this.props.classes.body} style={{textTransform: "capitalize"}} color="textPrimary" variant="body1" display="inline" gutterBottom>
                                            {timeSlot.dayOfWeek}: {format(parseISO(timeSlot.startTime), "h:mm aa")} - {format(parseISO(timeSlot.endTime), "h:mm aa")}<br/>
                                            </Typography>
                                            )
                                        })}
                                        {this.state.availabilityDialog && <AvailabilityDialog
                                                                            open={this.state.availabilityDialog}
                                                                            close={this.toggleAvailabilityDialog}
                                                                            userEmail={rowData.email}
                                                                            value={rowData.availability}
                                                                            endpoint={`${serverConf.uri}${serverConf.endpoints.volunteers.update}/${rowData._id}`}
                                                                          />
                                        }   
                                    </CardContent>
                                </Card>
                            </Grid>
                            </div>
                            </ThemeProvider>

                        )


                    }}
                />
                {this.state.userFormDialog && <UserFormDialog
                                                        open={this.state.userFormDialog} 
                                                        close={this.toggleUserFormDialog} 
                                                        endpoint={endpoint}
                                                        formProps={formProps}
                                                        title={edit ? "Edit Volunteer" : "Create Volunteer"}
                                                        description={edit ? 'To edit a  Volunteer, modify the following form and click SUBMIT'
                                                        : 'To create a  Volunteer, modify the following form and click SUBMIT'}
                                                />
                } 
            </Fragment>
        );
    }
}

VolunteerTable.propTypes = {
    getVolunteers: PropTypes.func.isRequired,
    volunteers: PropTypes.array.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    volunteers: state.volunteers.volunteers,
    errors: state.errors
});

export default connect (
    mapStateToProps,
    { getVolunteers }  
)(withRouter(withStyles(useStyles)(VolunteerTable)));
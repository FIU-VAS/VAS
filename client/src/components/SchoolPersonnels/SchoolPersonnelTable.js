import React, {Component, Fragment} from 'react';
import isEmpty from 'is-empty';
import serverConf from '../../config'
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { AvailabilityDialog } from "../Extras/AvailabilityDialog";
import {getSchoolPersonnels} from '../../actions/schoolPersonnelActions';
import {getSchools} from '../../actions/schoolActions';
import {UserFormDialog} from '../Users/UserFormDialog';
import {withStyles} from '@material-ui/core/styles';
import {Card, CardContent, Grid, IconButton, Typography, createMuiTheme, ThemeProvider} from "@material-ui/core";
import CreateIcon from '@material-ui/icons/Create';
import {red} from '@material-ui/core/colors';
import {format, parseISO} from "date-fns";

const theme = createMuiTheme({
    palette: {
        primary: {main: '#57C965'}, // For isActive is true
        secondary: {main: red[600]},// For isActive is false
    }
});

const useStyles = ({
    table: {
        minWidth: 200,
    },
    all: {
        backgroundColor: '#fafafa',
    },
    card: {
        marginTop: 10,
        minWidth: 300,
        maxWidth: 450,
        marginBottom: "0.5rem"
    },
    title: {
        fontSize: 14,
        alignItems: 'right',
    },
    subHeading: {
        fontSize: 15,
        alignItems: 'right'
        
    },
    body: {
        fontSize: 13,
        alignItems: 'right',
        
    }
});


class SchoolPersonnelTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSchoolPersonnel: {},
            userFormDialog: false,
            availabilityDialog: false
        }

        this.toggleUserFormDialog = this.toggleUserFormDialog.bind(this);
        this.toggleAvailabilityDialog = this.toggleAvailabilityDialog.bind(this);
    }

    componentDidMount() {
        this.props.getSchoolPersonnels();
        this.props.getSchools();
    }

    toggleUserFormDialog() {
        if (this.state.userFormDialog) {
            this.setState(prevState => ({
                ...prevState,
                userFormDialog: false,
                selectedSchoolPersonnel: {}
            }));
            this.props.getSchoolPersonnels();
        } else {
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
            this.props.getSchoolPersonnels();
        } else {
            this.setState(prevState => ({
                ...prevState,
                availabilityDialog: true,
            }));
        }
    }

    setColor(text) {
        if (text === true) {
            return "primary";
        } else if (text === false) {
            return "secondary";
        } else {
            return "textPrimary";
        }
    }

    render() {
        const edit = !isEmpty(this.state.selectedSchoolPersonnel);
        const endpoint = edit ? `${serverConf.uri}${serverConf.endpoints.schoolPersonnels.update}/${this.state.selectedSchoolPersonnel._id}` : `${serverConf.uri}${serverConf.endpoints.schoolPersonnels.signup}/`;

        const formProps = [
            {
                label: "First Name",
                name: "firstName",
                defaultValue: edit ? this.state.selectedSchoolPersonnel.firstName : "",
                type: "text"
            },
            {
                label: "Last Name",
                name: "lastName",
                defaultValue: edit ? this.state.selectedSchoolPersonnel.lastName : "",
                type: "text"
            },
            {
                label: "Email",
                name: "email",
                defaultValue: edit ? this.state.selectedSchoolPersonnel.email : "",
                type: "email"
            },
            {
                label: "Phone Number",
                name: "phoneNumber",
                defaultValue: edit ? this.state.selectedSchoolPersonnel.phoneNumber : "",
                type: "tel"
            },
            {
                label: "Title",
                name: "title",
                defaultValue: edit ? this.state.selectedSchoolPersonnel.title : "",
                type: "text"
            },
            {
                label: "School",
                name: "schoolCode",
                id: "school-code",
                defaultValue: edit ? this.state.selectedSchoolPersonnel.schoolCode : "",
                type: "select",
                options: this.props.schools.map((school) => {
                    return {
                        value: school.schoolCode,
                        label: school.schoolName
                    }
                })
            },
            {
                label: "Is Active",
                name: "isActive",
                id: "is-active",
                defaultValue: edit ? this.state.selectedSchoolPersonnel.isActive : true,
                type: "select",
                options: [
                    {value: true, label: "Yes"},
                    {value: false, label: "No"}
                ]
            }
        ];

        return (
            <Fragment>
                <MaterialTable
                    title="School Personnel"
                    columns={
                        [
                            {title: 'First Name', field: 'firstName'},
                            {title: 'Last Name', field: 'lastName'},
                            {title: 'Email', field: 'email'},
                            {title: 'Phone #', field: 'phoneNumber'}
                        ]
                    }
                    data={this.props.schoolPersonnels}
                    actions={[
                        {
                            icon: 'person_add',
                            tooltip: 'Add School Personnel',
                            isFreeAction: true,
                            onClick: this.toggleUserFormDialog,
                            
                        },
                        {
                            icon: 'edit',
                            tooltip: 'Edit School Personnel',
                            onClick: (event, rowData) => {
                                this.setState({selectedSchoolPersonnel: rowData});
                                this.toggleUserFormDialog()
                            }
                        }
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                        headerStyle: {
                            backgroundColor: '#57C965',
                            color: 'white'
                        },
                        cellStyle: {
                            width: 250,
                            maxWidth: 700
                        },
                        searchFieldStyle: {
                            backgroundColor: '#eeeeee',
                        },
                        pageSizeOptions: [4, 10, 20, 50, 100],
                        pageSize: 10,
                        paging: true,
                        exportButton: true,
                    }}
                    detailPanel={rowData => {

                        return (

                            <ThemeProvider theme={theme}>
                                <div className={this.props.classes.all}>
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
                                                {/* Title */}
                                                <Typography className={this.props.classes.subHeading}
                                                            color="textPrimary" variant="h6" display="inline">
                                                    Title: &nbsp;
                                                </Typography>
                                                <Typography className={this.props.classes.body} color="textPrimary"
                                                            variant="body1" display="inline" gutterBottom>
                                                    {rowData.title}<br/>
                                                </Typography>

                                                {/* School Code - School Name*/}
                                                <Typography className={this.props.classes.subHeading}
                                                            color="textPrimary" variant="h6" display="inline">
                                                    Associated School: &nbsp;
                                                </Typography>
                                                <Typography className={this.props.classes.body} color="textPrimary"
                                                            variant="body1" display="inline" gutterBottom>
                                                    {rowData.schoolCode} - &nbsp;
                                                    {this.props.schools.map(school => {
                                                        if (school.schoolCode === rowData.schoolCode) {
                                                            return school.schoolName
                                                        }
                                                    })}<br/>
                                                </Typography>

                                                {/* is Active*/}
                                                <Typography className={this.props.classes.subHeading}
                                                            color="textPrimary" variant="h6" display="inline">
                                                    Activation status: &nbsp;
                                                </Typography>
                                                <Typography className={this.props.classes.body} variant="h6"
                                                            display="inline" color={this.setColor(rowData.isActive)}
                                                            gutterBottom>
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
                                                                                    endpoint={`${serverConf.uri}${serverConf.endpoints.schoolPersonnels.update}/${rowData._id}`}
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
                    title={edit ? "Edit School Personnel" : "Create School Personnel"}
                    description={edit ? 'To edit a  School Personnel, modify the following form and click SUBMIT'
                        : 'To create a  School Personnel, modify the following form and click SUBMIT'}
                />}
            </Fragment>
        );
    }
}

SchoolPersonnelTable.propTypes = {
    getSchoolPersonnels: PropTypes.func.isRequired,
    schoolPersonnels: PropTypes.array.isRequired,
    getSchools: PropTypes.func.isRequired,
    schools: PropTypes.array.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    schoolPersonnels: state.schoolPersonnels.schoolPersonnels,
    schools: state.schoolData.schools,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    {getSchoolPersonnels, getSchools}
)(withRouter(withStyles(useStyles)(SchoolPersonnelTable)));
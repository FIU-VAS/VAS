import React, {Component, Fragment} from 'react';
import isEmpty from 'is-empty';
import serverConf from '../../config'
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getAdmins} from '../../actions/adminActions';
import {UserFormDialog} from '../Users/UserFormDialog';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/core/styles';


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
        //backgroundColor: '#fafafa',
        height: 78
    },
    card: {
        marginTop: 10,
        minWidth: 300,
        maxWidth: 450,
        height: 55
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

class AdminTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAdmin: {},
            userFormDialog: false
        }

        this.toggleUserFormDialog = this.toggleUserFormDialog.bind(this);
    }

    componentDidMount() {
        this.props.getAdmins();
    }

    toggleUserFormDialog() {
        if (this.state.userFormDialog) {
            this.setState(prevState => ({
                userFormDialog: false,
                selectedAdmin: {}
            }));
            this.props.getAdmins();
        } else {
            this.setState(prevState => ({
                userFormDialog: true,
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
        const edit = !isEmpty(this.state.selectedAdmin);
        const endpoint = edit ? `${serverConf.uri}${serverConf.endpoints.admin.update}/${this.state.selectedAdmin._id}` : `${serverConf.uri}${serverConf.endpoints.admin.signup}/`;
        console.log(endpoint);
        const formProps = [
            {
                label: "First Name",
                name: "firstName",
                defaultValue: edit ? this.state.selectedAdmin.firstName : "",
                type: "text"
            },
            {
                label: "Last Name",
                name: "lastName",
                defaultValue: edit ? this.state.selectedAdmin.lastName : "",
                type: "text"
            },
            {
                label: "Email",
                name: "email",
                defaultValue: edit ? this.state.selectedAdmin.email : "",
                type: "email"
            },
            {
                label: "Phone Number",
                name: "phoneNumber",
                defaultValue: edit ? this.state.selectedAdmin.phoneNumber : "",
                type: "tel"
            }
        ];

        return (
            <Fragment>
                <MaterialTable
                    title="Administrators"
                    columns={
                        [
                            {title: 'First Name', field: 'firstName'},
                            {title: 'Last Name', field: 'lastName'},
                            {title: 'Email', field: 'email'},
                            {title: 'Phone #', field: 'phoneNumber'}
                        ]
                    }
                    data={this.props.admins}
                    actions={[
                        {
                            icon: 'person_add',
                            tooltip: 'Add Admin',
                            isFreeAction: true,
                            onClick: this.toggleUserFormDialog
                        },
                        {
                            icon: 'edit',
                            tooltip: 'Edit Admin',
                            onClick: (event, rowData) => {
                                this.setState({selectedAdmin: rowData});
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
                    title={edit ? "Edit Admin" : "Create Admin"}
                    description={edit ? 'To edit a  Admin, modify the following form and click SUBMIT'
                        : 'To create a  Admin, modify the following form and click SUBMIT'}
                />}
            </Fragment>
        );
    }
}

AdminTable.propTypes = {
    getAdmins: PropTypes.func.isRequired,
    admins: PropTypes.array.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    admins: state.adminData.admins,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    {getAdmins}
)(withRouter(withStyles(useStyles)(AdminTable)));
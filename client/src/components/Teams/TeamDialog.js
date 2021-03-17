import React, {useState} from "react";
import {Grid} from "@material-ui/core";
import {connect} from "react-redux";
import {UserFormDialog} from "../Users/UserFormDialog";


const TeamDialog = (props) => {
    const defaultState = {
        semester: '',
        year: '',
        schoolCode: '',
        availability: [
            {
                dayOfWeek: '',
                startTime: '10:00',
                endTime: '11:00',
            }
        ],
        volunteerPIs: [],
        isActive: true,
        closureNotes: '',
    };

    const {open, close} = props;

    const [team, setTeam] = useState(Object.assign({}, defaultState, props.team));

    let fields = [
        {
            name: 'semester',
            type: 'text',
            wrapper: {
                component: Grid,
                props: {
                    xs: 12,
                    md: 6,
                    item: true
                }
            },
            label: 'Semester'
        },
        {
            name: 'year',
            type: 'number',
            wrapper: {
                component: Grid,
                props: {
                    xs: 12,
                    md: 6,
                    item: true
                }
            },
            label: 'Year'
        },
        {
            name: 'schoolCode',
            type: 'select',
            options: props.schools.map(school => ({
                value: school.schoolCode,
                label: school.schoolName
            })),
            defaultValue: '',
            label: 'School Code'
        },
        {
            name: 'volunteers',
            type: 'select',
            options: props.volunteers.map(volunteer => ({
                value: volunteer.pantherID,
                label: volunteer.firstName + " " + volunteer.lastName
            })),
            label: 'Volunteers',
            multiple: true
        },
        {
            name: 'is-active',
            type: 'select',
            options: [
                {value: true, label: 'Yes'},
                {value: false, label: 'No'}
            ],
            label: 'Is Active'
        },
    ].map(prop => {
        if (!prop.wrapper) {
            return {
                ...prop,
                wrapper: {
                    component: Grid,
                    props: {
                        item: true,
                        xs: 12
                    }
                }
            }
        }
        return prop
    });

    console.log(fields)

    return (
        <UserFormDialog
            formProps={fields}
            formWrapper={Grid}
            formWrapperProps={{
                container: true,
                spacing: 2,
                justify: "center",
            }}
            open={open}
            close={close}
            title="Create a Team"
            description="To edit a team, modify the following form and click UPDATE."
            onSubmit={console.log}
            submitDataOnly={true}
        />
    )
    // return (
    //     <Dialog
    //         open={open}
    //         maxWidth="sm"
    //     >
    //         <DialogTitle>Edit Team</DialogTitle>
    //         {this.successMessage()}
    //         <DialogContent>
    //             <DialogContentText>
    //                 To edit a team, modify the following form and click UPDATE.
    //             </DialogContentText>
    //             <div className={this.props.classes.root}>
    //
    //             </div>
    //         </DialogContent>
    //         <DialogActions>
    //             <Button onClick={console.log}
    //                     variant="contained" color="primary">Cancel</Button>
    //             <Button onClick={console.log} variant="contained"
    //                     color="primary">Update</Button>
    //         </DialogActions>
    //     </Dialog>
    // )
};


const mapStateToProps = state => ({
    errors: state.errors,
    success: state.success,
    teams: state.teamData.teams,
    schools: state.schoolData.schools,
    volunteers: state.volunteers.volunteers
});

export default connect(
    mapStateToProps,
)(TeamDialog);
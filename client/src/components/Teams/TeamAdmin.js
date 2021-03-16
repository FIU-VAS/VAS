import {blueGrey} from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import React, {Fragment} from "react";
import {TeamCard, TeamCardBody, TeamCardSubheading} from "./TeamCard";


export const TeamAdmin = (props) => {

    const {admins} = props;

    if (!admins) {
        return "Loading"
    }

    return (
        <TeamCard
            cardHeader="Administrators"
            headerColor={blueGrey[700]}
        >
            <TeamCardBody>
                Have any concerns or questions? You may contact any of the administrators listed
                below.
            </TeamCardBody>
            <Grid style={{
                paddingLeft: '15px',
                paddingTop: '10px',
                paddingRight: '15px',
                paddingBottom: '15px',
            }}>

                <TeamCardSubheading>
                    Admin contact information: &nbsp; <br/>
                </TeamCardSubheading>

                {admins.map(admin => {
                    return (
                        <Fragment>
                            <TeamCardBody>
                                &nbsp; &#8226; &nbsp; {admin.firstName + "  " + admin.lastName} <br/>
                            </TeamCardBody>
                            <TeamCardBody>
                                &nbsp; &nbsp; &nbsp; &#9702; &nbsp;{admin.phoneNumber} <br/>
                                &nbsp; &nbsp; &nbsp; &#9702; &nbsp;{admin.email} <br/>
                            </TeamCardBody>
                        </Fragment>
                    )
                })}
            </Grid>
        </TeamCard>
    )
}
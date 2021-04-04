import {grey} from "@material-ui/core/colors";
import React, {Fragment} from "react";
import {TeamCard, TeamCardBody, TeamCardSubheading} from "./TeamCard";



export const TeamPersonnel = (props) => {

    const {school, schoolPersonnel} = props;

    return (
        <TeamCard cardHeader="Your School" headerColor={grey[900]}>
            {/* Name */}
            <TeamCardSubheading>
                Name: &nbsp;
            </TeamCardSubheading>
            <TeamCardBody>
                {school.schoolName + " " + school.level}
            </TeamCardBody>

            {/* Adress */}
            <TeamCardSubheading>
                Address: &nbsp;
            </TeamCardSubheading>
            <TeamCardBody>
                {school.address + ",  " + school.city + ",  " + school.state + "   " + school.zipCode}
            </TeamCardBody>

            {/* Phone Number */}
            <TeamCardSubheading>
                Phone: &nbsp;
            </TeamCardSubheading>
            <TeamCardBody>
                {school.phoneNumber}
            </TeamCardBody>

            {/* Personnel */}
            <TeamCardSubheading>
                Personnel: &nbsp; <br/>
            </TeamCardSubheading>
            <TeamCardBody>
                School Personnel Details
            </TeamCardBody>
            <TeamCardBody>
                &nbsp; &#8226; &nbsp; { schoolPersonnel.firstName + "  " + schoolPersonnel.lastName + " - "}
            </TeamCardBody>
            <TeamCardBody>
                { schoolPersonnel.title } <br/>
            </TeamCardBody>
            <TeamCardBody>
                &nbsp; &nbsp; &nbsp; &#9702; &nbsp;{ schoolPersonnel.phoneNumber } <br/>
                &nbsp; &nbsp; &nbsp; &#9702; &nbsp;{ schoolPersonnel.email } <br/>
            </TeamCardBody>
        </TeamCard>
    )
}
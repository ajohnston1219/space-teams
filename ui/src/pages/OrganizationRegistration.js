import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import {
    Container,
    Segment,
    Header,
    Divider,
    Button
} from "semantic-ui-react";
import { registerOrganization } from "../actions/organization";
import OrganizationRegistrationForm from "../components/OrganizationRegistrationForm";

const OrganizationRegistration = () => {

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const competitionId = new URLSearchParams(location.search).get("competition_id");

    const loading = useSelector((state) => state.organization.createOrgLoading);

    const [formState, setFormState] = React.useState({
        name: "",
        contactFirstName: "",
        contactLastName: "",
        contactEmail: "",
        phoneNumber: "",
        address: "",
        city: "",
        zipCode: "",
        stateOrProvince: "",
        country: "",
    });

    return (
        <Segment className="form-background">
            <Container style={{ padding: "2rem 1rem" }}>
                <Header size="huge">Space Teams Organization Registration</Header>
                <Divider style={{ marginBottom: "2rem" }}/>
                <OrganizationRegistrationForm
                    formState={formState}
                    setFormState={setFormState}
                />
                <Divider style={{ marginTop: "2rem" }}/>
                <Button
                    primary
                    fluid
                    size="huge"
                    content="Register"
                    loading={loading}
                    onClick={() => dispatch(registerOrganization(formState, competitionId, history))}
                />
                <a
                    href="https://www.space-teams.com/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "block", marginTop: "3rem", textAlign: "center" }}
                >
                    Privacy Policy
                </a>
            </Container>
        </Segment>
    );
};

export default OrganizationRegistration;

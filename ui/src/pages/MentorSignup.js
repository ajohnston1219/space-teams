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
import { mentorSignup } from "../actions/user";
import MentorSignupForm from "../components/MentorSignupForm";

const MentorSignup = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const hash = new URLSearchParams(location.search).get("hash");

    const loading = useSelector((state) => state.user.loading);

    const [formState, setFormState] = React.useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zipCode: "",
        stateOrProvince: "",
        country: "",
        schoolOrOrganization: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    return (
        <Segment className="form-background">
            <Container style={{ padding: "2rem 1rem" }}>
                <Header size="huge">Space Teams Account Registration</Header>
                <Divider style={{ marginBottom: "2rem" }}/>
                <MentorSignupForm
                    formState={formState}
                    setFormState={setFormState}
                />
                <Divider style={{ marginTop: "2rem" }}/>
                <Button
                    primary
                    fluid
                    size="huge"
                    content="Sign Up"
                    loading={loading}
                    onClick={() => dispatch(mentorSignup(formState, hash, history))}
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

export default MentorSignup;

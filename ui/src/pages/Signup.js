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
import { signup } from "../actions/user";
import SignupForm from "../components/SignupForm";

const Signup = () => {

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const loading = useSelector((state) => state.user.loading);

    const registrationSource = new URLSearchParams(location.search).get("source");

    let competitionId = new URLSearchParams(location.search).get("competition_id");
    if (competitionId)
        localStorage.setItem("competition_id", competitionId);
    else
        competitionId = localStorage.getItem("competition_id");

    const [formState, setFormState] = React.useState({
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
                <SignupForm
                    registrationSource={registrationSource}
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
                    onClick={() => dispatch(signup(formState, registrationSource, competitionId, history))}
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

export default Signup;

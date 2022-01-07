import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    Container,
    Segment,
    Header,
    Divider,
    Button
} from "semantic-ui-react";
import { submitAccountInfo } from "../actions/user";
import AccountInfoForm from "../components/AccountInfoForm";

const AccountInfo = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const loading = useSelector((state) => state.user.loading);

    const [formState, setFormState] = React.useState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: isNaN(new Date(user.dateOfBirth)) ? new Date(user.dateOfBirth) : null,
        address: user.address || "",
        city: user.city || "",
        zipCode: user.zipCode || "",
        stateOrProvince: user.stateOrProvince || "",
        country: "",
        schoolOrOrganization: ""
    });

    return (
        <Segment className="form-background">
            <Container style={{ padding: "2rem 1rem" }}>
                <Header size="huge">Continue Space Teams Registration</Header>
                <small>Required fields marked with *</small>
                <Divider style={{ marginBottom: "2rem" }}/>
                <AccountInfoForm
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
                    onClick={() => dispatch(submitAccountInfo(formState, history))}
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

export default AccountInfo;

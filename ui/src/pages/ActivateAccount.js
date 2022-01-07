/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import {
    Container,
    Segment,
    Header,
    Divider,
    Button,
    Message,
    Loader
} from "semantic-ui-react";
import { activateAccount, getPartialUser, logout } from "../actions/user";
import SignupForm from "../components/SignupForm";
import { getTaggedErrors } from "../selectors/errors";
import { ErrorTag } from "../utils/enums";

const ActivateAccount = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const partialUser = useSelector((state) => state.user.partialUser);
    const loading = useSelector((state) => state.user.loading);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.SIGNUP));

    const competitionId = new URLSearchParams(location.search).get("competition_id");
    const hash = new URLSearchParams(location.search).get("hash");
    const email = new URLSearchParams(location.search).get("email");

    const [isLoading, setIsLoading] = React.useState(true);

    const [formState, setFormState] = React.useState({
        firstName: "",
        lastName: "",
        dateOfBirth: null,
        address: "",
        city: "",
        zipCode: "",
        stateOrProvince: "",
        country: "",
        schoolOrOrganization: "",
        username: "",
        email: email,
        password: "",
        confirmPassword: ""
    });

    if (user.loggedIn) {
        dispatch(logout());
    }

    React.useEffect(() => {
        if (!partialUser && !loading)
            dispatch(getPartialUser(email, hash));
    }, []);

    React.useEffect(() => {
        setTimeout(() => {
            if (isLoading && !loading) {
                setIsLoading(false);
            }
        }, 100);
    }, [loading]);

    React.useEffect(() => {
        if (partialUser) {
            const newState = {};
            Object.keys(formState).forEach(field => {
                if (partialUser[field]) {
                    if (field === "dateOfBirth") {
                        newState[field] = new Date(partialUser[field]);
                    } else {
                        newState[field] = partialUser[field];
                    }
                } else {
                    newState[field] = formState[field];
                }
            });
            setFormState(newState);
        }
    }, [partialUser]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <Loader />
            );
        }
        if (errors && errors.length && errors.some(e => e.status === 401)) {
            const msg = "The link you are trying to use is invalid. " +
                  "If you have already activated an account and forgot your password, " +
                  "click the 'Login' button above and click the 'Forgot Password' " +
                  "button. If you continue to have issues, please contact us at " +
                  "support@spacecraft-vr.com";
            return (
                <Message
                    header="Invalid Link"
                    content={msg}
                    error
                />
            );
        }
        return (
            <>
                <SignupForm
                    formState={formState}
                    setFormState={setFormState}
                />
                <Divider style={{ marginTop: "2rem" }}/>
                <Button
                    primary
                    fluid
                    size="huge"
                    content="Activate"
                    loading={loading}
                    onClick={() => dispatch(activateAccount(formState, hash, competitionId, history))}
                />
                <a
                    href="https://www.space-teams.com/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "block", marginTop: "3rem", textAlign: "center" }}
                >
                    Privacy Policy
                </a>
            </>
        );
    };

    return (
        <Segment className="form-background">
            <Container style={{ padding: "2rem 1rem" }}>
                <Header size="huge">Space Teams Account Activation</Header>
                <Divider style={{ marginBottom: "2rem" }}/>
                {renderContent()}
            </Container>
        </Segment>
    );
};

export default ActivateAccount;

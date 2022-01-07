import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ErrorTag } from "../utils/enums";
import { getFieldError, getFormError } from "../utils/formErrors";
import { login } from "../actions/user";
import {
    closeLoginModal,
    openResetPasswordModal,
    openSignupTypeModal
} from "../actions/ui";
import {
    Button,
    Divider,
    Form,
    Message,
    Grid,
    Segment
} from "semantic-ui-react";
import { getTaggedErrors } from "../selectors/errors";

const LoginForm = () => {

    const dispatch = useDispatch();

    const loading = useSelector((state) => state.user.loading);
    const resetPasswordLoading = useSelector((state) => state.user.resetPasswordLoading);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.LOGIN));

    const handleSignupClick = () => {
        dispatch(closeLoginModal());
        dispatch(openSignupTypeModal());
    };

    const [formState, setFormState] = React.useState({
        usernameOrEmail: "",
        password: ""
    });

    let err;

    return (
        <Segment placeholder
                 style={{ background: "none", border: "none" }}
        >
            <Grid columns={2} relaxed="very" stackable>
                <Grid.Column>
                    <Form error={getFormError(errors)} className="login-form">

                        <Form.Input
                            icon="user"
                            iconPosition="left"
                            label="Username or Email"
                            placeholder="Username or Email"
                            value={formState.usernameOrEmail}
                            onChange={({ target: { value } }) => setFormState(s => ({ ...s, usernameOrEmail: value }))}
                            error={(err = (getFieldError("username", errors) || getFieldError("email", errors))) && {
                                content: err,
                                pointing: "below"
                            }}
                        />
                        <Form.Input
                            icon="lock"
                            iconPosition="left"
                            label="Password"
                            placeholder="Password"
                            type="Password"
                            value={formState.password}
                            onChange={({ target: { value } }) => setFormState(s => ({ ...s, password: value }))}
                            error={(err = getFieldError("password", errors)) && {
                                content: err,
                                pointing: "below"
                            }}
                        />

                        <Message
                            error
                            header="Login Error"
                            content={getFormError(errors)}
                        />

                        <Button
                            primary
                            content="Login"
                            size="big"
                            onClick={() => dispatch(login(formState.usernameOrEmail, formState.password))}
                            loading={loading}
                            style={{ width: "100%" }}
                        />

                        <Button
                            secondary
                            content="Forgot Password"
                            onClick={() => dispatch(openResetPasswordModal())}
                            loading={resetPasswordLoading}
                            style={{ width: "100%", marginTop: "1rem" }}
                        />

                    </Form>
                </Grid.Column>

                <Divider className="login-divider--mobile">
                    Or
                </Divider>

                <Grid.Column verticalAlign="middle">
                    <Button
                        primary
                        content="Sign Up"
                        icon="signup"
                        size="big"
                        onClick={handleSignupClick}
                        style={{ width: "100%" }}
                    />
                </Grid.Column>
            </Grid>

            <Divider vertical className="login-divider">
                Or
            </Divider>
        </Segment>
    );
};

export default LoginForm;

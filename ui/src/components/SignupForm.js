import React from "react";
import { useSelector } from "react-redux";
import { ErrorTag } from "../utils/enums";
import { getFieldError, getFormError } from "../utils/formErrors";
import { getTaggedErrors } from "../selectors/errors";
import {
    Message,
    Form
} from "semantic-ui-react";

const SignupForm = ({
    formState,
    setFormState
}) => {

    const loading = useSelector((state) => state.user.loading);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.SIGNUP));

    let err;

    return (

        <Form error={!!getFormError(errors)} loading={loading}>

            <Form.Input
                icon="user"
                iconPosition="left"
                label="Create Username"
                placeholder="Create Username"
                value={formState.username}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, username: value }))}
                error={(err = getFieldError("username", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Input
                icon="mail"
                iconPosition="left"
                label="Email"
                placeholder="Email"
                value={formState.email}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, email: value }))}
                error={(err = getFieldError("email", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Input
                icon="lock"
                iconPosition="left"
                label="Create Password"
                placeholder="Create Password"
                type="Password"
                value={formState.password}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, password: value }))}
                error={(err = getFieldError("password", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Input
                icon="lock"
                iconPosition="left"
                label="Confirm Password"
                placeholder="Confirm Password"
                type="Password"
                value={formState.confirmPassword}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, confirmPassword: value }))}
                error={(err = getFieldError("confirmPassword", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />

            <Message
                error
                header="Signup Error"
                content={getFormError(errors)}
            />

        </Form>
    );

};

export default SignupForm;

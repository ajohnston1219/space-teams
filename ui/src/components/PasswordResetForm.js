import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { ErrorTag } from "../utils/enums";
import { getFieldError, getFormError } from "../utils/formErrors";
import { resetPassword } from "../actions/user";
import { getTaggedErrors } from "../selectors/errors";
import {
    Button,
    Message,
    Form
} from "semantic-ui-react";

const ResetPasswordForm = () => {

    let history = useHistory();
    const { key } = useParams();
    const dispatch = useDispatch();

    const loading = useSelector((state) => state.user.resetPasswordLoading);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.RESET_PASSWORD));

    const [formState, setFormState] = React.useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    let err;

    return (
        <Form error={getFormError(errors)} className="signup-form">

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
                header="Sign Up Error"
                content={getFormError(errors)}
            />

            <Button
                primary
                content="Reset Password"
                loading={loading}
                onClick={() => dispatch(resetPassword(formState, history, key))}
            />

        </Form>
    );

};

export default ResetPasswordForm;

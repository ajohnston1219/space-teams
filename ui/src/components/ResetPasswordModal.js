import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Form, Message, Button } from "semantic-ui-react";
import { ErrorTag } from "../utils/enums";
import { getFieldError, getFormError } from "../utils/formErrors";
import { getTaggedErrors } from "../selectors/errors";
import { sendPasswordResetLink } from "../actions/user";

const ResetPasswordModal = ({
    onOpen,
    onClose,
    trigger
}) => {

    const dispatch = useDispatch();

    const loading = useSelector((state) => state.user.loading);
    const open = useSelector((state) => state.ui.resetPasswordModalOpen);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.RESET_PASSWORD));

    const [formState, setFormState] = React.useState({
        email: ""
    });

    let err;

    return (
        <Modal
            open={open}
            onOpen={onOpen}
            onClose={onClose}
            trigger={trigger}
            className="login-modal"
        >
            <Modal.Header>Get Password Reset Link</Modal.Header>
            <Modal.Content>
                <Form error={getFormError(errors)} className="login-form">
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

                    <Message
                        error
                        header="Login Error"
                        content={getFormError(errors)}
                    />

                    <Button
                        primary
                        content="Send Link"
                        size="big"
                        onClick={() => dispatch(sendPasswordResetLink(formState.email))}
                        loading={loading}
                        style={{ width: "100%" }}
                    />

                </Form>
            </Modal.Content>
        </Modal>
    );
};

export default ResetPasswordModal;

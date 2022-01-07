import React from "react";
import {
    Form,
    Message
} from "semantic-ui-react";
import { getFieldError, getFormError } from "../utils/formErrors";

const ParentInfoForm = ({
    formState,
    setFormState,
    errors
}) => {
    let err;
    
    return (
        <Form error={!!getFormError(errors)}>
            <Form.Input
                label="First Name"
                placeholder="First Name"
                value={formState.firstName}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, firstName: value }))}
                error={(err = getFieldError("firstName", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Input
                label="Last Name"
                placeholder="Last Name"
                value={formState.lastName}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, lastName: value }))}
                error={(err = getFieldError("lastName", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Input
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
                label="Phone Number"
                placeholder="Phone Number"
                value={formState.phoneNumber}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, phoneNumber: value }))}
                error={(err = getFieldError("phoneNumber", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Message
                error
                header="Error"
                content={getFormError(errors)}
            />
        </Form>
    );
};

export default ParentInfoForm;

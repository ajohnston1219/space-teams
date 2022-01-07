import React from "react";
import { getFieldError, getFormError } from "../utils/formErrors";
import { Form } from "semantic-ui-react";

const CreateTeamForm = ({
    formState,
    setFormState,
    errors,
    loading
}) => {

    let err;

    return (
        <Form
          loading={loading}
          error={!!getFormError(errors)}
        >
          <Form.Input
            label="Team Name"
            placeholder="Team Name"
            value={formState.name}
            onChange={({ target: { value } }) => setFormState({ ...formState, name: value })}
            error={(err = getFieldError("name", errors)) && {
                content: err,
                pointing: "below"
            }}
          />
        </Form>
    );
};

export default CreateTeamForm;

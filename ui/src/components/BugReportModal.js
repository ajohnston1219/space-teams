import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Modal,
    Form,
    Message,
    TextArea,
    Button
} from "semantic-ui-react";
import {
    openBugReportModal,
    closeBugReportModal
} from "../actions/ui";
import { reportBug } from "../actions/errors";
import { getFieldError, getFormError } from "../utils/formErrors";
import { getTaggedErrors } from "../selectors/errors";
import { ErrorTag } from "../utils/enums";

const BugReportModal = () => {

    const dispatch = useDispatch();

    const open = useSelector((state) => state.ui.bugReportModalOpen);
    const loading = useSelector((state) => state.ui.bugReportLoading);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.BUG_REPORT));

    const [formState, setFormState] = React.useState("");

    let err;

    return (
        <Modal
            open={open}
            onOpen={() => dispatch(openBugReportModal())}
            onClose={() => dispatch(closeBugReportModal())}
        >
            <Modal.Header>Ask Us a Question or Report an Issue</Modal.Header>
            <Modal.Content>
                <Form
                    error={getFormError(errors)}
                >
                    <Form.Field
                        control={TextArea}
                        placeholder="How can we help you?"
                        value={formState}
                        onChange={(e, { value }) => setFormState(value)}
                        error={(err = getFieldError("message", errors)) && {
                            content: err,
                            poingint: "below"
                        }}
                    />
                    <Message
                        error
                        header="Error Submitting Bug (Yes, we see the irony)"
                        content={getFormError(errors)}
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    icon="close" content="Cancel"
                    onClick={() => dispatch(closeBugReportModal())}
                />
                <Button
                    primary icon="send" content="Submit"
                    onClick={() => dispatch(reportBug(formState))}
                    loading={loading}
                />
            </Modal.Actions>
        </Modal>
    );
};

export default BugReportModal;

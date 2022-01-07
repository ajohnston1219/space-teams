import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "semantic-ui-react";
import { closeSignupTypeModal } from "../actions/ui";

const SignupTypeModal = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const open = useSelector((state) => state.ui.signupTypeModalOpen);

    const handleIndividual = () => {
        history.push("/signup");
        dispatch(closeSignupTypeModal());
    };

    const handleOrg = () => {
        history.push("/organization-registration");
        dispatch(closeSignupTypeModal());
    };

    return (
        <Modal
            open={open}
            onClose={() => dispatch(closeSignupTypeModal())}
        >
            <Modal.Header>
                Signup Options
            </Modal.Header>
            <Modal.Content>
                Are you signing up as an individual or an organization?
            </Modal.Content>
            <Modal.Actions>
                <Button.Group
                    style={{ width: "100%" }}
                    size="huge"
                >
                    <Button
                        content="Individual"
                        onClick={handleIndividual}
                        primary
                    />
                    <Button.Or />
                    <Button
                        content="Organization"
                        onClick={handleOrg}
                        primary
                    />
                </Button.Group>
            </Modal.Actions>
        </Modal>
    );
};

export default SignupTypeModal;

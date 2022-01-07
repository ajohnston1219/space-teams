import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "semantic-ui-react";
import {
    openTeamInviteModal,
    openMentorInviteModal,
    closeTeamInviteTypeModal
} from "../actions/ui";

const TeamInviteTypeModal = () => {

    const dispatch = useDispatch();

    const open = useSelector((state) => state.ui.teamInviteTypeModalOpen);

    const handleTeammate = () => {
        dispatch(closeTeamInviteTypeModal());
        dispatch(openTeamInviteModal());
    };

    const handleMentor = () => {
        dispatch(closeTeamInviteTypeModal());
        dispatch(openMentorInviteModal());
    };

    return (
        <Modal
            open={open}
            onClose={() => dispatch(closeTeamInviteTypeModal())}
        >
            <Modal.Header>
                Invite Options
            </Modal.Header>
            <Modal.Content>
                Are you inviting a teammate or a mentor?
            </Modal.Content>
            <Modal.Actions>
                <Button.Group
                    style={{ width: "100%" }}
                    size="huge"
                >
                    <Button
                        content="Teammate"
                        onClick={handleTeammate}
                        primary
                    />
                    <Button.Or />
                    <Button
                        content="Mentor"
                        onClick={handleMentor}
                        primary
                    />
                </Button.Group>
            </Modal.Actions>
        </Modal>
    );
};

export default TeamInviteTypeModal;

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "semantic-ui-react";
import MentorInviteForm from "./MentorInviteForm";
import { closeMentorInviteModal } from "../actions/ui";
import { sendMentorInvite } from "../actions/teams";

const MentorInviteModal = () => {

    const dispatch = useDispatch();

    const invite = useSelector((state) => state.teams.invite);
    const open = useSelector((state) => state.ui.mentorInviteModalOpen);
    const loading = useSelector((state) => state.teams.inviteLoading);

    return (
        <Modal
            open={open}
            onClose={() => dispatch(closeMentorInviteModal())}
        >
            <Modal.Header>Invite Mentor</Modal.Header>
            <Modal.Content>
                <MentorInviteForm />
            </Modal.Content>
            <Modal.Actions>
                <Button
                    icon="close" content="Cancel"
                    onClick={() => dispatch(closeMentorInviteModal())}
                />
                <Button
                    primary icon="add user" content="Invite"
                    onClick={() => dispatch(sendMentorInvite(invite.email, invite.team))}
                    loading={loading}
                />
            </Modal.Actions>
        </Modal>
    );
}

export default MentorInviteModal;

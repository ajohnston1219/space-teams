/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "semantic-ui-react";
import { closeInviteToSimModal } from "../actions/ui";
import { getTeamMembers, sendSimInvite } from "../actions/teams";
import SimInviteForm from "./SimInviteForm";

const InviteToSimModal = () => {

    const dispatch = useDispatch();

    const open = useSelector((state) => state.ui.inviteToSimModalOpen);
    const invite = useSelector((state) => state.teams.simInvite);
    const teamMembers = useSelector((state) => state.teams.members);
    const loading = useSelector((state) => state.teams.simInviteLoading);
    const membersLoading = useSelector((state) => state.teams.membersLoading);

    React.useEffect(() => {
        if (open && !teamMembers && !membersLoading) {
            dispatch(getTeamMembers(invite.team));
        }
    }, [open, teamMembers, membersLoading]);

    const renderContent = () => {
        if (!teamMembers || membersLoading) {
            return "Loading...";
        }
        return <SimInviteForm />;
    };

    return (
        <Modal
            open={open}
            onClose={() => dispatch(closeInviteToSimModal())}
        >
            <Modal.Header>Invite User to Sim</Modal.Header>
            <Modal.Content>
                {renderContent()}
            </Modal.Content>
            <Modal.Actions>
                <Button
                    icon="close" content="Cancel"
                    onClick={() => dispatch(closeInviteToSimModal())}
                />
                <Button
                    primary icon="add user" content="Invite"
                    onClick={() => dispatch(sendSimInvite(invite))}
                    loading={loading}
                />
            </Modal.Actions>
        </Modal>
    );
}

export default InviteToSimModal;

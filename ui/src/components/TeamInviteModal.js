import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "semantic-ui-react";
import TeamInviteForm from "./TeamInviteForm";
import { setTeamInvite } from "../actions/teams";
import { sendTeamInvite } from "../actions/teams";
import { setInviteBy } from "../actions/teams";

const TeamInviteModal = ({
    open,
    onOpen,
    onClose,
    trigger
}) => {

    const dispatch = useDispatch();

    const invite = useSelector((state) => state.teams.invite);
    const loading = useSelector((state) => state.teams.inviteLoading);
    const inviteBy = useSelector((state) => state.teams.inviteBy);

    const handleSetInviteBy = value => {
        if (value === "email") {
            dispatch(setTeamInvite({ email: "", username: undefined }));
        } else if (value === "username") {
            dispatch(setTeamInvite({ username: "", email: undefined }));
        }
        dispatch(setInviteBy(value));
    };

    React.useEffect(() => {
        if (!open) {
            setInviteBy("");
        }
    }, [open]);

    return (
        <Modal
            open={open}
            onOpen={onOpen}
            onClose={onClose}
            trigger={trigger}
        >
            <Modal.Header>Invite</Modal.Header>
            <Modal.Content>
                <TeamInviteForm
                    inviteBy={inviteBy}
                    setInviteBy={handleSetInviteBy}
                    setTeamInvite={(invite) => dispatch(setTeamInvite(invite))}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button
                    icon="close" content="Cancel"
                    onClick={onClose}
                />
                <Button
                    primary icon="add user" content="Invite"
                    onClick={() => dispatch(sendTeamInvite(invite))}
                    loading={loading}
                />
            </Modal.Actions>
        </Modal>
    );
}

export default TeamInviteModal;

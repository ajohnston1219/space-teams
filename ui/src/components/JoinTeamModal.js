import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Message } from "semantic-ui-react";
import { joinTeam } from "../actions/teams";
import { openJoinTeamModal, closeJoinTeamModal } from "../actions/ui";
import { getTaggedErrors } from "../selectors/errors";
import { ErrorTag } from "../utils/enums";

const JoinTeamModal = () => {

    const dispatch = useDispatch();

    const teamName = useSelector((state) => state.teams.teamToJoin && state.teams.teamToJoin.name);
    const joinTeamLoading = useSelector((state) => state.teams.joinTeamLoading);
    const open = useSelector((state) => state.ui.joinTeamModalOpen);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.JOIN_TEAM));

    const paymentError = errors && errors.length && errors.find(err => err.status === 402);

    const renderContent = () => {
        if (paymentError) {
            return (
                <p>
                    You must first pay for this competition before joining a team.
                    You can pay by going to &nbsp;
                    <a href={paymentError.link}>{paymentError.link}</a>
                </p>
            );
        }
        return (
            <>
                <p>{`Do you want to join team the team '${teamName}'?`}</p>
                {errors && (
                    <Message negative>
                        <Message.Header>Error Joining Team</Message.Header>
                        {errors.map((e, i) => <p key={i}>{e.message}</p>)}
                    </Message>
                )}
            </>
        );
    };

    const renderButtons = () => {
        if (paymentError) {
            return (
                <Button
                    icon="close" content="Close"
                    onClick={() => dispatch(closeJoinTeamModal())}
                />
            );
        }
        return (
            <>
                <Button
                    icon="close" content="Cancel"
                    onClick={() => dispatch(closeJoinTeamModal())}
                />
                <Button
                    primary icon="plus" content="Join"
                    onClick={() => dispatch(joinTeam())}
                    loading={joinTeamLoading}
                />
            </>
        );
    };

    return (
        <Modal
            open={open}
            onOpen={() => dispatch(openJoinTeamModal())}
            onClose={() => dispatch(closeJoinTeamModal())}
        >
            <Modal.Header>Join Team</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    {renderContent()}
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                {renderButtons()}
            </Modal.Actions>
        </Modal>
    );
};

export default JoinTeamModal;

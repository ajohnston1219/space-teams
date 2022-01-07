import React from 'react'
import { useSelector, useDispatch } from "react-redux";

import { Modal, Button } from "semantic-ui-react";

import JoinCompetitionForm from './JoinCompetitionForm';

import { joinCompetition } from "../actions/competitions";

const JoinCompetitionModal = ({
    openJoinCompetitionModal,
    closeJoinCompetitionModal
}) => {

    const dispatch = useDispatch();

    const loading = useSelector((state) => state.competitions.loading);
    const open = useSelector((state) => state.ui.joinCompetitionModalOpen);

    const [selectedCompItem, setSelectedCompItem] = React.useState("");
    const [selectedTeamId, setSelectedTeamId] = React.useState("");

    const canJoin = selectedCompItem && selectedCompItem !== "" && selectedTeamId && selectedTeamId !== "";

    return (
        <>
            <Modal
                open={open}
                size="large"
                onOpen={() => dispatch(openJoinCompetitionModal())}
                onClose={() => dispatch(closeJoinCompetitionModal())}
            >
                <Modal.Header>Join Competition</Modal.Header>
                <Modal.Content>
                  <JoinCompetitionForm
                    selectedCompItem={selectedCompItem} 
                    setSelectedCompItem={setSelectedCompItem} 
                    setSelectedTeamId={setSelectedTeamId}
                  />
                </Modal.Content>
                <Modal.Actions style={{ marginTop: "-2rem" }}>
                    <Button
                        icon="close" content="Cancel"
                        onClick={() => dispatch(closeJoinCompetitionModal())}
                        disabled={loading}
                    />
                    <Button
                        primary icon="plus" content="Join"
                        onClick={() => dispatch(joinCompetition(selectedCompItem, selectedTeamId))}
                        disabled={!canJoin}
                        loading={loading}
                    />
                </Modal.Actions>
            </Modal>

        </>
    )
}

export default JoinCompetitionModal;

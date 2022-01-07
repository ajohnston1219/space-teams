/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "semantic-ui-react";
import { openScorecardModal, closeScorecardModal } from "../actions/ui";
import { getScorecard } from "../actions/competitions";

import Scorecard from "./Scorecard";

const ScorecardModal = () => {

    const dispatch = useDispatch();

    const open = useSelector((state) => state.ui.scorecardModalOpen);
    const activity = useSelector((state) => state.competitions.selectedActivity);
    const loading = useSelector((state) => state.competitions.loading);

    React.useEffect(() => {
        if (open && !activity.scorecard && !loading) {
            dispatch(getScorecard(activity.teamId, activity.id));
        }
    }, [open, loading, getScorecard, activity]);

    return (

        <Modal
            open={open}
            onOpen={() => dispatch(openScorecardModal())}
            onClose={() => dispatch(closeScorecardModal())}
        >
            <Modal.Header>{`${activity.name} Scorecard`}</Modal.Header>
            <Modal.Content>
                <Scorecard loading={loading} activity={activity}/>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    icon="close" content="Close"
                    onClick={() => dispatch(closeScorecardModal())}
                />
            </Modal.Actions>
        </Modal>
    );
};

export default ScorecardModal;

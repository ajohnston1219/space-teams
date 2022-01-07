/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "semantic-ui-react";
import { openScorecardComparisonModal, closeScorecardComparisonModal } from "../actions/ui";

import ScorecardComparison from "./ScorecardComparison";

const ScorecardComparisonModal = () => {

    const dispatch = useDispatch();

    const open = useSelector((state) => state.ui.scorecardComparisonModalOpen);
    const comparison = useSelector((state) => state.competitions.scorecardComparison);
    const loading = useSelector((state) => state.competitions.scorecardComparison.loading);

    return (

        <Modal
            open={open}
            onOpen={() => dispatch(openScorecardComparisonModal())}
            onClose={() => dispatch(closeScorecardComparisonModal())}
        >
            <Modal.Header>{`${comparison.activityName} Scorecard`}</Modal.Header>
            <Modal.Content>
                <ScorecardComparison
                    myScorecard={comparison.myScorecard}
                    theirScorecard={comparison.theirScorecard}
                    loading={loading}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button
                    icon="close" content="Close"
                    onClick={() => dispatch(closeScorecardComparisonModal())}
                />
            </Modal.Actions>
        </Modal>
    );
};

export default ScorecardComparisonModal;

import React from "react";
import CompetitionItem from "./CompetitionItem";
import { useSelector } from "react-redux";
import { Modal } from "semantic-ui-react";

const CompetitionInfoModal = ({
    onClose
}) => {

    const competitionInfo = useSelector((state) => state.competitions.selectedCompetitionInfo);
    const open = useSelector((state) => state.ui.competitionInfoModalOpen);

    return (
        <Modal
            open={open}
            header="Competition Info"
            content={
                <CompetitionItem
                    competition={competitionInfo}
                    descriptionOnly
                />
            }
            actions={["Done"]}
            onClose={onClose}
        />
    );
};

export default CompetitionInfoModal;

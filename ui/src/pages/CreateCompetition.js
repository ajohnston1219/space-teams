import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ErrorTag } from "../utils/enums";
import { getTaggedErrors } from "../selectors/errors";
import { setCompetitionToCreate } from "../actions/competitions";
import { Card } from "semantic-ui-react";
import CompetitionForm from "../components/CompetitionForm";

const CreateCompetition = () => {

    const dispatch = useDispatch();

    const competition = useSelector((state) => state.competitions.competitionToCreate);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.COMPETITIONS));

    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>Create Competition</Card.Header>
            </Card.Content>
            <Card.Content>
                <CompetitionForm
                    competition={competition}
                    setCompetition={() => dispatch(setCompetitionToCreate())}
                    errors={errors}
                />
            </Card.Content>
        </Card>
    )
};

export default CreateCompetition;

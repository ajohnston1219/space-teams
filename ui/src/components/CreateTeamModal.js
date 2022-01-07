/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Icon, Grid, Message } from "semantic-ui-react";
import JoinCompetitionForm from './JoinCompetitionForm';
import { createTeam, setTeamToCreate, clearTeamToCreate } from "../actions/teams";
import { getAllActiveCompetitions } from "../actions/competitions";
import { getTaggedErrors } from "../selectors/errors";
import { ErrorTag } from "../utils/enums";

const leagueSelector = comps => {
    let leagues = [];
    if (!comps)
        return leagues;
    comps.forEach(c => { leagues = [ ...leagues, ...c.leagues ]; });
    return leagues;
};

const CreateTeamModal = ({
    open,
    onOpen,
    onClose,
    trigger
}) => {

    const dispatch = useDispatch();

    const teamToCreate = useSelector((state) => state.teams.teamToCreate);
    const leagues = useSelector((state) => leagueSelector(state.competitions.activeComps));
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.CREATE_TEAM));

    React.useEffect(() => {
        dispatch(getAllActiveCompetitions());
    }, []);

    const renderButton = () => {
        return (
            <Button
                primary
                onClick={() => dispatch(createTeam(teamToCreate))}
                disabled={teamToCreate.league === ""}
            >
                <Icon name="plus"/>
                Create
            </Button>
        );
    };

    const setSelectedCompetition = id =>
          dispatch(setTeamToCreate({ ...teamToCreate, competitionId: id, league: "" }));
    const setTeamName = name => dispatch(setTeamToCreate({ ...teamToCreate, name }));
    const setSelectedLeague = league => dispatch(setTeamToCreate({ ...teamToCreate, league }));
    const getLeagueOptions = () => leagues
          .filter(l => l.competitionId === teamToCreate.competitionId)
          .map(l => ({
              key: l.id,
              value: l.name,
              text: l.name
          }));

    const renderForm = () => {
        return (
            <JoinCompetitionForm
                selectedCompItem={teamToCreate.competitionId}
                setSelectedCompItem={setSelectedCompetition}
                teamName={teamToCreate.name}
                setTeamName={setTeamName}
                leagueOptions={getLeagueOptions()}
                selectedLeague={teamToCreate.league}
                setSelectedLeague={setSelectedLeague}
            />
        );
    };

    const handleClose = () => {
        dispatch(clearTeamToCreate());
        onClose();
    };

    return (

        <Modal
            open={open}
            onOpen={onOpen}
            onClose={handleClose}
            trigger={trigger}
        >
            <Modal.Header>
                <Grid>
                    <Grid.Column width={12}>
                        Create Team
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Button
                            icon="close"
                            onClick={handleClose}
                            floated="right"
                        />
                    </Grid.Column>
                </Grid>
            </Modal.Header>
            <Modal.Content>
                {renderForm()}
                {!!errors && (
                    <Message
                        error
                        header="Create Team"
                        content={errors[0].message || "Unknown error"}
                    />
                )}
            </Modal.Content>
            <Modal.Actions>
                {renderButton()}
            </Modal.Actions>
        </Modal>
    );
};

export default CreateTeamModal;

/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Header, Dropdown, Form, Button } from "semantic-ui-react";
import {
    openCompetitionInfoModal,
    closeCompetitionInfoModal,
    openCreateTeamModal,
    closeCreateTeamModal,
} from "../actions/ui";
import { getFieldError } from "../utils/formErrors";
import { getTaggedErrors } from "../selectors/errors";
import { ErrorTag } from "../utils/enums";

const JoinCompetitionForm = ({
    selectedCompItem,
    teamName,
    setTeamName,
    setSelectedCompItem,
    leagueOptions,
    selectedLeague,
    setSelectedLeague,
}) => {

    const dispatch = useDispatch();

    const userCompetitions = useSelector((state) => state.competitions.userComps);
    const compsLoading = useSelector((state) => state.competitions.loading);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.JOIN_COMPETITION));

    let err;

    const comps = userCompetitions.filter(c => !c.teamId || !c.teamIsActive);

    const closeCompInfo = () => {
        dispatch(closeCompetitionInfoModal());
        dispatch(openCreateTeamModal());
    };

    const openCompInfo = (id) => {
        dispatch(closeCreateTeamModal(true));
        dispatch(openCompetitionInfoModal(id, () => closeCompInfo()));
    };

    if (comps.length === 0) {
        return "No active competitions to join.";
    }
    const compOptions = (comps && comps.length) ? comps
          .map(c => ({
              key: c.id, text: c.name, value: c.id,
              content: (
                  <div>
                      <Header content={c.name} style={{ display: "inline" }}/>
                      <Button
                          as="a"
                          content="More Info" 
                          onClick={() => openCompInfo(c.id)}
                          style={{ float: "right" }}
                      >
                          More Info
                      </Button>
                  </div>
              )
          }))
          : [];

    return (
        <Form>
            <Form.Input
                label="Team Name"
                placeholder="Team Name"
                value={teamName}
                onChange={({ target: { value } }) => setTeamName(value)}
                error={(err = getFieldError("name", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Field>
                <label>Competition</label>
                <Dropdown
                    placeholder={
                        compsLoading
                            ? "Loading..."
                            : "Select Competition"
                    }
                    search
                    selection
                    fluid
                    options={compOptions}
                    value={selectedCompItem}
                    onChange={(e, { value }) => setSelectedCompItem(value)}
                    error={(err = getFieldError("competitionId", errors)) && {
                        content: err,
                        pointing: "below"
                    }}
                />
            </Form.Field>
            <Form.Field>
                <label>League</label>
                <Dropdown
                    placeholder="Select League"
                    fluid
                    selection
                    options={leagueOptions}
                    onChange={(e, { value }) => setSelectedLeague(value)}
                    value={selectedLeague}
                />
            </Form.Field>
        </Form>
    );
};

export default JoinCompetitionForm;

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";
import { openTeamInviteModal } from "../actions/ui";
import { setTeamInvite } from "../actions/teams";

const ChatTeamInviteButton = ({ username }) => {

    const dispatch = useDispatch();

    const team = useSelector((state) => {
        const comp = state.competitions.currentCompetition;
        return state.teams.list.find(t => comp && t.competitionId === comp.id);
    });

    const openInvite = () => {
        dispatch(setTeamInvite({
            username,
            team: team.id
        }));
        dispatch(openTeamInviteModal());
    };

    return (
        <Button
            icon="plus"
            disabled={!team}
            onClick={openInvite}
            floated="right"
            size="tiny"
            compact
            style={{
                marginLeft: "1rem"
            }}
            content="Invite to Team"
        />
    );
};

export default ChatTeamInviteButton;

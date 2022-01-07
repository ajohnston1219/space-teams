import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Item, List, Button, Popup } from "semantic-ui-react";
import { setTeamInvite } from "../actions/teams";
import {
    openConfirmation,
    openTeamInviteTypeModal,
    openInviteToSimModal
} from "../actions/ui";
import { UserType, TeamRole } from "../utils/enums";
import {
    deleteTeamConfirmation,
    leaveTeamConfirmation
} from "../utils/confirmations";

const TeamItem = ({
    team,
    noButtons
}) => {

    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const competitions = useSelector((state) => {
        if (user.type === UserType.ADMIN) {
            return state.competitions.activeComps;
        } else {
            return state.competitions.userComps.filter(c => c.teamIsActive)
        }
    });

    const handleInviteClick = team => {
        dispatch(setTeamInvite({ team }));
        dispatch(openTeamInviteTypeModal());
    };

    const { members, mentors } = team;
    const me = members.find(m => m.id === user.id);

    const comp = competitions.find(c => c.id === team.competitionId);

    const renderButtons = () => {
        if (comp && !comp.allowTeamModifications) {
            return (
                <Popup
                    content="Team modification has been disabled for this competition"
                    trigger={
                        <Button.Group vertical floated="right">
                            <Button
                                primary icon="add user" content="Invite"
                                onClick={() => handleInviteClick(team.id)}
                                disabled
                            />
                            {me && me.role === TeamRole.OWNER
                             ? (
                                 <Button
                                     icon="close" content="Delete" color="red"
                                     onClick={() => openConfirmation(deleteTeamConfirmation(team))}
                                     disabled
                                 />
                             ) : (
                                 <Button
                                     icon="sign out" content="Leave &nbsp;" color="red"
                                     onClick={() => openConfirmation(leaveTeamConfirmation(team))}
                                     disabled
                                 />
                             )}
                        </Button.Group>
                    }
                />
            );
        }

        return (
            <Button.Group vertical floated="right">
                <Button
                    primary icon="add user" content="Invite"
                    onClick={() => handleInviteClick(team.id)}
                />
                {me && me.role === TeamRole.OWNER
                 ? (
                     <Button
                         icon="close" content="Delete" color="red"
                         onClick={() => dispatch(openConfirmation(deleteTeamConfirmation(team)))}
                     />
                 ) : (
                     <Button
                         icon="sign out" content="Leave &nbsp;" color="red"
                         onClick={() => dispatch(openConfirmation(leaveTeamConfirmation(team)))}
                     />
                 )}
            </Button.Group>
        );
    };

    return (
        <>
            <Item>
                <Item.Content>
                    <Item.Header>{team.name}</Item.Header>
                    <Item.Meta>{comp && "Competition: " + comp.name}</Item.Meta>
                    <Item.Meta>{"League: " + team.league}</Item.Meta>
                    <Item.Description>
                        <h4>Members</h4>
                        <List>
                            {
                                team.members.map(m => (
                                    <List.Item
                                        key={m.id}
                                    >
                                        <List.Icon name="user"/>
                                        <List.Content>{m.username}</List.Content>
                                    </List.Item>
                                ))
                            }
                        </List>
                        {team.mentors && (
                            <>
                                <h4>Mentors</h4>
                                <List>
                                    {
                                        team.mentors.filter(m => !!m.username).map(m => (
                                            <List.Item
                                                key={m.id}
                                            >
                                                <List.Icon name="user"/>
                                                <List.Content>{m.username}</List.Content>
                                            </List.Item>
                                        ))
                                    }
                                </List>
                            </>
                        )}
                    </Item.Description>
                </Item.Content>
                {!noButtons && (
                    <Item.Content>
                        {renderButtons()}
                    </Item.Content>)}
            </Item>
            {!noButtons && (
                <div style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
                    <Button
                        primary fluid
                        icon="mail"
                        content="Send Sim Invite"
                        onClick={() => dispatch(openInviteToSimModal(team.id))}
                    />
                </div>)}
        </>
    );
};

export default TeamItem;

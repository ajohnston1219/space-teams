import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ErrorTag } from "../utils/enums";
import {
    Card,
    Message,
    Item,
    Loader,
    Button
} from "semantic-ui-react";
import TeamItem from "./TeamItem";
import { openCreateTeamModal, openConfirmation } from "../actions/ui";
import {
    handleNotificationClick
} from "../actions/notifications";
import { getTaggedErrors } from "../selectors/errors";
import { getTeamInvites } from "../selectors/teams";
import { declineInviteConfirmation } from "../utils/confirmations";
import { PARENT_CONSENT_AGE } from "../utils/constants"
import { UserType } from "../utils/enums"

const TeamList = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const teams = useSelector((state) => state.teams.list);
    const loading = useSelector((state) => state.teams.loading);
    const competitions = useSelector((state) => state.competitions);
    const invites = useSelector((state) => getTeamInvites(state.notifications));
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.TEAMS));

    const handleDeclineInviteClick = invite => {
        dispatch(openConfirmation(declineInviteConfirmation(invite)));
    };

    const inviteMessage = invite => (
        <Message key={invite.teamName}>
            <Message.Header>You've got an invite!</Message.Header>
            <p>{`You've been invited to join the team '${invite.teamName}'.`}</p>
            <Button.Group>
                <Button
                    content="Accept" color="green"
                    onClick={() => dispatch(handleNotificationClick(invite))}
                />
                <Button
                    content="Decline" color="red"
                    onClick={() => dispatch(handleDeclineInviteClick(invite))}
                />
            </Button.Group>
        </Message>
    );

    const renderContent = (teams, loading) => {
        if (loading) {
            return (
                <Loader className="card-loader" active/>
            );
        }

        if (errors) {
            return (
                <Message negative>
                    <Message.Header>Oops! We had trouble getting your teams.</Message.Header>
                    {errors.map(e => <p>{e.message}</p>)}
                </Message>
            );
        }

        if (teams.length === 0) {
            if (invites && invites.length !== 0) {
                return (
                    <React.Fragment>
                        {invites.map(inviteMessage)}
                    </React.Fragment>
                );
            }
            if (user.age < PARENT_CONSENT_AGE && !user.parent) {
                return (
                    <Message>
                        <Message.Header>
                            Looks like you haven't finished your registration
                        </Message.Header>
                        <p>
                            Click "Enter Parent Info" below to update your parent
                            or legal guardian's contact info.
                        </p>
                    </Message>
                );
            }
            if (competitions.userComps.length === 0) {
                if (user.type === UserType.MENTOR) {
                    return (
                        <Message>
                            <Message.Header>
                                Looks like you're not on any teams yet.
                            </Message.Header>
                            <p>
                                Have a student invite you to their team as a mentor,
                                and once they do their team will show up here and you
                                can join them inside the application.
                            </p>
                        </Message>
                    );
                }
                return (
                    <Message>
                        <Message.Header>
                            Looks like you're not registered for any competitions yet.
                        </Message.Header>
                        <p>Click "Register" below to register for a competition</p>
                    </Message>
                );
            }
            return (
                <Message>
                    {/* <Message.Header> */}
                    {/*     You'll be able to create or join a team here closer */}
                    {/*     to the competition start date. We will send you an email */}
                    {/*     when this is available. */}
                    {/* </Message.Header> */}
                    <Message.Header>Looks like you're not on a team yet</Message.Header>
                    <p>Click "Create Team" below to create your own team</p>
                </Message>
            );
        }

        return (
            <Item.Group divided>
                {teams.map(t => <TeamItem key={t.id} team={t}/>)}
            </Item.Group>
        );
    };

    const renderButton = () => {
        if (loading) {
            return <Button primary loading content="Loading"/>;
        }
        if (user.age < PARENT_CONSENT_AGE && !user.parent) {
            return (
                <Button
                    primary
                    onClick={() => history.push("/parent-info")}
                >
                    Enter Parent Info
                </Button>
            );
        }
        if (competitions.userComps.length === 0 && user.type === UserType.USER) {
            return (
                <Button
                    primary
                    onClick={() => history.push("/competition-registration")}
                >
                    Register
                </Button>
            );
        }
        return (
            <Button
                primary
                onClick={() => dispatch(openCreateTeamModal())}
                disabled={user.type === UserType.MENTOR}
            >
                Create Team
            </Button>
        );
    };

    return (
        <Card className="dashboard-card" centered>
            <Card.Content>
                <Card.Header>Teams</Card.Header>
            </Card.Content>
            <Card.Content>
                {renderContent(teams, loading)}
            </Card.Content>
            {teams.length !== 0 && invites && invites.length !== 0 && (
                <Card.Content>
                    {invites.map(inviteMessage)}
                </Card.Content>
            )}
            <Card.Content extra>
                {renderButton()}
            </Card.Content>
        </Card>
    );
};

export default TeamList;

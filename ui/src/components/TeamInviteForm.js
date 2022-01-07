import React from "react";
import { useSelector } from "react-redux";
import {
    Segment,
    Divider,
    Form,
    Dropdown,
    Message,
    Label
} from "semantic-ui-react";
import { ErrorTag } from "../utils/enums";
import { getTaggedErrors } from "../selectors/errors";
import { getFormError, getFieldError } from "../utils/formErrors";
import UserSearch from "./UserSearch";

const TeamInviteForm = ({
    setTeamInvite,
    inviteBy,
    setInviteBy
}) => {

    const invite = useSelector((state) => state.teams.invite);
    const teams = useSelector((state) => state.teams.list);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.TEAM_INVITE));

    let err;

    const inviteByOpts = [
        { key: "username", text: "Username", value: "username" },
        { key: "email", text: "Email", value: "email" }
    ];

    const renderInviteByField = () => {
        if (inviteBy === "username") {
            return (
                <Form.Field
                    error={(err = getFieldError("username", errors))}
                >
                    <label>Username</label>
                    <UserSearch
                        onChange={username => setTeamInvite({ username: username })}
                        onResultSelect={r => setTeamInvite({ username: r.username })}
                        initialValue={invite.username || ""}
                    />
                    {err && <Label pointing prompt>{err}</Label>}
                </Form.Field>
            );
        }
        return (
            <Form.Input
                error={(err = getFieldError("email", errors))}
                label="Email"
                placeholder="Email"
                value={invite.email}
                onChange={({ target: { value } }) => setTeamInvite({ email: value })}
            />
        );
    };

    const renderForm = () => {
        if (!inviteBy) {
            return (
                <Segment padded basic>
                </Segment>
            );
        }
        return (
            <>
                <Segment padded basic>
                    {renderInviteByField()}
                </Segment>

                <Divider horizontal>To Join</Divider>

                <Segment padded basic>
                    <Form.Field
                        error={(err = getFieldError("team", errors))}
                    >
                        <label>Team</label>
                        <Dropdown
                            selection
                            placeholder="Select Team"
                            options={teams.map(t => ({
                                key: t.id,
                                text: t.name,
                                value: t.id
                            }))}
                            value={invite.team}
                            onChange={(e, { value }) => setTeamInvite({ team: value })}
                        />
                        {err && <Label pointing prompt>{err}</Label>}
                    </Form.Field>
                </Segment>
            </>
        );
    }
    

    return (
        <Form error={getFormError(errors)}>

            <Segment padded basic>
                <Form.Field>
                    <label>Invite By</label>
                    <Dropdown
                        selection
                        placeholder="Select One"
                        options={inviteByOpts}
                        value={inviteBy}
                        onChange={(e, { value }) => setInviteBy(value)}
                    />
                </Form.Field>
            </Segment>

            {renderForm()}

            <Message
                error
                header="Send Invite"
                content={getFormError(errors)}
            />

        </Form>
    );
};

export default TeamInviteForm;

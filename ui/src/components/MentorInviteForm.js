import React from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { setTeamInvite } from "../actions/teams";

const MentorInviteForm = () => {

    const dispatch = useDispatch();

    const invite = useSelector((state) => state.teams.invite);
    const teams = useSelector((state) => state.teams.list);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.MENTOR_INVITE));

    let err;

    const renderForm = () => {
        return (
            <>
                <Segment padded basic>
                    <Form.Input
                        error={(err = getFieldError("email", errors))}
                        label="Email"
                        placeholder="Email"
                        value={invite.email}
                        onChange={({ target: { value } }) => dispatch(setTeamInvite({ email: value }))}
                    />
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
                            onChange={(e, { value }) => dispatch(setTeamInvite({ team: value }))}
                        />
                        {err && <Label pointing prompt>{err}</Label>}
                    </Form.Field>
                </Segment>
            </>
        );
    }
    

    return (
        <Form error={getFormError(errors)}>

            {renderForm()}

            <Message
                error
                header="Send Invite"
                content={getFormError(errors)}
            />

        </Form>
    );
};

export default MentorInviteForm;

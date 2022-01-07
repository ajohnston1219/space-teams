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
import { ErrorTag, ActivityName } from "../utils/enums";
import { getTaggedErrors } from "../selectors/errors";
import { getFormError, getFieldError } from "../utils/formErrors";
import { setSimInvite } from "../actions/teams";

const SimInviteForm = () => {

    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const invite = useSelector((state) => state.teams.simInvite);
    const teamMembers = useSelector((state) => state.teams.members);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.SIM_INVITE));

    let err;

    const renderForm = () => {
        return (
            <>
                <Segment padded basic>
                    <Form.Field>
                        <label>Members</label>
                        <Dropdown
                            selection
                            multiple
                            placeholder="Select Users to Invite"
                            options={teamMembers.members
                                     .filter(m => m.id !== user.id)
                                     .map(tm => ({
                                         key: tm.id,
                                         text: tm.username,
                                         value: tm.id
                                     }))}
                            value={invite.usersToInvite}
                            onChange={(e, { value }) => dispatch(setSimInvite({ usersToInvite: value }))}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Mentors</label>
                        <Dropdown
                            selection
                            multiple
                            placeholder="Select Mentors to Invite"
                            options={teamMembers.mentors
                                     .filter(m => m.id !== user.id)
                                     .map(tm => ({
                                         key: tm.id,
                                         text: tm.username,
                                         value: tm.id
                                     }))}
                            value={invite.mentorsToInvite}
                            onChange={(e, { value }) => dispatch(setSimInvite({ mentorsToInvite: value }))}
                        />
                    </Form.Field>
                </Segment>

                <Divider horizontal>To Join a Sim in Activity</Divider>

                <Segment padded basic>
                    <Form.Field
                        error={(err = getFieldError("activityName", errors))}
                    >
                        <label>Activity</label>
                        <Dropdown
                            selection
                            placeholder="Select Activity"
                            options={Object.keys(ActivityName).map(k => ({
                                key: k,
                                text: ActivityName[k],
                                value: ActivityName[k]
                            }))}
                            value={invite.activityName}
                            onChange={(e, { value }) => dispatch(setSimInvite({ activityName: value }))}
                        />
                        {err && err.field === "activityName" && <Label pointing prompt>{err}</Label>}
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
                header="Send Sim Invite"
                content={getFormError(errors)}
            />

        </Form>
    );
};

export default SimInviteForm;

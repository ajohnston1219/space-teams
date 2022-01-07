import React from "react";
import { useSelector } from "react-redux";
import { ErrorTag } from "../utils/enums";
import { getFieldError, getFormError } from "../utils/formErrors";
import { Form, Message, Dropdown } from "semantic-ui-react";
import { getTaggedErrors } from "../selectors/errors";
import { Audience, AnnouncementType } from "../utils/enums";

const errorSelector = (errors) => [
    ...(getTaggedErrors(errors, ErrorTag.ADD_ANNOUNCEMENT) || []),
    ...(getTaggedErrors(errors, ErrorTag.USER_SEARCH) || []),
    ...(getTaggedErrors(errors, ErrorTag.COMPETITIONS) || []),
    ...(getTaggedErrors(errors, ErrorTag.TEAMS) || [])
];

const CreateAnnouncementForm = ({
    formState,
    setFormState
}) => {

    const teams = useSelector((state) => state.teams.list);
    const teamsLoading = useSelector((state) => state.teams.loading);
    const competitions = useSelector((state) => state.competitions.activeComps);
    const competitionsLoading = useSelector((state) => state.competitions.loading);
    const users = useSelector((state) => state.user.allUsers.list);
    const usersLoading = useSelector((state) => state.user.allUsers.loading);
    const errors = useSelector((state) => errorSelector(state.errors));

    const initFormState = () => {
        if (formState.audience === Audience.GLOBAL) {
            setFormState(s => ({ ...s, teamId: "", competitionId: "", userId: "" }));
        } else if (formState.audience === Audience.TEAM) {
            setFormState(s => ({ ...s, competitionId: "", userId: "" }));
        } else if (formState.audience === Audience.COMPETITION) {
            setFormState(s => ({ ...s, teamId: "", userId: "" }));
        } else if (formState.audience === Audience.USER) {
            setFormState(s => ({ ...s, teamId: "", competitionId: "" }));
        }
    };

    React.useEffect(() => {
        initFormState();
    }, []);

    let err;

    const typeOptions = [
        { key: AnnouncementType.REGULAR, text: "Regular", value: AnnouncementType.REGULAR },
        { key: AnnouncementType.IMPORTANT, text: "Important", value: AnnouncementType.IMPORTANT },
        { key: AnnouncementType.WARNING, text: "Warning", value: AnnouncementType.WARNING }
    ];

    const audienceOptions = [
        { key: Audience.GLOBAL, text: "Global", value: Audience.GLOBAL },
        { key: Audience.COMPETITION, text: "Competition", value: Audience.COMPETITION},
        { key: Audience.TEAM, text: "Team", value: Audience.TEAM },
        { key: Audience.USER, text: "User", value: Audience.USER }
    ];

    const teamOptions = (teams && teams.length)
          ? teams.map(t => ({ key: t.id, text: t.name, value: t.id }))
          : [];

    const compOptions = (competitions && competitions.length)
          ? competitions.map(c => ({ key: c.id, text: c.name, value: c.id }))
          : [];

    const userOptions = (users && users.length)
          ? users.map(u => ({ key: u.id, text: u.username, value: u.id }))
          : [];

    const renderAudienceSelector = (formState, errors) => {
        if (formState.audience === Audience.GLOBAL) {
            return null;
        } else if (formState.audience === Audience.TEAM) {
            return (
                <Form.Field>
                    <label>Select Team</label>
                    <Dropdown
                        placeholder={
                            teamsLoading
                                ? "Loading..."
                                : (teams.length ? "Select Team" : "No Teams Found")
                        }
                        search
                        selection
                        fluid
                        options={teamOptions}
                        value={formState.teamId}
                        onChange={(e, { value }) => setFormState(s => ({ ...s, teamId: value }))}
                        error={(err = getFieldError("teamId", errors)) && {
                            content: err,
                            pointing: "below"
                        }}
                    />
                </Form.Field>
            );
        } else if (formState.audience === Audience.COMPETITION) {
            return (
                <Form.Field>
                    <label>Select Competition</label>
                    <Dropdown
                        placeholder={
                            competitionsLoading
                                ? "Loading..."
                                : (competitions.length ? "Select Competition" : "No Competitions Found")
                        }
                        search
                        selection
                        fluid
                        options={compOptions}
                        value={formState.competitionId}
                        onChange={(e, { value }) => setFormState(s => ({ ...s, competitionId: value }))}
                        error={(err = getFieldError("competitionId", errors)) && {
                            content: err,
                            pointing: "below"
                        }}
                    />
                </Form.Field>
            );
        } else if (formState.audience === Audience.USER) {
            return (
                <Form.Field>
                    <label>Select User</label>
                    <Dropdown
                        placeholder={
                            usersLoading
                                ? "Loading..."
                                : (users.length ? "Select User" : "No Users Found")
                        }
                        search
                        selection
                        fluid
                        options={userOptions}
                        value={formState.userId}
                        onChange={(e, { value }) => setFormState(s => ({ ...s, userId: value }))}
                        error={(err = getFieldError("userId", errors)) && {
                            content: err,
                            pointing: "below"
                        }}
                    />
                </Form.Field>
            );
        }
    };

    return (
        <Form
            error={!!getFormError(errors)}
        >
            <Form.Input
                label="Title"
                placeholder="Title"
                value={formState.title}
                onChange={(e, { value }) => setFormState(s => ({ ...s, title: value }))}
                error={(err = getFieldError("title", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />

            <Form.TextArea
                label="Content"
                placeholder="Content"
                value={formState.content}
                onChange={(e, { value }) => setFormState(s => ({ ...s, content: value }))}
                error={(err = getFieldError("content", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />

            <Form.Select
                label="Type"
                options={typeOptions}
                placeholder="Type"
                value={formState.type}
                onChange={(e, { value }) => setFormState(s => ({ ...s, type: value }))}
                error={(err = getFieldError("type", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />

            <Form.Select
                label="Audience"
                options={audienceOptions}
                placeholder="Audience"
                value={formState.audience}
                onChange={(e, { value }) => setFormState(s => ({ ...s, audience: value }))}
                error={(err = getFieldError("audience", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />

            {renderAudienceSelector(formState, errors, err)}

            <Message
                error
                header="Add Announcement"
                content={getFormError(errors)}
            />

        </Form>
    );
};

export default CreateAnnouncementForm;

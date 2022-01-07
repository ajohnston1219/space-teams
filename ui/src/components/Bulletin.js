/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Message } from "semantic-ui-react";
import { getAnnouncements } from "../actions/messages";
import { getTaggedErrors } from "../selectors/errors";
import { ErrorTag } from "../utils/enums";

const renderMessageContent = m => (
    <React.Fragment>
      <Message.Header>{m.title}</Message.Header>
      <p>{m.content}</p>
    </React.Fragment>
);

const renderMessage = m => {
    switch (m.type) {
        case "REGULAR":
            return <Message>{renderMessageContent(m)}</Message>;
        case "IMPORTANT":
            return <Message info>{renderMessageContent(m)}</Message>;
        case "SUCCESS":
            return <Message success>{renderMessageContent(m)}</Message>;
        case "WARNING":
            return <Message color="yellow">{renderMessageContent(m)}</Message>;
        case "ERROR":
            return <Message error>{renderMessageContent(m)}</Message>;
        default:
            return <Message>{renderMessageContent(m)}</Message>;
    }
};

const Bulletin = () => {

    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const { loggedIn } = user;
    const announcements = useSelector((state) => state.messages.announcements.list);
    const loading = useSelector((state) => state.messages.announcements.loading);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.ANNOUNCEMENTS));

    React.useEffect(() => {
        if (loggedIn)
            dispatch(getAnnouncements());
    }, [loggedIn, getAnnouncements]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (loggedIn && !errors && !loading)
                getAnnouncements();
        }, 10000);

        if (errors)
            clearInterval(interval);

        return () => clearInterval(interval);
    }, [getAnnouncements, announcements, loggedIn, loading, errors]);

    if (announcements && announcements.sort) {
        announcements.sort((a, b) => {
            const aTime = new Date(a.createdAt);
            const bTime = new Date(b.createdAt);
            return (bTime - aTime);
        });
    }

    return (
        <Card className={`dashboard-card ${loading ? "dashboard-card--loading": ""}`} centered>
          <Card.Content>
            <Card.Header>Bulletin Board</Card.Header>
          </Card.Content>
          <Card.Content>
            {announcements && announcements.map(renderMessage)}
          </Card.Content>
        </Card>
    );
}

export default Bulletin;

/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Item, Button, Icon } from "semantic-ui-react";
import AnnouncementItem from "./AnnouncementItem";
import { getAllAnnouncements, setIsEditingAnnouncement } from "../actions/messages";
import { openAddAnnouncementModal } from "../actions/ui";

const AnnouncementList = () => {

    const dispatch = useDispatch();

    const announcements = useSelector((state) => state.messages.announcements.list);
    const loading = useSelector((state) => state.messages.announcements.loading);

    React.useEffect(() => {
        dispatch(getAllAnnouncements());
    }, []);

    const openAddAnnouncement = () => {
        dispatch(setIsEditingAnnouncement(false));
        dispatch(openAddAnnouncementModal());
    };

    const renderAnnouncements = (announcements, loading) => {
        if (!announcements && loading) {
            return "LOADING...";
        }
        if (!announcements) {
            return (
                <Item.Group divided>
                </Item.Group>
            );
        }
        return (
            <Item.Group divided>
                {announcements && announcements.map(a => (
                    <AnnouncementItem announcement={a} key={a.id} />
                ))}
            </Item.Group>
        );
    };

    const renderList = () => {
        return (
            <Card className="dashboard-card" centered>
                <Card.Content>
                    <Card.Header>Announcements</Card.Header>
                </Card.Content>
                <Card.Content>
                    {renderAnnouncements(announcements, loading)}
                </Card.Content>
                <Card.Content>
                    <Button primary onClick={openAddAnnouncement}>
                        <Icon name="plus" />
                        Add Announcement
                    </Button>
                </Card.Content>
            </Card>
        );
    };

    return (
        <>
            {renderList()}
        </>
    );
};

export default AnnouncementList;

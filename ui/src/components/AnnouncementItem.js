import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
    Item,
    Button,
    Icon
} from "semantic-ui-react";
import { Audience } from "../utils/enums";
import {
    setAnnouncementToAdd,
    setIsEditingAnnouncement,
    deleteAnnouncement
} from "../actions/messages";
import { openAddAnnouncementModal } from "../actions/ui";

const AnnouncementItem = ({
    announcement
}) => {

    const dispatch = useDispatch();

    const loading = useSelector((state) => state.messages.announcements.loading);

    const renderAudience = (announcement) => {
        switch (announcement.audience) {
        case Audience.GLOBAL: {
            return "Global";
        }
        case Audience.COMPETITION: {
            return "Competition - " + announcement.competition.name;
        }
        case Audience.TEAM: {
            return "Team - " + announcement.team.name;
        }
        case Audience.USER: {
            return "User - " + announcement.user.username;
        }
        default: {
            return "Unknown audience type " + announcement.audience;
        }
        }
    };

    const openEditAnnouncement = announcement => {
        if (announcement.audience === Audience.COMPETITION) {
            announcement.competitionId = announcement.competition.id;
        }
        else if (announcement.audience === Audience.TEAM) {
            announcement.teamId = announcement.team.id;
        }
        else if (announcement.audience === Audience.USER) {
            announcement.userId = announcement.user.id;
        }
            
        dispatch(setAnnouncementToAdd(announcement));
        dispatch(setIsEditingAnnouncement(true));
        dispatch(openAddAnnouncementModal());
    };

    return (
        <Item>
            <Item.Content>
                <Item.Header>{announcement.title}</Item.Header>
                <Item.Meta>{renderAudience(announcement)}</Item.Meta>
                <Item.Description>
                    <p>{announcement.content}</p>
                </Item.Description>
                <Item.Meta>
                    <Button
                        onClick={() => openEditAnnouncement(announcement)}
                    >
                        <Icon name="edit"/>
                        Edit
                    </Button>
                    <Button
                        onClick={() => dispatch(deleteAnnouncement(announcement.id))}
                        color="red"
                        loading={loading}
                    >
                        <Icon name="close"/>
                        Delete
                    </Button>
                </Item.Meta>
            </Item.Content>
        </Item>
    );
};

export default AnnouncementItem;

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Item, Button } from "semantic-ui-react";
import { ErrorTag, NotificationType } from "../utils/enums";
import { getTaggedErrors } from "../selectors/errors";
import {
    openConfirmation
} from "../actions/ui";
import {
    handleNotificationClick,
    handleRemoveNotificationClick
} from "../actions/notifications";
import { declineInviteConfirmation } from "../utils/confirmations";

const NotificationList = () => {

    const dispatch = useDispatch();

    const notifications = useSelector((state) => state.notifications.list);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.NOTIFICATIONS));

    const handleRemoveClick = notification => {
        if (notification.type === NotificationType.TEAM_INVITE) {
            dispatch(openConfirmation(declineInviteConfirmation(notification)));
        } else {
            dispatch(handleRemoveNotificationClick(notification));
        }
    };

    const NotificationItem = ({ notification }) => {
        const { header, description } = notification;
        return (
            <React.Fragment>
                <Item onClick={() => dispatch(handleNotificationClick(notification))}>
                    <Item.Content>
                        <Item.Header>
                            <span>{header}</span>
                        </Item.Header>
                        <Item.Description>{description}</Item.Description>
                    </Item.Content>
                </Item>
                <Button
                    basic color="red" size="tiny" icon="close"
                    onClick={() => handleRemoveClick(notification)}
                    style={{
                        position: "absolute",
                        top: "0",
                        left: "100%",
                        transform: "translateX(-100%)",
                        zIndex: 10000
                    }}/>
            </React.Fragment>
        );
    };

    const renderList = notifications => {
        if (notifications.length === 0) {
            return (
                <p>Empty</p>
            );
        }
        return (
            <Item.Group link divided relaxed>
                {notifications.map(
                    (n, i) => <NotificationItem key={i} notification={n}/>
                )}
            </Item.Group>
        );
    }

    return renderList(notifications);
}

export default NotificationList;

import React from "react";
import { useDispatch } from "react-redux";
import {
    Item,
    Dropdown,
    Form,
    Button,
    Icon
} from "semantic-ui-react";

import { openTeamInviteModal } from "../actions/ui";
import { setTeamInvite } from "../actions/teams";

import { getFormError } from "../utils/formErrors";

import ChatTeamInviteButton from "./ChatTeamInviteButton";

const timeStyle = {
    fontSize: "1rem"
};
const messageTextStyle = {
    fontSize: "1.2rem"
};

const replaceNewLines = (msg) => {
    return msg.split('\n').map((v, i) => (
        <React.Fragment key={i}>
            {v}
            <br />
        </React.Fragment>
    ));
};

const ChatItem = ({
    message,
    channel,
    isMe,
    team,
    isEditing,
    setMessageEditing,
    updateMessage,
    deleteMessage,
    updating,
    deleting,
    errors
}) => {

    const dispatch = useDispatch();

    const [isNew, setIsNew] = React.useState(true);
    const [editMessageText, setEditMessageText] = React.useState(message.message);
    setTimeout(() => setIsNew(false), 500);

    let err;

    const openInvite = () => {
        dispatch(setTeamInvite({
            username: message.sender,
            team: team.id
        }));
        dispatch(openTeamInviteModal("username"));
    };

    const renderMessage = () => {
        if (isEditing) {
            return (
                <Form
                    loading={updating}
                >
                    <Form.TextArea
                        value={editMessageText}
                        onChange={({ target: { value } }) => setEditMessageText(value)}
                        error={(err = getFormError(errors)) && {
                            content: err,
                            pointing: "below"
                        }}
                    />
                    <Button.Group>
                        <Button
                            icon
                            loading={updating}
                            onClick={() => {
                                setMessageEditing(null);
                                setEditMessageText(message.message);
                            }}
                        >
                            <span style={{ marginRight: "10px" }}>
                                Cancel
                            </span>
                            <Icon name="close" />
                        </Button>
                        <Button
                            icon
                            primary
                            loading={updating}
                            onClick={() => {
                                updateMessage({ ...message, text: editMessageText });
                            }}
                        >
                            <span style={{ marginRight: "10px" }}>
                                Save
                            </span>
                            <Icon name="save" />
                        </Button>
                    </Button.Group>
                </Form>
            );
        }
        return (
            <p style={messageTextStyle}>
                {replaceNewLines(message.message)}
            </p>
        );
    };

    const renderEditMenu = () => {
        if (!isMe) {
            return <div/>;
            // if (!team || channel !== "GLOBAL") {
            //     return <div/>;
            // }
            // return (
            //     <Dropdown
            //         icon="ellipsis vertical"
            //         direction="left"
            //         style={{
            //             position: "absolute",
            //             top: "1rem",
            //             right: "1rem",
            //             zIndex: "20000"
            //         }}
            //     >
            //         <Dropdown.Menu>
            //             <Dropdown.Item
            //                 text="Invite to Team"
            //                 onClick={() => openInvite()}
            //             />
            //         </Dropdown.Menu>
            //     </Dropdown>
            // );
        }
        return (
            <Dropdown
                icon="ellipsis vertical"
                direction="left"
                style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    zIndex: "20000"
                }}
            >
                <Dropdown.Menu>
                    <Dropdown.Item
                        text="Delete"
                        onClick={() => deleteMessage(message.id)}
                    />
                    <Dropdown.Item
                        text="Edit"
                        onClick={() => setMessageEditing(message.id)}
                    />
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    return (
        <>
            <Item
                key={message.id}
                className={`chat-message ${isNew ? "new" : ""}`}
            >
                <Item.Content>
                    <Item.Header>
                        {message.sender}
                    </Item.Header>
                    <Item.Meta>
                        <span style={timeStyle}>{message.time}</span>
                    </Item.Meta>
                    <Item.Description>
                        {renderMessage()}
                    </Item.Description>
                    {renderEditMenu()}
                </Item.Content>
            </Item>
        </>
    );
};

export default ChatItem;

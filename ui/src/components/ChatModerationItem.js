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
const teamNameStyle = {
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

const ChatModerationItem = ({
    message,
    channel,
    team,
    errors
}) => {

    const dispatch = useDispatch();

    const [isNew, setIsNew] = React.useState(true);
    setTimeout(() => setIsNew(false), 500);

    let err;

    const renderMessage = () => {
        return (
            <p style={messageTextStyle}>
                {replaceNewLines(message.message)}
            </p>
        );
    };

    const renderEditMenu = () => {
        return <div/>;
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
        //                 text="Delete"
        //                 onClick={() => deleteMessage(message.id)}
        //             />
        //             <Dropdown.Item
        //                 text="Edit"
        //                 onClick={() => setMessageEditing(message.id)}
        //             />
        //         </Dropdown.Menu>
        //     </Dropdown>
        // );
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
                        <span style={teamNameStyle}>{message.team.name || "Global"}</span>
                    </Item.Meta>
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

export default ChatModerationItem;

/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Card,
    Item,
    Segment,
    Form,
    Button,
    Icon,
    Ref
} from "semantic-ui-react";

import moment from "moment";

import ChatItem from "../components/ChatItem";

import { setActiveNavTab } from "../actions/ui";
import {
    sendChatMessage,
    refreshChat,
    setChatMessageEditing,
    updateChatMessage,
    deleteChatMessage
} from "../actions/messages";

import { getFormError } from "../utils/formErrors";
import { getTaggedErrors } from "../selectors/errors";
import { NavTab, ErrorTag } from "../utils/enums";

import pusherClient from "../utils/pusher";

const chatBoxStyle = {
    height: "50vh",
    overflow: "auto",
    padding: 0
};
const newDayStyle = {
    textAlign: "center",
    fontWeight: "bold"
};

const Chat = () => {

    const dispatch = useDispatch();

    const messages = useSelector((state) => state.messages.chat.messages);
    const loading = useSelector((state) => state.messages.chat.loading);
    const sending = useSelector((state) => state.messages.chat.sending);
    const editing = useSelector((state) => state.messages.chat.editing);
    const updating = useSelector((state) => state.messages.chat.updating);
    const deleting = useSelector((state) => state.messages.chat.deleting);
    const user = useSelector((state) => state.user);
    const teams = useSelector((state) => state.teams.list);
    const comp = useSelector((state) => state.competitions.currentCompetition);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.CHAT_MESSAGE));
    const currentTeam = teams.find(t => comp && t.competitionId === comp.id);

    const [hasStartedLoading, setHasStartedLoading] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedTeam, setSelectedTeam] = React.useState(null);
    const [chatInput, setChatInput] = React.useState("");
    const [pusherConnected, setPusherConnected] = React.useState(false);
    const [pollingInterval, setPollingInterval] = React.useState(null);
    const [shouldPoll, setShouldPoll] = React.useState(false);

    const chatBoxRef = React.useRef();

    // Set correct nav tab in case page reached with URL
    React.useEffect(() => {
        dispatch(setActiveNavTab(NavTab.CHAT));
    }, []);

    // Set initial loading state
    React.useEffect(() => {
        if (loading && !hasStartedLoading)
            setHasStartedLoading(true);
    }, [loading, hasStartedLoading]);
    React.useEffect(() => {
        if (hasStartedLoading && !loading && isLoading)
            setIsLoading(false);
    }, [loading, hasStartedLoading, isLoading]);

    // Check pusher connection and see if we need to fallback to polling
    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!pusherClient.isConnected && pusherConnected) {
                console.warn("Notification socket closed. Falling back to polling.");
            }
            setPusherConnected(pusherClient.isConnected);
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    }, []);
    React.useEffect(() => {
        if (!pusherConnected) {
            // Clear old interval if needed
            if (pollingInterval)
                clearInterval(pollingInterval);
            console.log("Creating chat polling interval");
            const interval = setInterval(() => {
                setShouldPoll(true);
            } , 2000);
            setPollingInterval(interval);
            return () => interval && clearInterval(interval);
        }
        // Pusher connected, see if we need to remove polling
        if (pusherConnected && pollingInterval) {
            console.log("Clearing chat polling interval");
            clearInterval(pollingInterval);
            setPollingInterval(null);
        }
    }, [pusherConnected]);
    React.useEffect(() => {
        if (shouldPoll) {
            if (selectedTeam)
                dispatch(refreshChat(selectedTeam));
            setShouldPoll(false);
        }
    }, [shouldPoll]);

    React.useEffect(() => {
        const defaultTeam = "GLOBAL";
        setSelectedTeam(defaultTeam);
    }, [teams]);

    // Populate chat on team selection 
    React.useEffect(() => {
        if (selectedTeam) {
            dispatch(refreshChat(selectedTeam));
        }
    }, [selectedTeam]);

    // Populate chat on current comp being set
    React.useEffect(() => {
        const chat = messages[selectedTeam];
        if (comp && selectedTeam === "GLOBAL" && !chat) {
            dispatch(refreshChat(selectedTeam));
        }
    }, [comp, selectedTeam, messages]);

    // Scroll to bottom when messages array has changed
    React.useEffect(() => {
        if (chatBoxRef.current)
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }, [messages]);

    let currYear = 0;
    let currDay = 0;

    // TODO(adam): Make this sticky
    const renderNewDay = (time) => {
        return (
            <div>
                <p style={newDayStyle}>
                    {time.format("dddd, MMM Do, YYYY")}
                </p>
            </div>
        );
    };

    const renderMessage = (msg) => {
        const time = moment(msg.time);
        let newDay = false;
        if (time.year() !== currYear) {
            newDay = true;
            currYear = time.year();
            currDay = time.dayOfYear();
        } else if (time.dayOfYear() !== currDay) {
            newDay = true;
            currDay = time.dayOfYear();
        }
        // const timeStr = isToday(time)
        //       ? time.format("h:mm:ss a")
        //       : time.format("dddd, MMM Do, YYYY");
        const timeStr = time.format("h:mm a");
        return (
            <React.Fragment key={msg.id}>
                {newDay && renderNewDay(time)}
                <ChatItem
                    message={{...msg, time: timeStr }}
                    isMe={msg.sender === user.username}
                    channel={selectedTeam}
                    team={currentTeam}
                    isEditing={editing === msg.id}
                    setMessageEditing={(id) => dispatch(setChatMessageEditing(id))}
                    updateMessage={(id) => dispatch(updateChatMessage(id))}
                    deleteMessage={(id) => dispatch(deleteChatMessage(id))}
                    deleting={deleting === msg.id}
                    updating={updating === msg.id}
                    errors={errors}
                />
            </React.Fragment>
        );
    };

    const renderChat = (chat) => {
        return (
            <Ref innerRef={chatBoxRef}>
                <Segment
                    style={chatBoxStyle}
                >
                    <Item.Group divided>
                        {chat.map(renderMessage)}
                    </Item.Group>
                </Segment>
            </Ref>
        );
    };

    const handleSendChat = (msg) => {
        // Check for trailing newline and remove if exists
        if (msg[msg.length - 1] === "\n")
            msg = msg.slice(0, msg.length - 1);
        // NOTE: We filter for duplicates, and this avoids
        //       accidentally missing the update from the
        //       server (which makes it look like the message
        //       was never sent event though it was)
        const shouldUpdateLocally = true;
        dispatch(sendChatMessage(msg, selectedTeam, shouldUpdateLocally));
        // Hack to fix race condition if using ENTER
        // key to send message
        setTimeout(() => setChatInput(""), 10);
    };

    const renderChatActions = () => {
        return (
            <Button.Group floated="right">
                <Button
                    icon
                    primary
                    loading={sending}
                    onClick={() => handleSendChat(chatInput)}
                    disabled={selectedTeam === "GLOBAL" && !comp}
                >
                    <span style={{ marginRight: "10px" }}>
                        Send
                    </span>
                    <Icon name="send" />
                </Button>
            </Button.Group>
        );
    };

    const handleChatInput = (e) => {
        setChatInput(e.target.value);
    };

    const handleChatKeyDown = (e) => {
        if (e.key === "Enter") {
            if (e.ctrlKey || e.shiftKey) {
                setChatInput(e.target.value + "\n");
            } else {
                handleSendChat(chatInput);
            }
        }
    };

    const renderChatInput = () => {
        let err;
        return (
            <Form style={{ marginTop: "2rem" }}>
                <Form.TextArea
                    placeholder="Enter Message"
                    value={chatInput}
                    onChange={handleChatInput}
                    onKeyDown={handleChatKeyDown}
                    error={(err = getFormError(errors)) && {
                        content: err,
                        pointing: "below"
                    }}
                />
                {renderChatActions()}
            </Form>
        );
    };

    const renderContent = () => {
        if (!selectedTeam) {
            return "Select a team";
        }
        if (isLoading) {
            return "Loading...";
        }
        const chat = messages[selectedTeam];
        if (!chat) {
            return "Error loading chat";
        }
        return (
            <>
                {renderChat(chat)}
                {renderChatInput()}
            </>
        );
    };

    return (
        <Card className="dashboard-card" centered>
            <Card.Content>
                <Form>
                    <Form.Select
                        inline
                        label="Channel"
                        placeholder="Select Channel"
                        value={selectedTeam}
                        onChange={(e, { value }) => setSelectedTeam(value)}
                        options={[
                            { key: "GLOBAL", text: "Global", value: "GLOBAL" },
                            ...teams.map(t => ({
                                key: t.id,
                                text: t.name,
                                value: t.id
                            }))
                        ]}
                    />
                </Form>
            </Card.Content>
            <Card.Content>
                {renderContent()}
            </Card.Content>
        </Card>
    );
};

export default Chat;

/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Card,
    Item,
    Segment,
    Form,
    Dropdown,
    Button,
    Icon,
    Ref
} from "semantic-ui-react";

import moment from "moment";

import ChatModerationItem from "../components/ChatModerationItem";

import { setActiveNavTab } from "../actions/ui";
import { refreshChat } from "../actions/messages";
import { getAllTeams } from "../actions/teams";

import { getFormError } from "../utils/formErrors";
import { getTaggedErrors } from "../selectors/errors";
import { NavTab, ErrorTag } from "../utils/enums";

import pusherClient from "../utils/pusher";

const chatBoxStyle = {
    height: "70vh",
    overflow: "auto",
    overflowX: "hidden",
    padding: 0
};
const newDayStyle = {
    textAlign: "center",
    fontWeight: "bold"
};

const ChatModeration = () => {

    const dispatch = useDispatch();

    const messages = useSelector((state) => state.messages.chat.moderation);
    const loading = useSelector((state) => state.messages.chat.loading);
    const user = useSelector((state) => state.user);
    const teams = useSelector((state) => state.teams.list);
    const comp = useSelector((state) => state.competitions.currentCompetition);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.CHAT_MESSAGE));
    const currentTeam = teams.find(t => comp && t.competitionId === comp.id);

    const [hasStartedLoading, setHasStartedLoading] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedTeam, setSelectedTeam] = React.useState(null);
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

    // Initial state
    React.useEffect(() => {
        const defaultTeam = "ALL";
        setSelectedTeam(defaultTeam);
        dispatch(refreshChat());
    }, []);

    // Populate chat and teams on current comp being set
    React.useEffect(() => {
        if (comp) {
            dispatch(refreshChat());
            dispatch(getAllTeams(comp.id));
        }
    }, [comp]);

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
                <ChatModerationItem
                    message={{...msg, time: timeStr }}
                    channel={selectedTeam}
                    team={currentTeam}
                    errors={errors}
                />
            </React.Fragment>
        );
    };

    const renderChat = (chat) => {
        let messages;
        if (selectedTeam === "ALL") {
            messages = chat;
        } else if (selectedTeam === "GLOBAL") {
            messages = chat.filter(m => !m.team.id);
        } else {
            messages = chat.filter(m => m.team.id === selectedTeam);
        }
        return (
            <Ref innerRef={chatBoxRef}>
                <Segment
                    style={chatBoxStyle}
                >
                    <Item.Group divided>
                        {messages.map(renderMessage)}
                    </Item.Group>
                </Segment>
            </Ref>
        );
    };

    const renderContent = () => {
        if (!selectedTeam) {
            return "Select a team";
        }
        if (isLoading) {
            return "Loading...";
        }
        const chat = messages;
        if (!chat) {
            return "Error loading chat";
        }
        return (
            <>
                {renderChat(chat)}
            </>
        );
    };

    return (
        <Card className="dashboard-card" centered>
            <Card.Content>
                <Form>
                    <label for="channel" style={{ marginRight: "1rem"}}>Channel</label>
                    <Dropdown
                        selection
                        search
                        name="channel"
                        label="Channel"
                        placeholder="Select Channel"
                        value={selectedTeam}
                        onChange={(e, { value }) => setSelectedTeam(value)}
                        options={[
                            { key: "ALL", text: "All", value: "ALL" },
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

export default ChatModeration;

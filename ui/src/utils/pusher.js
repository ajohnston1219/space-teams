import store from "../store";
import { io } from "socket.io-client";
import {
    SET_TEAMS,
    SET_NOTIFICATIONS
} from "../actions/types";
import {
    getToken
} from "../actions/user";
import {
    newChatMessage,
    editChatMessage,
    removeChatMessage
} from "../actions/messages";
import {
    openAlert,
    closeAlert
} from "../actions/ui";
import { NavTab, AlertType } from "./enums";
import { ALERT_TIME } from "./constants";
import {
    uniqueById,
    uniqueByField
} from "./unique";

const socketioURL = process.env.NODE_ENV === "development"
      ? "ws://127.0.0.1:5006"
      : `pusher.${process.env.REACT_APP_URL_BASE}`;
const MAX_CONNECT_RETRIES = 3;

const chatPageChatListener = (data) => {
    const msg = JSON.parse(data);
    if (!msg.team) {
        msg.team = "GLOBAL";
    }
    if (msg.action === "ADD") {
        store.dispatch(newChatMessage(msg));
    } else if (msg.action === "DELETE") {
        store.dispatch(removeChatMessage(msg.id, msg.team));
    } else if (msg.action === "EDIT") {
        store.dispatch(editChatMessage(msg));
    } else {
        console.error("Unknown message action " + msg.action + ", ignoring.");
    }
};

const otherPageChatListener = (data) => {
    const msg = JSON.parse(data);
    if (msg.action === "ADD") {
        let msgText = msg.message;
        if (msgText.length > 30) {
            msgText = msgText.slice(0, 30) + "...";
        }
        store.dispatch(openAlert({
            type: AlertType.SUCCESS,
            header: "New Message from " + msg.sender,
            message: msgText
        }));
        setTimeout(() => store.dispatch(closeAlert()), ALERT_TIME);
    }
};

const teamEventListener = (data) => {
    try {
        const event = JSON.parse(data);

        if (event.action === "MEMBER_JOIN") {
            const team = store.getState().teams.list.find(t => t.id === event.team);
            if (!team) {
                console.warn("Got new team member event for team with ID " + event.team +
                             ", which was not found in local teams list");
                return;
            }
            store.dispatch(openAlert({
                type: AlertType.SUCCESS,
                header: "New Team Member",
                message: `${event.user.username} just joined ${team.name}`
            }));
            store.dispatch({
                type: SET_TEAMS,
                payload: store.getState().teams.list.map(t => {
                    if (t.id === event.team) {
                        return {
                            ...t,
                            members: uniqueById([
                                ...t.members,
                                {
                                    id: event.user.id,
                                    username: event.user.username,
                                    email: event.user.email,
                                    role: event.user.teamRole
                                }
                            ])
                        };
                    }
                    return t;
                })
            });
            setTimeout(() => store.dispatch(closeAlert()), ALERT_TIME);

        } else if (event.action === "MEMBER_LEAVE") {
            const team = store.getState().teams.list.find(t => t.id === event.team);
            if (!team) {
                console.warn("Got new team member event for team with ID " + event.team +
                             ", which was not found in local teams list");
                return;
            }
            store.dispatch(openAlert({
                type: AlertType.SUCCESS,
                header: "Team Member Left",
                message: `${event.user.username} just left ${team.name}`
            }));
            store.dispatch({
                type: SET_TEAMS,
                payload: store.getState().teams.list.map(t => {
                    if (t.id === event.team) {
                        return {
                            ...t,
                            members: t.members.filter(m => m.id !== event.user.id)
                        };
                    }
                    return t;
                })
            });
            setTimeout(() => store.dispatch(closeAlert()), ALERT_TIME);

        } else if (event.action === "MEMBER_INVITE") {
            store.dispatch(openAlert({
                type: AlertType.SUCCESS,
                header: "Team Invite",
                message: `${event.fromUsername} has invited you to join their team '${event.teamName}'`
            }));
            store.dispatch({
                type: SET_NOTIFICATIONS,
                payload: uniqueByField([
                    ...store.getState().notifications.list,
                    {
                        type: "teamInvite",
                        header: "Team Invitation",
                        description: `${event.fromUsername} has invited you to join their team, ${event.teamName}`,
                        teamId: event.teamId,
                        teamName: event.teamName,
                        to: event.to
                    }
                ], "teamId")
            });
            setTimeout(() => store.dispatch(closeAlert()), ALERT_TIME);

        }
    } catch (err) {
        console.error("Incoming team event error", err);
        if (err.stack)
            console.error(err.stack);
    }
};

const bindListeners = (socket) => {
    socket.on("message", (data) => {
        const navTab = store.getState().ui.activeNavTab;
        try {
            if (navTab === NavTab.CHAT) {
                chatPageChatListener(data);
            } else {
                otherPageChatListener(data);
            }
        } catch (err) {
            console.error("Incoming chat message error", err);
            if (err.stack)
                console.error(err.stack);
        }
    });
    socket.on("teams", (data) => {
        try {
            teamEventListener(data);
        } catch (err) {
            console.error("Incoming team event error", err);
            if (err.stack)
                console.error(err.stack);
        }
    });
};

function PusherClient() {

    this.isConnected = false;

    this.socket = null;

    this.connectRetryCount = 0;

    this.connect = () => new Promise((resolve, reject) => {
        const token = getToken();
        if (!token) {
            console.warn("No token found, cancelling connection to notification server");
            reject("No token found, cancelling connection to notification server");
            return;
        }

        this.socket = io(socketioURL, {
            reconnectionDelayMax: 10000,
            auth: {
                token
            }
        });

        this.socket.on("connect", () => {
            this.isConnected = true;
            console.log("Socket connected.");
            resolve();
        });

        this.socket.on("connect_error", () => {
            this.isConnected = false;
        });

        this.socket.on("disconnect", () => {
            if (this.isConnected) {
                this.retryConnect();
            } else {
                this.isConnected = false;
            }
        });

        bindListeners(this.socket);

    });

    // this.addListener = (event, handler) => {
    //     if (!this.socket || !this.isConnected) {
    //         console.warn("Attempting to bind event handler to pusher client when socket is disconnected");
    //         return;
    //     }
    //     this.socket.on(event, async (data) => {
    //         try {
    //             await handler(data);
    //         } catch (err) {
    //             console.error("Uncaught error in notification socket handler:", err);
    //             if (err.stack) {
    //                 console.error(err.stack);
    //             }
    //         }
    //     });
    // };

    this.removeListeners = (event) => {
        if (this.socket && this.socket.off)
            this.socket.off(event);
    };

    this.disconnect = () => {
        this.isConnected = false;
        if (this.socket && this.socket.disconnect)
            this.socket.disconnect();
    };

    this.retryConnect = () => {
        if (this.isConnected && this.connectRetryCount < MAX_CONNECT_RETRIES) {
            console.warn("Retrying notification socket connection...");
            ++this.connectRetryCount;
            this.connect()
                .catch(err => console.warn("Pusher connection error", err));
        } else if (this.isConnected) {
            console.error("ERROR: Max connection retry attempts for notification socket reached.");
            this.isConnected = false;
        }
    };
}

const client = new PusherClient();

export default client;

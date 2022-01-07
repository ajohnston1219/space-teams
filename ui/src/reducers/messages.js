import {
    SET_ANNOUNCEMENTS,
    ANNOUNCEMENTS_LOADING,
    SET_ANNOUNCEMENT_TO_ADD,
    CLEAR_ANNOUNCEMENT_TO_ADD,
    SET_IS_EDITING_ANNOUNCEMENT,
    CHAT_LOADING,
    SEND_CHAT_MESSAGE_LOADING,
    DELETE_CHAT_MESSAGE_LOADING,
    UPDATE_CHAT_MESSAGE_LOADING,
    SET_CHAT_MESSAGE_EDITING,
    NEW_CHAT_MESSAGE,
    NEW_MODERATION_CHAT_MESSAGE,
    SET_CHAT_MESSAGES,
    SET_MODERATION_CHAT_MESSAGES,
    EDIT_CHAT_MESSAGE,
    EDIT_MODERATION_CHAT_MESSAGE,
    REMOVE_CHAT_MESSAGE,
    REMOVE_MODERATION_CHAT_MESSAGE,
    LOGOUT
} from "../actions/types";

import { uniqueById } from "../utils/unique";

const initialState = {
    announcements: {
        list: [],
        loading: false
    },
    announcementToAdd: {
        id: null,
        title: "",
        content: "",
        type: "",
        audience: "",
        teamId: "",
        competitionId: "",
        userId: ""
    },
    chat: {
        messages: {},
        moderation: [],
        loading: false,
        sending: false,
        deleting: null,
        editing: null,
        updating: null
    },
    isEditingAnnouncement: false
};

const messages = (state = initialState, action) => {
    switch (action.type) {
        case SET_ANNOUNCEMENTS: {
            return {
                ...state,
                announcements: { list: action.payload, loading: false }
            };
        }
        case ANNOUNCEMENTS_LOADING: {
            return {
                ...state,
                announcements: {
                    list : [ ...state.announcements.list ],
                    loading: action.payload
                }
            };
        }
        case SET_ANNOUNCEMENT_TO_ADD: {
            return {
                ...state,
                announcementToAdd: action.payload
            };
        }
        case CLEAR_ANNOUNCEMENT_TO_ADD: {
            return {
                ...state,
                announcementToAdd: initialState.announcementToAdd
            };
        }
        case SET_IS_EDITING_ANNOUNCEMENT: {
            return {
                ...state,
                isEditingAnnouncement: action.payload
            };
        }
        case CHAT_LOADING: {
            return {
                ...state,
                chat: { ...state.chat, loading: action.payload }
            };
        }
        case SEND_CHAT_MESSAGE_LOADING: {
            return {
                ...state,
                chat: { ...state.chat, sending: action.payload }
            };
        }
        case DELETE_CHAT_MESSAGE_LOADING: {
            return {
                ...state,
                chat: { ...state.chat, deleting: action.payload }
            };
        }
        case UPDATE_CHAT_MESSAGE_LOADING: {
            return {
                ...state,
                chat: { ...state.chat, updating: action.payload }
            };
        }
        case SET_CHAT_MESSAGE_EDITING: {
            return {
                ...state,
                chat: { ...state.chat, editing: action.payload }
            };
        }
        case NEW_CHAT_MESSAGE: {
            const msg = action.payload;
            const messages = { ...state.chat.messages };
            messages[msg.team] = uniqueById([ ...messages[msg.team], msg ]);
            // TODO(adam): Sort by sent at in case of out-of-order receiving
            return {
                ...state,
                chat: { ...state.chat, messages }
            };
        }
        case NEW_MODERATION_CHAT_MESSAGE: {
            const msg = action.payload;
            return {
                ...state,
                chat: {
                    ...state.chat,
                    moderation: uniqueById([...state.chat.moderation, msg ])
                }
            };
        }
        case EDIT_CHAT_MESSAGE: {
            const editedMsg = action.payload;
            const messages = { ...state.chat.messages };
            messages[editedMsg.team] = messages[editedMsg.team].map(m => {
                if (m.id === editedMsg.id) {
                    return { ...m, message: editedMsg.message };
                }
                return m;
            });
            return {
                ...state,
                chat: { ...state.chat, messages }
            };
        }
        case EDIT_MODERATION_CHAT_MESSAGE: {
            const editedMsg = action.payload;
            let moderation = state.chat.moderation;
            moderation = moderation.map(m => {
                if (m.id === editedMsg.id) {
                    return { ...m, message: editedMsg.message };
                }
                return m;
            });
            return {
                ...state,
                chat: { ...state.chat, moderation }
            };
        }
        case SET_CHAT_MESSAGES: {
            const team = action.payload.team;
            const messages = { ...state.chat.messages };
            messages[team] = action.payload.messages;
            return {
                ...state,
                chat: { ...state.chat, messages }
            };
        }
        case SET_MODERATION_CHAT_MESSAGES: {
            return {
                ...state,
                chat: { ...state.chat, moderation: action.payload }
            };
        }
        case REMOVE_CHAT_MESSAGE: {
            const team = action.payload.team;
            const messages = { ...state.chat.messages };
            messages[team] = messages[team].filter(m => m.id !== action.payload.id);
            return {
                ...state,
                chat: { ...state.chat, messages }
            };
        }
        case REMOVE_MODERATION_CHAT_MESSAGE: {
            let moderation = state.chat.moderation;
            moderation = moderation.filter(m => m.id !== action.payload.id);
            return {
                ...state,
                chat: { ...state.chat, moderation }
            };
        }
        case LOGOUT: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default messages;

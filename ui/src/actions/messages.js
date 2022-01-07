import {
    ANNOUNCEMENTS_LOADING,
    SET_ANNOUNCEMENTS,
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
    EDIT_CHAT_MESSAGE,
    EDIT_MODERATION_CHAT_MESSAGE,
    SET_CHAT_MESSAGES,
    SET_MODERATION_CHAT_MESSAGES,
    REMOVE_CHAT_MESSAGE,
    REMOVE_MODERATION_CHAT_MESSAGE
} from "./types";
import { ErrorTag, UserType } from "../utils/enums";
import messageServer from "../api/messages";
import { addError, clearErrors } from "./errors";
import { getToken } from "./user";
import { closeAddAnnouncementModal } from "./ui";

const _getAnnouncements = async token => {
    try {
        const announcements = await messageServer.get("/announcements", {
            headers: {
                Authorization: token
            }
        });
        return announcements.data;
    } catch (err) {
        throw err;
    }
};

const _getAllAnnouncements = async token => {
    try {
        const announcements = await messageServer.get("/announcements/all", {
            headers: {
                Authorization: token
            }
        });
        return announcements.data;
    } catch (err) {
        throw err;
    }
};

const _postAnnouncement = async (announcement, isPatch, token) => {
    try {
        if (isPatch) {
            await messageServer.patch("/announcements", announcement, {
                headers: {
                    Authorization: token
                }
            });
        } else {
            await messageServer.post("/announcements", announcement, {
                headers: {
                    Authorization: token
                }
            });
        }
    } catch (err) {
        throw err;
    }
};

const _deleteAnnouncement = async (announcementId, token) => {
    try {
        await messageServer.delete(
            `/announcements?id=${announcementId}`,
            { headers: { Authorization: token }
        });
    } catch (err) {
        throw err;
    }
};

const _sendChatMessage = async (message, teamId, compId, token) => {
    try {
        const data = { text: message };
        if (teamId === "GLOBAL")
            data.competitionId = compId;
        else
            data.teamId = teamId;
        const sentMessage = await messageServer.post(
            "/chat",
            data,
            { headers: { Authorization: token } }
        );
        return sentMessage.data;
    } catch (err) {
        throw err;
    }
};

const _getChatMessages = async (team, comp, token) => {
    try {
        let param = "?";
        if (team === "GLOBAL")
            param += "competition_id=" + encodeURIComponent(comp);
        else
            param += "team_id=" + encodeURIComponent(team);
        const messages = await messageServer.get(`/chat${param}`, {
            headers: {
                Authorization: token
            }
        });
        return messages.data;
    } catch (err) {
        throw err;
    }
};

const _getAllChatMessages = async (comp, token) => {
    try {
        const param = encodeURIComponent(comp);
        const messages = await messageServer.get(`/chat/all?competition_id=${param}`, {
            headers: {
                Authorization: token
            }
        });
        return messages.data;
    } catch (err) {
        throw err;
    }
};

const _updateChatMessage = async (msg, token) => {
    try {
        await messageServer.patch("/chat", msg, {
            headers: {
                Authorization: token
            }
        });
    } catch (err) {
        throw err;
    }
};

const _deleteChatMessage = async (id, token) => {
    try {
        await messageServer.delete(
            `/chat?message_id=${id}`,
            { headers: { Authorization: token } }
        );
    } catch (err) {
        throw err;
    }
};

export const getAnnouncements = () => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.ANNOUNCEMENTS));
        dispatch({ type: ANNOUNCEMENTS_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;
        const announcements = await _getAnnouncements(token);
        dispatch({ type: SET_ANNOUNCEMENTS, payload: announcements });
    } catch (err) {
        err.tag = ErrorTag.ANNOUNCEMENTS;
        dispatch(addError(err));
    } finally {
        dispatch({ type: ANNOUNCEMENTS_LOADING, payload: false });
    }
};

export const getAllAnnouncements = () => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.ANNOUNCEMENTS));
        dispatch({ type: ANNOUNCEMENTS_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;
        const announcements = await _getAllAnnouncements(token);
        dispatch({ type: SET_ANNOUNCEMENTS, payload: announcements });
    } catch (err) {
        err.tag = ErrorTag.ANNOUNCEMENTS;
        dispatch(addError(err));
    } finally {
        dispatch({ type: ANNOUNCEMENTS_LOADING, payload: false });
    }
};

export const setIsEditingAnnouncement = isEditing => ({
    type: SET_IS_EDITING_ANNOUNCEMENT,
    payload: isEditing
});

export const setAnnouncementToAdd = (announcement) => ({
    type: SET_ANNOUNCEMENT_TO_ADD,
    payload: announcement
});

export const clearAnnouncementToAdd = () => ({
    type: CLEAR_ANNOUNCEMENT_TO_ADD
});

export const postAnnouncement = (announcement) => async (dispatch, getState) => {
    try {
        dispatch(clearErrors(ErrorTag.ADD_ANNOUNCEMENT));
        dispatch({ type: ANNOUNCEMENTS_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;
        const isPatch = getState().messages.isEditingAnnouncement;
        await _postAnnouncement(announcement, isPatch, token);
        dispatch(closeAddAnnouncementModal());
        dispatch(clearAnnouncementToAdd());
    } catch (err) {
        err.tag = ErrorTag.ADD_ANNOUNCEMENT;
        dispatch(addError(err));
    } finally {
        dispatch({ type: ANNOUNCEMENTS_LOADING, payload: false });
    }
};

export const deleteAnnouncement = (announcementId) => async (dispatch, getState) => {
    try {
        dispatch(clearErrors(ErrorTag.DELETE_ANNOUNCEMENT));
        dispatch({ type: ANNOUNCEMENTS_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;
        await _deleteAnnouncement(announcementId, token);
        dispatch(getAllAnnouncements());
    } catch (err) {
        err.tag = ErrorTag.DELETE_ANNOUNCEMENT;
        dispatch(addError(err));
    } finally {
        dispatch({ type: ANNOUNCEMENTS_LOADING, payload: false });
    }
};

export const sendChatMessage = (message, team, shouldUpdateLocally) => async (dispatch, getState) => {
    try {
        dispatch(clearErrors(ErrorTag.CHAT_MESSAGE));
        dispatch({ type: SEND_CHAT_MESSAGE_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;
        const comp = getState().competitions.currentCompetition;
        const sentMessage = await _sendChatMessage(message, team, comp.id, token);
        if (!sentMessage.team) {
            sentMessage.team = "GLOBAL";
        }
        if (shouldUpdateLocally) // For when pusher if offline
            dispatch({ type: NEW_CHAT_MESSAGE, payload: sentMessage });
    } catch (err) {
        err.tag = ErrorTag.CHAT_MESSAGE;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SEND_CHAT_MESSAGE_LOADING, payload: false });
    }
};

export const refreshChat = (team) => async (dispatch, getState) => {
    try {
        dispatch(clearErrors(ErrorTag.CHAT_MESSAGE));
        dispatch({ type: CHAT_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;
        const comp = getState().competitions.currentCompetition;
        if (!comp)
            return;

        let messages;
        if (getState().user.type === UserType.ADMIN) {
            messages = await _getAllChatMessages(comp.id, token);
            dispatch({ type: SET_MODERATION_CHAT_MESSAGES, payload: messages });
        } else {
            messages = await _getChatMessages(team, comp.id, token);
            dispatch({ type: SET_CHAT_MESSAGES, payload: { messages, team } });
        }
            
    } catch (err) {
        err.tag = ErrorTag.CHAT_MESSAGE;
        dispatch(addError(err));
    } finally {
        dispatch({ type: CHAT_LOADING, payload: false });
    }
};

export const updateChatMessage = (msg) => async (dispatch) => {
    try {
        dispatch(clearErrors(ErrorTag.CHAT_MESSAGE));
        dispatch({ type: UPDATE_CHAT_MESSAGE_LOADING, payload: msg.id });
        let token;
        if (!(token = getToken()))
            return;
        await _updateChatMessage(msg, token);
        dispatch({ type: SET_CHAT_MESSAGE_EDITING, payload: null });
    } catch (err) {
        err.tag = ErrorTag.CHAT_MESSAGE;
        dispatch(addError(err));
    } finally {
        dispatch({ type: UPDATE_CHAT_MESSAGE_LOADING, payload: null });
    }
};

export const deleteChatMessage = (id) => async (dispatch) => {
    try {
        dispatch(clearErrors(ErrorTag.CHAT_MESSAGE));
        dispatch({ type: DELETE_CHAT_MESSAGE_LOADING, payload: id });
        let token;
        if (!(token = getToken()))
            return;
        await _deleteChatMessage(id, token);
    } catch (err) {
        err.tag = ErrorTag.CHAT_MESSAGE;
        dispatch(addError(err));
    } finally {
        dispatch({ type: DELETE_CHAT_MESSAGE_LOADING, payload: null });
    }
};

export const newChatMessage = (msg) => (dispatch, getState) => {
    const user = getState().user;
    let actionType = NEW_CHAT_MESSAGE;
    if (user.type === UserType.ADMIN) {
        actionType = NEW_MODERATION_CHAT_MESSAGE;
        const teams = getState().teams.list;
        if (teams) {
            msg.team = teams.find(t => t.id === msg.team);
        }
        if (!msg.team) {
            msg.team = { id: null, name: null };
        }
    }
    dispatch({
        type: actionType,
        payload: msg
    });
};

export const setChatMessageEditing = (id) => ({
    type: SET_CHAT_MESSAGE_EDITING,
    payload: id
});

export const editChatMessage = (msg) => (dispatch, getState) =>  {
    const user = getState().user;
    const actionType = user.type === UserType.ADMIN
          ? EDIT_MODERATION_CHAT_MESSAGE
          : EDIT_CHAT_MESSAGE;
    dispatch({
        type: actionType,
        payload: msg
    });
};

export const removeChatMessage = (id, team) => (dispatch, getState) => {
    const user = getState().user;
    const actionType = user.type === UserType.ADMIN
          ? REMOVE_MODERATION_CHAT_MESSAGE
          : REMOVE_CHAT_MESSAGE;
    dispatch({
        type: actionType,
        payload: { id, team }
    });
};

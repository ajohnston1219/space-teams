import { SET_NOTIFICATIONS, NOTIFICATIONS_LOADING } from "./types";
import { NotificationType, ErrorTag, InviteStatus, AlertType } from "../utils/enums";
import authServer from "../api/auth";
import { addError, clearErrors } from "./errors";
import {
    openJoinTeamModal,
    closeNotificationList,
    openAlert,
    closeAlert
} from "./ui";
import { getToken } from "./user";
import { setTeamToJoin } from "./teams";
import { ALERT_TIME } from "../utils/constants";

const _getActiveInvites = async token => {
    try {
        const inviteResult = await authServer.get(
            "/teams/invites", { headers: { Authorization: token } }
        );
        const invites = inviteResult.data;
        return invites
            .filter(i => i.status === InviteStatus.ACTIVE)
            .map(i => ({
                type: NotificationType.TEAM_INVITE,
                header: "Team Invitation",
                description: `${i.from} has invited you to join their team, ${i.teamName}`,
                teamId: i.teamId,
                teamName: i.teamName,
                to: i.toId
            }))
    } catch (err) {
        throw err;
    }
};

const _changeInviteStatus = async (req, token) => {
    try {
        await authServer.patch(
            "/teams/invite", req, { headers: { Authorization: token } }
        );
    } catch (err) {
        throw err;
    }
}

const _getNotifications = async token => {
    try {
        const invites = await _getActiveInvites(token);
        return invites;
    } catch (err) {
        throw err;
    }
};

export const getNotifications = () => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.NOTIFICATIONS));
        dispatch({ type: NOTIFICATIONS_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;
        const invites = await _getNotifications(token);
        dispatch({ type: SET_NOTIFICATIONS, payload: invites });
    } catch (err) {
        err.tag = ErrorTag.NOTIFICATIONS;
        dispatch(addError(err));
    } finally {
        dispatch({ type: NOTIFICATIONS_LOADING, payload: false });
    }
};

export const handleNotificationClick = notification => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.NOTIFICATIONS));

        switch (notification.type) {
            case NotificationType.TEAM_INVITE: {
                dispatch(setTeamToJoin({
                    id: notification.teamId,
                    name: notification.teamName
                }));
                dispatch(openJoinTeamModal());
                break;
            }
            default: {
                break;
            }
        }

        dispatch(closeNotificationList());

    } catch (err) {
        err.tag = ErrorTag.NOTIFICATIONS;
        dispatch(addError(err));
    }
};

export const handleRemoveNotificationClick = notification => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.NOTIFICATIONS));
        dispatch({ type: NOTIFICATIONS_LOADING, payload: true });

        let token;
        if (!(token = getToken()))
            return;

        switch (notification.type) {
            case NotificationType.TEAM_INVITE: {
                const { teamId, to } = notification;
                await _changeInviteStatus({
                    teamId,
                    to,
                    status: InviteStatus.REJECTED
                }, token);
                dispatch(openAlert({
                    type: AlertType.SUCCESS,
                    header: "Invite Declined",
                    message: "We've removed that invite from your inbox"
                }));
                setTimeout(() => dispatch(closeAlert()), ALERT_TIME);
                break;
            }
            default: {
                break;
            }
        }

        dispatch(getNotifications());

    } catch (err) {
        err.tag = ErrorTag.NOTIFICATIONS;
        dispatch(addError(err));
    } finally {
        dispatch({ type: NOTIFICATIONS_LOADING, payload: false });
    }
};

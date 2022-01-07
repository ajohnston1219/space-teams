import {
    SET_TEAMS,
    TEAMS_LOADING,
    CREATE_TEAM_LOADING,
    SET_TEAM_INVITE,
    SET_INVITE_BY,
    CLEAR_INVITE_BY,
    TEAM_INVITE_LOADING,
    SET_TEAM_TO_JOIN,
    JOIN_TEAM_LOADING,
    SET_TEAM_TO_CREATE,
    SET_TEAM_MEMBERS_LOADING,
    SET_TEAM_MEMBERS,
    SET_SIM_INVITE,
    SET_SIM_INVITE_LOADING
} from "./types";
import { ErrorTag, AlertType } from "../utils/enums";
import { ALERT_TIME } from "../utils/constants";
import { addError, addErrorAlert, clearErrors } from "./errors";
import { getToken, loadUserData } from "./user";
import {
    closeCreateTeamModal,
    closeTeamInviteModal,
    closeMentorInviteModal,
    closeJoinTeamModal,
    closeInviteToSimModal,
    openAlert,
    closeAlert,
    openConfirmation
} from "./ui";
import { inviteToSimConfirmation } from "../utils/confirmations";
import authServer from "../api/auth";
import { getNotifications } from "./notifications";

const _getTeams = async token => {
    try {
        const teamsResult = await authServer.get(
            "/teams", { headers: { Authorization: token } }
        );
        return teamsResult.data;
    } catch (err) {
        throw err;
    }
};

const _getAllTeams = async token => {
    try {
        const teamsResult = await authServer.get(
            "/teams/all", { headers: { Authorization: token } }
        );
        return teamsResult.data;
    } catch (err) {
        throw err;
    }
};

const _getAllTeamsInCompetition = async (compId, token) => {
    try {
        const param = encodeURIComponent(compId);
        const teamsResult = await authServer.get(
            `/teams/all?competition_id=${param}`,
            { headers: { Authorization: token } }
        );
        return teamsResult.data;
    } catch (err) {
        throw err;
    }
};

const _createTeam = async (team, token) => {
    try {
        const createTeamResult = await authServer.post(
            "/teams",
            team,
            { headers: { Authorization: token } }
        );
        return createTeamResult.data;
    } catch (err) {
        throw err;
    }
};

const _joinTeam = async (teamId, token) => {
    try {
        await authServer.post(
            `/teams/join?id=${encodeURI(teamId)}`,
            {}, { headers: { Authorization: token } }
        );
    } catch (err) {
        throw err;
    }
};

const _sendInvite = async (invite, token) => {
    try {
        const inviteResult = await authServer.post(
            "/teams/invite",
            invite,
            { headers: { Authorization: token } }
        );
        return inviteResult.data;
    } catch (err) {
        throw err;
    }
};

const _sendInviteByEmail = async (invite, token) => {
    try {
        const inviteResult = await authServer.post(
            "/teams/invite-by-email",
            invite,
            { headers: { Authorization: token } }
        );
        return inviteResult.data;
    } catch (err) {
        throw err;
    }
};

const _sendMentorInvite = async (email, teamId, token) => {
    try {
        await authServer.post(
            "/users/invite-mentor",
            { email, teamId },
            { headers: { Authorization: token } }
        );
    } catch (err) {
        throw err;
    }
};

const _sendSimInvite = async (invite, token) => {
    try {
        const response = await authServer.post(
            `/teams/invite-to-sim`,
            {
                teamId: invite.team,
                usersToInvite: invite.usersToInvite,
                mentorsToInvite: invite.mentorsToInvite,
                activityName: invite.activityName
            },
            { headers: { Authorization: token } }
        );
        return response.data;
    } catch (err) {
        throw err;
    }
};

const _leaveTeam = async (teamId, token) => {
    try {
        await authServer.post(
            `/teams/leave?id=${encodeURI(teamId)}`,
            null,
            { headers: { Authorization: token } }
        );
    } catch (err) {
        throw err;
    }
};

const _deleteTeam = async (teamId, token) => {
    try {
        await authServer.delete(
            `/teams?id=${encodeURI(teamId)}`,
            { headers: { Authorization: token } }
        );
    } catch (err) {
        throw err;
    }
};

const _getTeamMembers = async (teamId, token) => {
    try {
        const members = await authServer.get(
            `/teams/members?team_id=${encodeURI(teamId)}&include_mentors=true`,
            { headers: { Authorization: token } }
        );
        return members.data;
    } catch (err) {
        throw err;
    }
};

export const getTeams = () => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.TEAMS));
        dispatch({ type: TEAMS_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;
        const teams = await _getTeams(token);
        dispatch({
            type: SET_TEAMS,
            payload: teams
        });

    } catch (err) {
        err.tag = ErrorTag.TEAMS;
        dispatch(addError(err));
    } finally {
        dispatch({ type: TEAMS_LOADING, payload: false });
    }
};

export const getAllTeams = (compId) => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.TEAMS));
        dispatch({ type: TEAMS_LOADING, payload: true });
        const token = getToken();
        if (!token)
            return;

        let teams;
        if (compId) {
            teams = await _getAllTeamsInCompetition(compId, token);
        } else {
            teams = await _getAllTeams(token);
        }
        dispatch({
            type: SET_TEAMS,
            payload: teams
        });

    } catch (err) {
        err.tag = ErrorTag.TEAMS;
        dispatch(addError(err));
    } finally {
        dispatch({ type: TEAMS_LOADING, payload: false });
    }
};

export const getTeamMembers = (teamId) => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.TEAMS));
        dispatch({ type: SET_TEAM_MEMBERS_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;
        const members = await _getTeamMembers(teamId, token);
        dispatch({
            type: SET_TEAM_MEMBERS,
            payload: members 
        });

    } catch (err) {
        err.tag = ErrorTag.TEAMS;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_TEAM_MEMBERS_LOADING, payload: false });
    }
};

export const setTeamToCreate = teamData => ({
    type: SET_TEAM_TO_CREATE,
    payload: teamData
});

export const clearTeamToCreate = () => ({
    type: SET_TEAM_TO_CREATE,
    payload: {
        name: "",
        competitionId: "",
        league: ""
    }
});

export const createTeam = () => async (dispatch, getState) => {
    try {
        dispatch(clearErrors(ErrorTag.CREATE_TEAM));
        dispatch({ type: CREATE_TEAM_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;
        const { teams: { teamToCreate } } = getState();
        await _createTeam(teamToCreate, token);
        dispatch(openAlert({
            type: AlertType.SUCCESS,
            header: "Team Created!",
            message: "You successfully created a new team. " +
                "Click the invite button next to the new team " +
                " to add teammates."
        }));
        setTimeout(() => dispatch(closeAlert()), ALERT_TIME);
        dispatch(closeCreateTeamModal());
        dispatch(clearTeamToCreate());
        dispatch(loadUserData());
    } catch (err) {
        err.tag = ErrorTag.CREATE_TEAM;
        dispatch(addError(err));
    } finally {
        dispatch({ type: CREATE_TEAM_LOADING, payload: false });
    }
}

export const setInviteBy = inviteBy => ({
    type: SET_INVITE_BY,
    payload: inviteBy
});

export const clearInviteBy = () => ({
    type: CLEAR_INVITE_BY
});

export const setTeamInvite = invite => ({
    type: SET_TEAM_INVITE,
    payload: invite
});

export const clearTeamInvite = invite => ({
    type: SET_TEAM_INVITE,
    payload: {
        team: "",
        username: "",
        email: ""
    }
});

export const setSimInvite = invite => ({
    type: SET_SIM_INVITE,
    payload: invite
});

export const sendTeamInvite = invite => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.TEAM_INVITE));
        dispatch({ type: TEAM_INVITE_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;
        if (invite.username) {
            await _sendInvite(invite, token);
        } else {
            await _sendInviteByEmail(invite, token);
        }
        dispatch(clearTeamInvite());
        dispatch(openAlert({
            type: AlertType.SUCCESS,
            header: "Invite Sent!",
            message: "Your invite has been sent. As soon as they accept, " +
                "they will be added to the team."
        }));
        setTimeout(() => dispatch(closeAlert()), ALERT_TIME);
        dispatch(setTeamInvite({ user: "", team: "" }));
        dispatch(closeTeamInviteModal());
        dispatch(getTeams());
    } catch (err) {
        err.tag = ErrorTag.TEAM_INVITE;
        dispatch(addError(err));
    } finally {
        dispatch({ type: TEAM_INVITE_LOADING, payload: false });
    }
};

export const setTeamToJoin = teamId => ({
    type: SET_TEAM_TO_JOIN,
    payload: teamId
});

export const joinTeam = () => async (dispatch, getState) => {
    try {
        dispatch({ type: JOIN_TEAM_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;
        const { teams: { teamToJoin } } = getState();
        await _joinTeam(teamToJoin.id, token);
        dispatch(openAlert({
            type: AlertType.SUCCESS,
            header: "You're on the Team!",
            message: "You've accepted the invitation and are now on the team. " +
                "Log in to SpaceCRAFT to create a sim and start collaborating with " +
                "your friends."
        }));
        setTimeout(() => dispatch(closeAlert()), ALERT_TIME);
        dispatch(closeJoinTeamModal());
        dispatch(setTeamToJoin(null));
        dispatch(getTeams());
        dispatch(getNotifications());
    } catch (err) {
        err.tag = ErrorTag.JOIN_TEAM;
        dispatch(addError(err));
    } finally {
        dispatch({ type: JOIN_TEAM_LOADING, payload: false });
    }
};

export const leaveTeam = teamId => async dispatch => {
    try {
        dispatch({ type: TEAMS_LOADING, payload: true });
        dispatch(clearErrors(ErrorTag.LEAVE_TEAM))
        let token;
        if (!(token = getToken()))
            return;
        await _leaveTeam(teamId, token);
        dispatch(openAlert({
            type: AlertType.SUCCESS,
            header: "You'll Be Missed!",
            message: "You've successfully left the team. If you want to be added back, " +
                "you'll have to get someone to invite you."
        }));
        setTimeout(() => dispatch(closeAlert()), ALERT_TIME);
        dispatch(getTeams());
    } catch (err) {
        err.tag = ErrorTag.LEAVE_TEAM;
        dispatch(addErrorAlert(err, "Error Leaving Team"));
        setTimeout(() => dispatch(closeAlert()), ALERT_TIME);
    } finally {
        dispatch({ type: TEAMS_LOADING, payload: false });
    }
};

export const deleteTeam = teamId => async dispatch => {
    try {
        dispatch({ type: TEAMS_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;
        await _deleteTeam(teamId, token);
        dispatch(openAlert({
            type: AlertType.SUCCESS,
            header: "All Gone!",
            message: "You've successfully deleted the team."
        }));
        setTimeout(() => dispatch(closeAlert()), ALERT_TIME);
        dispatch(loadUserData());
    } catch (err) {
        err.tag = ErrorTag.DELETE_TEAM;
        dispatch(addErrorAlert(err, "Error Deleting Team"));
        setTimeout(() => dispatch(closeAlert()), ALERT_TIME);
    } finally {
        dispatch({ type: TEAMS_LOADING, payload: false });
    }
};

export const setTeams = teams => ({
    type: SET_TEAMS,
    payload: teams
});

export const sendMentorInvite = (email, teamId) => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.MENTOR_INVITE));
        dispatch({ type: TEAM_INVITE_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;

        await _sendMentorInvite(email, teamId, token);

        dispatch(clearTeamInvite());
        dispatch(openAlert({
            type: AlertType.SUCCESS,
            header: "Invite Sent!",
            message: "Your invite has been sent. As soon as they accept, " +
                "they will be added to the team."
        }));
        setTimeout(() => dispatch(closeAlert()), ALERT_TIME);

        dispatch(closeMentorInviteModal());
        dispatch(getTeams());
    } catch (err) {
        err.tag = ErrorTag.MENTOR_INVITE;
        dispatch(addError(err));
    } finally {
        dispatch({ type: TEAM_INVITE_LOADING, payload: false });
    }
};

export const sendSimInvite = (invite) => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.SIM_INVITE));
        dispatch({ type: SET_SIM_INVITE_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;

        await _sendSimInvite(invite, token);

        dispatch(closeInviteToSimModal());
        dispatch(openConfirmation(inviteToSimConfirmation()));

    } catch (err) {
        err.tag = ErrorTag.SIM_INVITE;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_SIM_INVITE_LOADING, payload: false });
    }
};

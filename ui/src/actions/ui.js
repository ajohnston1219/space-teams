import {
    APP_LOADING,
    OPEN_ALERT,
    CLOSE_ALERT,
    OPEN_CONFIRM_MODAL,
    CLOSE_CONFIRM_MODAL,
    SET_ACTIVE_NAV_TAB,
    SET_LOGIN_MODAL_OPEN,
    SET_CREATE_TEAM_MODAL_OPEN,
    SET_TEAM_INVITE_MODAL_OPEN,
    SET_NOTIFICATION_LIST_OPEN,
    SET_JOIN_TEAM_MODAL_OPEN,
    SET_JOIN_COMPETITION_MODAL_OPEN,
    SET_BUG_REPORT_MODAL_OPEN,
    SET_RESET_PASSWORD_MODAL_OPEN,
    SET_ADD_ANNOUNCEMENT_MODAL_OPEN,
    SET_SCORECARD_MODAL_OPEN,
    SET_SCORECARD_COMPARISON_MODAL_OPEN,
    SET_SELECTED_ACTIVITY,
    CLEAR_ANNOUNCEMENT_TO_ADD,
    SET_COMPETITION_INFO_MODAL_OPEN,
    SET_SELECTED_COMPETITION_INFO,
    SET_PAYMENT_CONFIRMATION_MODAL_OPEN,
    SET_BULK_PAYMENT_CONFIRMATION_MODAL_OPEN,
    SET_COMPETITION_PAYMENT_INFO,
    SET_ORGANIZATION_PAYMENT_INFO,
    SET_SIGNUP_TYPE_MODAL_OPEN,
    SET_TEAM_INVITE_TYPE_MODAL_OPEN,
    SET_MENTOR_INVITE_MODAL_OPEN,
    SET_INVITE_TO_SIM_MODAL_OPEN,
    SET_SIM_INVITE,
    CLEAR_SIM_INVITE,
    CLEAR_TEAM_MEMBERS
} from "./types";
import { ErrorTag } from "../utils/enums";
import { clearErrors } from "./errors";
import {
    getAllTeams,
    clearTeamToCreate,
    clearTeamInvite,
    setInviteBy,
    clearInviteBy
} from "./teams";
import { getAllUsers } from "./user";
import { getScorecardComparison, clearScorecardComparison } from "./competitions";

export const setActiveNavTab = tab => {
    if (tab)
        localStorage.setItem("navTab", tab);
    else
        localStorage.removeItem("navTab");
    return {
        type: SET_ACTIVE_NAV_TAB,
        payload: tab
    };
};

export const openAlert = alert => ({
    type: OPEN_ALERT,
    payload: alert
});

export const closeAlert = () => ({
    type: CLOSE_ALERT
});

export const openConfirmation = confirmation => ({
    type: OPEN_CONFIRM_MODAL,
    payload: confirmation
});

export const closeConfirmation = confirmation => ({
    type: CLOSE_CONFIRM_MODAL
});

export const openLoginModal = () => dispatch => {
    dispatch(clearErrors(ErrorTag.LOGIN));
    dispatch({
        type: SET_LOGIN_MODAL_OPEN,
        payload: true
    });
};

export const closeLoginModal = () => ({
    type: SET_LOGIN_MODAL_OPEN,
    payload: false
});

export const openCreateTeamModal = () => dispatch => {
    dispatch(clearErrors(ErrorTag.CREATE_TEAM));
    dispatch({
        type: SET_CREATE_TEAM_MODAL_OPEN,
        payload: true
    });
};

export const closeCreateTeamModal = (shouldSaveInfo) => dispatch => {
    dispatch({
        type: SET_CREATE_TEAM_MODAL_OPEN,
        payload: false
    });
    if (!shouldSaveInfo) {
        dispatch(clearTeamToCreate());
    }
};

export const openTeamInviteModal = (inviteBy) => dispatch => {
    dispatch(clearErrors(ErrorTag.TEAM_INVITE));
    if (inviteBy) {
        dispatch(setInviteBy(inviteBy));
    }
    dispatch({
        type: SET_TEAM_INVITE_MODAL_OPEN,
        payload: true
    });
};

export const closeTeamInviteModal = () => dispatch => {
    dispatch(clearTeamInvite());
    dispatch(clearInviteBy());
    dispatch({
        type: SET_TEAM_INVITE_MODAL_OPEN,
        payload: false
    });
};

export const openJoinTeamModal = () => dispatch => {
    dispatch(clearErrors(ErrorTag.JOIN_TEAM));
    dispatch({
        type: SET_JOIN_TEAM_MODAL_OPEN,
        payload: true
    });
};

export const closeJoinTeamModal = () => ({
    type: SET_JOIN_TEAM_MODAL_OPEN,
    payload: false
});

export const openJoinCompetitionModal = () => dispatch => {
    dispatch(clearErrors(ErrorTag.JOIN_COMPETITION));
    dispatch({
        type: SET_JOIN_COMPETITION_MODAL_OPEN,
        payload: true,
    })
}

export const closeJoinCompetitionModal = () => dispatch => {
    dispatch({
        type: SET_JOIN_COMPETITION_MODAL_OPEN,
        payload: false,
    })
}

export const openNotificationList = () => ({
    type: SET_NOTIFICATION_LIST_OPEN,
    payload: true
});

export const closeNotificationList = () => ({
    type: SET_NOTIFICATION_LIST_OPEN,
    payload: false
});

export const setAppLoading = isLoading => ({
    type: APP_LOADING,
    payload: isLoading
});

export const openResetPasswordModal = () => ({
    type: SET_RESET_PASSWORD_MODAL_OPEN,
    payload: true
});

export const closeResetPasswordModal = () => ({
    type: SET_RESET_PASSWORD_MODAL_OPEN,
    payload: false
});

export const openBugReportModal = () => dispatch => {
    dispatch(clearErrors(ErrorTag.BUG_REPORT));
    dispatch({
        type: SET_BUG_REPORT_MODAL_OPEN,
        payload: true
    });
};

export const closeBugReportModal = () => ({
    type: SET_BUG_REPORT_MODAL_OPEN,
    payload: false
});

export const openAddAnnouncementModal = () => dispatch => {
    dispatch(clearErrors(ErrorTag.ADD_ANNOUNCEMENT));
    dispatch(getAllTeams());
    dispatch(getAllUsers());
    dispatch({
        type: SET_ADD_ANNOUNCEMENT_MODAL_OPEN,
        payload: true
    });
};

export const closeAddAnnouncementModal = () => dispatch => {
    dispatch({ type: CLEAR_ANNOUNCEMENT_TO_ADD });
    dispatch({
        type: SET_ADD_ANNOUNCEMENT_MODAL_OPEN,
        payload: false
    });
};

export const openScorecardModal = (activity) => (dispatch) => {
    dispatch({
        type: SET_SELECTED_ACTIVITY,
        payload: activity
    });
    dispatch({
        type: SET_SCORECARD_MODAL_OPEN,
        payload: true
    });
};

export const closeScorecardModal = () => dispatch => {
    dispatch({
        type: SET_SELECTED_ACTIVITY,
        payload: {}
    });
    dispatch({
        type: SET_SCORECARD_MODAL_OPEN,
        payload: false
    });
};

export const openScorecardComparisonModal = (myTeamId, theirTeamId, activity) => (dispatch) => {
    dispatch(getScorecardComparison(myTeamId, theirTeamId, activity));
    dispatch({
        type: SET_SCORECARD_COMPARISON_MODAL_OPEN,
        payload: true
    });
};

export const closeScorecardComparisonModal = () => dispatch => {
    dispatch(clearScorecardComparison());
    dispatch({
        type: SET_SCORECARD_COMPARISON_MODAL_OPEN,
        payload: false
    });
};

export const openCompetitionInfoModal = (compId, callback) => (dispatch, getState) => {
    const selectedComp = getState().competitions.activeComps.find(c => c.id === compId);
    dispatch({
        type: SET_SELECTED_COMPETITION_INFO,
        payload: selectedComp
    });
    dispatch({
        type: SET_COMPETITION_INFO_MODAL_OPEN,
        payload: {
            open: true,
            callback: callback
        }
    });
};

export const closeCompetitionInfoModal = () => (dispatch) => {
    dispatch({
        type: SET_SELECTED_COMPETITION_INFO,
        payload: {}
    });
    dispatch({
        type: SET_COMPETITION_INFO_MODAL_OPEN,
        payload: false
    });
};

export const openPaymentConfirmationModal = (comp, price, paymentInfo, discountCode) => (dispatch) => {
    dispatch({
        type: SET_COMPETITION_PAYMENT_INFO,
        payload: { comp, price, paymentInfo, discountCode }
    });
    dispatch({
        type: SET_PAYMENT_CONFIRMATION_MODAL_OPEN,
        payload: true
    });
};

export const closePaymentConfirmationModal = () => (dispatch) => {
    dispatch({
        type: SET_COMPETITION_PAYMENT_INFO,
        payload: null
    });
    dispatch({
        type: SET_PAYMENT_CONFIRMATION_MODAL_OPEN,
        payload: false
    });
};

export const openBulkPaymentConfirmationModal = (comp, orgId, numStudents, price, paymentInfo) => (dispatch) => {
    dispatch({
        type: SET_COMPETITION_PAYMENT_INFO,
        payload: { comp, price, paymentInfo }
    });
    dispatch({
        type: SET_ORGANIZATION_PAYMENT_INFO,
        payload: { id: orgId, numStudents }
    });
    dispatch({
        type: SET_BULK_PAYMENT_CONFIRMATION_MODAL_OPEN,
        payload: true
    });
};

export const closeBulkPaymentConfirmationModal = () => (dispatch) => {
    dispatch({
        type: SET_COMPETITION_PAYMENT_INFO,
        payload: null
    });
    dispatch({
        type: SET_ORGANIZATION_PAYMENT_INFO,
        payload: { id: null, numStudents: 0 }
    });
    dispatch({
        type: SET_BULK_PAYMENT_CONFIRMATION_MODAL_OPEN,
        payload: false
    });
};

export const openSignupTypeModal = () => ({
    type: SET_SIGNUP_TYPE_MODAL_OPEN,
    payload: true 
});

export const closeSignupTypeModal = () => ({
    type: SET_SIGNUP_TYPE_MODAL_OPEN,
    payload: false
});

export const openTeamInviteTypeModal = () => ({
    type: SET_TEAM_INVITE_TYPE_MODAL_OPEN,
    payload: true 
});

export const closeTeamInviteTypeModal = () => ({
    type: SET_TEAM_INVITE_TYPE_MODAL_OPEN,
    payload: false
});

export const openMentorInviteModal = () => ({
    type: SET_MENTOR_INVITE_MODAL_OPEN,
    payload: true 
});

export const closeMentorInviteModal = () => ({
    type: SET_MENTOR_INVITE_MODAL_OPEN,
    payload: false
});

export const openInviteToSimModal = (team) => dispatch => {
    dispatch({
        type: CLEAR_TEAM_MEMBERS
    });
    dispatch({
        type: SET_SIM_INVITE,
        payload: { team }
    });
    dispatch({
        type: SET_INVITE_TO_SIM_MODAL_OPEN,
        payload: true
    });
};

export const closeInviteToSimModal = () => dispatch => {
    dispatch({
        type: CLEAR_SIM_INVITE
    });
    dispatch({
        type: SET_INVITE_TO_SIM_MODAL_OPEN,
        payload: false
    });
};

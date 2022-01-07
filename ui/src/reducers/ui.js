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
    SET_BUG_REPORT_MODAL_OPEN,
    SET_RESET_PASSWORD_MODAL_OPEN,
    BUG_REPORT_LOADING,
    SET_JOIN_COMPETITION_MODAL_OPEN,
    SET_ADD_ANNOUNCEMENT_MODAL_OPEN,
    SET_SCORECARD_MODAL_OPEN,
    SET_SCORECARD_COMPARISON_MODAL_OPEN,
    SET_COMPETITION_INFO_MODAL_OPEN,
    SET_PAYMENT_CONFIRMATION_MODAL_OPEN,
    SET_BULK_PAYMENT_CONFIRMATION_MODAL_OPEN,
    SET_SIGNUP_TYPE_MODAL_OPEN,
    SET_TEAM_INVITE_TYPE_MODAL_OPEN,
    SET_MENTOR_INVITE_MODAL_OPEN,
    SET_INVITE_TO_SIM_MODAL_OPEN
} from "../actions/types";

const initialState = {
    loading: true,
    alert: {},
    alertOpen: false,
    confirmation: {},
    confirmationOpen: false,
    activeNavTab: localStorage.getItem("navTab") || "Home",
    loginModalOpen: false,
    createTeamModalOpen: false,
    teamInviteModalOpen: false,
    notificationListOpen: false,
    joinTeamModalOpen: false,
    joinCompetitionModalOpen: false,
    resetPasswordModalOpen: false,
    bugReportModalOpen: false,
    bugReportLoading: false,
    addAnnouncementModalOpen: false,
    scorecardModalOpen: false,
    scorecardComparisonModalOpen: false,
    competitionInfoModalOpen: false,
    closeCompetitionInfoCallback: () => {},
    paymentConfirmationModalOpen: false,
    bulkPaymentConfirmationModalOpen: false,
    signupTypeModalOpen: false,
    teamInviteTypeModalOpen: false,
    mentorInviteModalOpen: false,
    inviteToSimModalOpen: false
};

const ui = (state = initialState, action) => {
    switch (action.type) {
        case APP_LOADING: {
            return { ...state, loading: action.payload };
        }
        case OPEN_ALERT: {
            return { ...state, alert: action.payload, alertOpen: true };
        }
        case CLOSE_ALERT: {
            return { ...state, alertOpen: false };
        }
        case OPEN_CONFIRM_MODAL: {
            return { ...state, confirmation: action.payload, confirmationOpen: true };
        }
        case CLOSE_CONFIRM_MODAL: {
            return { ...state, confirmationOpen: false };
        }
        case SET_ACTIVE_NAV_TAB: {
            return { ...state, activeNavTab: action.payload };
        }
        case SET_LOGIN_MODAL_OPEN: {
            return { ...state, loginModalOpen: action.payload };
        }
        case SET_CREATE_TEAM_MODAL_OPEN: {
            return { ...state, createTeamModalOpen: action.payload };
        }
        case SET_TEAM_INVITE_MODAL_OPEN: {
            return { ...state, teamInviteModalOpen: action.payload };
        }
        case SET_NOTIFICATION_LIST_OPEN: {
            return { ...state, notificationListOpen: action.payload };
        }
        case SET_JOIN_TEAM_MODAL_OPEN: {
            return { ...state, joinTeamModalOpen: action.payload };
        }
        case SET_JOIN_COMPETITION_MODAL_OPEN: {
            return {...state, joinCompetitionModalOpen: action.payload};
        }
        case SET_RESET_PASSWORD_MODAL_OPEN: {
            return { ...state, resetPasswordModalOpen: action.payload };
        }
        case SET_BUG_REPORT_MODAL_OPEN: {
            return { ...state, bugReportModalOpen: action.payload };
        }
        case SET_ADD_ANNOUNCEMENT_MODAL_OPEN: {
            return { ...state, addAnnouncementModalOpen: action.payload };
        }
        case SET_SCORECARD_MODAL_OPEN: {
            return { ...state, scorecardModalOpen: action.payload };
        }
        case SET_SCORECARD_COMPARISON_MODAL_OPEN: {
            return { ...state, scorecardComparisonModalOpen: action.payload };
        }
        case SET_COMPETITION_INFO_MODAL_OPEN: {
            return {
                ...state,
                competitionInfoModalOpen: action.payload.open,
                closeCompetitionInfoCallback: action.payload.callback || (() => {}),
            };
        }
        case SET_PAYMENT_CONFIRMATION_MODAL_OPEN: {
            return {
                ...state,
                paymentConfirmationModalOpen: action.payload
            };
        }
        case SET_BULK_PAYMENT_CONFIRMATION_MODAL_OPEN: {
            return {
                ...state,
                bulkPaymentConfirmationModalOpen: action.payload
            };
        }
        case SET_SIGNUP_TYPE_MODAL_OPEN: {
            return {
                ...state,
                signupTypeModalOpen: action.payload
            };
        }
        case SET_TEAM_INVITE_TYPE_MODAL_OPEN: {
            return {
                ...state,
                teamInviteTypeModalOpen: action.payload
            };
        }
        case SET_MENTOR_INVITE_MODAL_OPEN: {
            return {
                ...state,
                mentorInviteModalOpen: action.payload
            };
        }
        case SET_INVITE_TO_SIM_MODAL_OPEN: {
            return {
                ...state,
                inviteToSimModalOpen: action.payload
            };
        }
        case BUG_REPORT_LOADING: {
            return { ...state, bugReportLoading: action.payload };
        }
        default: {
            return state;
        }
    }
};

export default ui;

import {
    SET_USER,
    SET_ALL_USERS,
    USER_LOADING,
    ALL_USERS_LOADING,
    USER_UPDATE_EDITING,
    USER_UPDATE_LOADING,
    RESET_PASSWORD_LOADING,
    SET_ACTIVE_NAV_TAB,
    SET_SCHOOLS_AND_ORGS,
    SET_SCHOOLS_AND_ORGS_LOADING,
    SET_PARENT_INFO_LOADING,
    SET_SUBMIT_PARENT_LOADING,
    SET_PARENT_CONSENT_LOADING,
    SET_PARENT_CONSENT_STATUS,
    SET_USER_PARENT_DATA,
    SET_PARENT_DATA,
    SET_PARTIAL_USER,
    SET_COMPETITION_USERS_LOADING,
    SET_COMPETITION_USERS,
    LOGOUT
} from "./types";
import moment from "moment";
import { addError, clearErrors } from "./errors";
import { openAlert, closeAlert, closeLoginModal, closeResetPasswordModal, setAppLoading } from "./ui";
import { ALERT_TIME, PARENT_CONSENT_AGE } from "../utils/constants";
import { getTeams } from "./teams";
import { getUserCompetitions, getAllActiveCompetitions } from './competitions';
import { ErrorTag, AlertType } from "../utils/enums";
import authServer, { AuthService } from "../api/auth";
import { getNotifications } from "./notifications";
import store from "../store";

export const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        store.dispatch(logout());
        store.dispatch({ type: SET_ACTIVE_NAV_TAB, payload: "Home" });
        return null;
    }
    return token;
};

const getUserData = async token => {
    try {
        const userResult = await authServer.get(
            "/users", { headers: { Authorization: token } }
        );
        return userResult.data;
    } catch (err) {
        throw err;
    }
};

const _getAllUsers = async (token) => {
    try {
        const usersResult = await authServer.get(
            "/users/all", { headers: { Authorization: token } }
        );
        return usersResult.data;
    } catch (err) {
        throw err;
    }
};

const _updateUser = async (userData, token) => {
    try {
        const userResult = await authServer.patch(
            "/users", userData, { headers: { Authorization: token } }
        );
        return userResult.data;
    } catch (err) {
        throw err;
    }
};

const _sendPasswordResetLink = async email => {
    try {
        await authServer.get(`/users/reset-password?email=${email}`);
    } catch (err) {
        throw err;
    }
};

const _resetPassword = async (email, password, key) => {
    try {
        await authServer.patch(`/users/reset-password/${key}`, { email, password });
    } catch (err) {
        throw err;
    }
};

const _getSchoolsAndOrgs = async () => {
    try {
        const resp = await authServer.get("/users/schools-and-organizations");
        return resp.data;
    } catch (err) {
        throw err;
    }
};

const _submitParentInfo = async (parentData, token) => {
    try {
        const parentResult = await authServer.post(
            "/users/parent", parentData, { headers: { Authorization: token } }
        );
        return parentResult.data;
    } catch (err) {
        throw err;
    }
};

const _updateParentInfo = async (parentData, token) => {
    try {
        const parentResult = await authServer.patch(
            "/users/parent", parentData, { headers: { Authorization: token } }
        );
        return parentResult.data;
    } catch (err) {
        throw err;
    }
};

const _getParentData = async (token) => {
    try {
        const parentResult = await authServer.get(
            "/users/parent",
            { headers: { Authorization: token }}
        );
        return parentResult.data;
    } catch (err) {
        // Ignore 404 b/c some users don't have parent
        if (err.response && err.response.status === 404) {
            return null;
        }
        throw err;
    }
};

const _getUserDataFromParent = async (userId, hash) => {
    try {
        const userResult = await authServer.get(
            `/users/parent-data?user_id=${encodeURIComponent(userId)}&hash=${encodeURIComponent(hash)}`
        );
        return userResult.data;
    } catch (err) {
        throw err;
    }
};

const _submitParentConsent = async (userId, hash, consentStatus) => {
    try {
        const status = await authServer.post(
            "/users/parent-consent",
            { userId, hash, consentStatus }
        );
        return status.data;
    } catch (err) {
        throw err;
    }
};

const _getPartialUser = async (email, hash) => {
    try {
        const partialUser = await authServer.get(
            `/users/partial?hash=${hash}&email=${email}`,
        );
        return partialUser.data;
    } catch (err) {
        throw err;
    }
};

const _activateAccount = async (userData, hash) => {
    try {
        const result = await authServer.post(
            "/users/activate-account",
            { ...userData, hash }
        );
        return result.data;
    } catch (err) {
        throw err;
    }
};

const _getCompetitionUsers = async (compId, token) => {
    try {
        const result = await authServer.get(
            `/users/competition?competition_id=${compId}`,
            { headers: { Authorization: token } }
        );
        return result.data;
    } catch (err) {
        throw err;
    }
};

const _getCompetitionMentors = async (compId, token) => {
    try {
        const result = await authServer.get(
            `/users/mentors/competition?competition_id=${compId}`,
            { headers: { Authorization: token } }
        );
        return result.data;
    } catch (err) {
        throw err;
    }
};

const _getUnpaidUsers = async (token) => {
    try {
        const result = await authServer.get(
            "/users/unpaid",
            { headers: { Authorization: token } }
        );
        return result.data;
    } catch (err) {
        throw err;
    }
};

export const getSchoolsAndOrgs = () => async (dispatch) => {
    try {
        dispatch(clearErrors(ErrorTag.SCHOOLS_AND_ORGS_LOOKUP));
        dispatch({ type: SET_SCHOOLS_AND_ORGS_LOADING, payload: true });

        const schoolsAndOrgs = await _getSchoolsAndOrgs();

        dispatch({ type: SET_SCHOOLS_AND_ORGS, payload: schoolsAndOrgs });

    } catch (err) {
        err.tag = ErrorTag.SCHOOLS_AND_ORGS_LOOKUP;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_SCHOOLS_AND_ORGS_LOADING, payload: false });
    }
};

export const addSchoolOrOrg = (value) => (dispatch, getState) => {
    dispatch({
        type: SET_SCHOOLS_AND_ORGS,
        payload: [...getState().user.schoolsAndOrgs.list, value]
    });
};

export const signup = (userData, registrationSource, competitionId, history) => async dispatch => {
    if (userData.password !== userData.confirmPassword) {
        dispatch(addError({
            tag: ErrorTag.SIGNUP,
            field: "confirmPassword",
            message: "Passwords do not match"
        }));
        return;
    }

    dispatch(clearErrors(ErrorTag.SIGNUP));
    dispatch({ type: USER_LOADING, payload: true });

    try {
        const authService = new AuthService();
        await authService.createUser(
            userData.username, userData.email, userData.password, registrationSource, competitionId
        );
        dispatch(login(userData.username, userData.password));
        let nextUrl = "/finish-registration";
        history.push(nextUrl);
    } catch (err) {
        err.tag = ErrorTag.SIGNUP;
        dispatch(addError(err));
    } finally {
        dispatch({ type: USER_LOADING, payload: false });
    }
};

export const submitAccountInfo = (accountInfo, history) => async (dispatch, getState) => {
    try {
        dispatch(clearErrors(ErrorTag.ACCOUNT_INFO));
        dispatch({ type: USER_LOADING, payload: true });

        const token = getToken();
        if (!token)
            return;
        const authService = new AuthService();
        const updatedUser = await authService.submitAccountInfo(accountInfo, token);

        const now = new Date();
        const dob = new Date(updatedUser.dateOfBirth);
        const diff = new Date(now.getTime() - dob.getTime());
        const age = diff.getUTCFullYear() - 1970;
        let nextUrl = age >= PARENT_CONSENT_AGE ? "/competition-registration" : "/parent-info";
        const hasPaid = getState().competitions.userComps.length > 0;
        if (hasPaid)
            nextUrl = "/";

        history.push(nextUrl);

        dispatch(loadUserData());

    } catch (err) {
        err.tag = ErrorTag.ACCOUNT_INFO;
        dispatch(addError(err));
    } finally {
        dispatch({ type: USER_LOADING, payload: false });
    }
};

export const mentorSignup = (userData, hash, history) => async dispatch => {
    if (userData.password !== userData.confirmPassword) {
        dispatch(addError({
            tag: ErrorTag.SIGNUP,
            field: "confirmPassword",
            message: "Passwords do not match"
        }));
        return;
    }

    dispatch(clearErrors(ErrorTag.SIGNUP));
    dispatch({ type: USER_LOADING, payload: true });

    try {
        await authServer.post("/users/mentor", { ...userData, hash });
        dispatch(login(userData.username, userData.password));
        history.push("/");
    } catch (err) {
        err.tag = ErrorTag.SIGNUP;
        dispatch(addError(err));
    } finally {
        dispatch({ type: USER_LOADING, payload: false });
    }
};

// TODO(adam): Set auth header globally
export const login = (usernameOrEmail, password) => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.LOGIN));
        dispatch({ type: USER_LOADING, payload: true });

        // Get token
        const email_exp = /^[^\s;@]+@[^\s;@]+\.[^\s;@]+$/;
        let loginResult;
        if (email_exp.test(usernameOrEmail)) {
            loginResult = await authServer.post("/login", { email: usernameOrEmail, password });
        } else {
            loginResult = await authServer.post("/login", { username: usernameOrEmail, password });
        }  
        const token = loginResult.data;
        localStorage.setItem("token", token);

        // Get user info
        try {
            const user = await getUserData(token);
            dispatch(clearErrors(ErrorTag.USER));
            dispatch({
                type: SET_USER,
                payload: { ...user, loggedIn: true }
            });
            dispatch(closeLoginModal());
            dispatch(loadUserData());

        } catch (err) {
            err.tag = ErrorTag.USER;
            dispatch(addError(err));
        }
    } catch (err) {
        err.tag = ErrorTag.LOGIN;
        dispatch(addError(err));
    } finally {
        dispatch({ type: USER_LOADING, payload: false });
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("navTab");
    return {
        type: LOGOUT
    };
};

export const loadUserData = () => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.USER));
        dispatch({ type: USER_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;

        const user = await getUserData(token);
        dispatch({
            type: SET_USER,
            payload: { ...user, loggedIn: true }
        });

        // Intial User data fetch
        dispatch(getTeams());
        dispatch(getNotifications());
        dispatch(getUserCompetitions());
        dispatch(getAllActiveCompetitions());
        dispatch(getParentData());

    } catch (err) {
        err.tag = ErrorTag.USER;
        dispatch(addError(err));
        logout();
    } finally {
        dispatch({ type: USER_LOADING, payload: false });
        dispatch(setAppLoading(false));
    }
};

export const userUpdateEditing = editingData => ({
    type: USER_UPDATE_EDITING,
    payload: editingData
});

export const userUpdateLoading = loadingData => ({
    type: USER_UPDATE_LOADING,
    payload: loadingData
});

export const updateUser = (field, value) => async dispatch => {
    try {
        dispatch(userUpdateLoading({ [field]: true }));
        let token;
        if (!(token = getToken()))
            return;

        await _updateUser({ [field]: value }, token);
        dispatch(clearErrors(ErrorTag.USER_UPDATE));
        dispatch(userUpdateEditing({ [field]: false }));
        dispatch(loadUserData());

    } catch (err) {
        dispatch(clearErrors(ErrorTag.USER_UPDATE));
        err.tag = ErrorTag.USER_UPDATE;
        dispatch(addError(err));
    } finally {
        dispatch(userUpdateLoading({ [field]: false }));
    }
};

export const sendPasswordResetLink = email => async dispatch => {
    try {
        dispatch(userUpdateLoading({ password: true }));

        await _sendPasswordResetLink(email);
        dispatch(clearErrors(ErrorTag.RESET_PASSWORD));
        dispatch(closeResetPasswordModal());
        dispatch(openAlert({
            type: AlertType.SUCCESS,
            header: "Password Reset Link Sent",
            message: "A password reset link has been sent to " + email + ". "
        }));
        setTimeout(() => dispatch(closeAlert()), ALERT_TIME);

    } catch (err) {
        dispatch(clearErrors(ErrorTag.RESET_PASSWORD));
        err.tag = ErrorTag.RESET_PASSWORD;
        dispatch(addError(err));
    } finally {
        dispatch(userUpdateLoading({ password: false }));
    }
};

export const resetPassword = (formData, history, key) => async dispatch => {
    try {
        dispatch({ type: RESET_PASSWORD_LOADING, payload: true });
        if (formData.password !== formData.confirmPassword) {
            dispatch(addError({
                tag: ErrorTag.RESET_PASSWORD,
                field: "confirmPassword",
                message: "Passwords do not match"
            }));
            return;
        }

        await _resetPassword(formData.email, formData.password, key);
        dispatch(clearErrors(ErrorTag.RESET_PASSWORD));
        dispatch(openAlert({
            type: AlertType.SUCCESS,
            header: "Password Reset",
            message: "Your password has been reset successfully."
        }));
        setTimeout(() => dispatch(closeAlert()), ALERT_TIME);
        dispatch({ type: SET_ACTIVE_NAV_TAB, payload: "Home" });
        history.push("");

    } catch (err) {
        dispatch(clearErrors(ErrorTag.RESET_PASSWORD));
        err.tag = ErrorTag.RESET_PASSWORD;
        dispatch(addError(err));
    } finally {
        dispatch({ type: RESET_PASSWORD_LOADING, payload: false });
    }
};

export const getAllUsers = () => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.USER_SEARCH));
        dispatch({ type: ALL_USERS_LOADING, payload: true });
        const token = getToken();
        if (!token)
            return;
        const allUsers = await _getAllUsers(token);
        dispatch({ type: SET_ALL_USERS, payload: allUsers });
    } catch (err) {
        dispatch(clearErrors(ErrorTag.USER_SEARCH));
        err.tag = ErrorTag.USER_SEARCH;
        dispatch(addError(err));
    } finally {
        dispatch({ type: ALL_USERS_LOADING, payload: false });
    }
};

export const submitParentInfo = (parentData, history) => async (dispatch, getState) => {
    try {
        dispatch({ type: SET_SUBMIT_PARENT_LOADING, payload: true });
        dispatch(clearErrors(ErrorTag.PARENT_INFO));
        const token = getToken();
        if (!token)
            return;

        const result = await _submitParentInfo(parentData, token);
        dispatch({ type: SET_PARENT_DATA, payload: result });
        let nextUrl = "/competition-registration";
        const hasPaid = getState().competitions.userComps.length > 0;
        if (hasPaid)
            nextUrl = "/";
        history.push(nextUrl);

    } catch (err) {
        dispatch(clearErrors(ErrorTag.PARENT_INFO));
        err.tag = ErrorTag.PARENT_INFO;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_SUBMIT_PARENT_LOADING, payload: false });
    }
};

export const updateParentInfo = (parentData, history) => async (dispatch) => {
    try {
        dispatch({ type: SET_SUBMIT_PARENT_LOADING, payload: true });
        dispatch(clearErrors(ErrorTag.PARENT_INFO));
        const token = getToken();
        if (!token)
            return;

        await _updateParentInfo(parentData, token);
        dispatch(openAlert({
            type: AlertType.SUCCESS,
            header: "Parent Info Updated",
            message: "Your parent information has been updated. " +
                "Let them know to check their email for a welcome email."
        }));
        setTimeout(() => dispatch(closeAlert()), ALERT_TIME);
        history.push("/");

    } catch (err) {
        dispatch(clearErrors(ErrorTag.PARENT_INFO));
        err.tag = ErrorTag.PARENT_INFO;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_SUBMIT_PARENT_LOADING, payload: false });
    }
};

export const getParentData = () => async (dispatch) => {
    try {
        dispatch({ type: SET_PARENT_INFO_LOADING, payload: true });
        dispatch(clearErrors(ErrorTag.PARENT_INFO));
        const token = getToken();
        if (!token)
            return;

        const result = await _getParentData(token);
        dispatch({ type: SET_PARENT_DATA, payload: result });

    } catch (err) {
        dispatch(clearErrors(ErrorTag.PARENT_INFO));
        err.tag = ErrorTag.PARENT_INFO;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_PARENT_INFO_LOADING, payload: false });
    }
};

export const getUserDataFromParent = (userId, hash) => async (dispatch) => {
    try {
        dispatch(clearErrors(ErrorTag.USER));
        dispatch({ type: USER_LOADING, payload: true });

        const result = await _getUserDataFromParent(userId, hash);
        dispatch({ type: SET_USER_PARENT_DATA, payload: result });

    } catch (err) {
        dispatch(clearErrors(ErrorTag.USER));
        err.tag = ErrorTag.USER;
        dispatch(addError(err));
    } finally {
        dispatch({ type: USER_LOADING, payload: false });
    }
};

export const submitParentConsent = (userId, hash, consentStatus, history) => async (dispatch) => {
    try {
        dispatch({ type: SET_PARENT_CONSENT_LOADING, payload: true });
        dispatch(clearErrors(ErrorTag.PARENT_CONSENT));

        const result = await _submitParentConsent(userId, hash, consentStatus);
        dispatch({ type: SET_PARENT_CONSENT_STATUS, payload: result });

    } catch (err) {
        dispatch({ type: SET_PARENT_CONSENT_STATUS, payload: null });
        dispatch(clearErrors(ErrorTag.PARENT_CONSENT));
        err.tag = ErrorTag.PARENT_CONSENT;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_PARENT_CONSENT_LOADING, payload: false });
    }
};

export const getPartialUser = (email, hash) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOADING, payload: true });
        dispatch(clearErrors(ErrorTag.SIGNUP));

        const partialUser = await _getPartialUser(email, hash);
        dispatch({ type: SET_PARTIAL_USER, payload: partialUser });
        
    } catch (err) {
        err.tag = ErrorTag.SIGNUP;
        dispatch(addError(err));
    } finally {
        dispatch({ type: USER_LOADING, payload: false });
    }
};

export const clearPartialUser = ({
    type: SET_PARTIAL_USER,
    payload: null
});

export const activateAccount = (userData, hash, competitionId, history) => async (dispatch) => {
    try {
        if (userData.password !== userData.confirmPassword) {
            dispatch(addError({
                tag: ErrorTag.SIGNUP,
                field: "confirmPassword",
                message: "Passwords do not match"
            }));
            return;
        }
        dispatch({ type: USER_LOADING, payload: true });
        dispatch(clearErrors(ErrorTag.SIGNUP));

        const { hasPaid } = await _activateAccount(userData, hash);

        dispatch(login(userData.username, userData.password));
        const now = new Date();
        const dob = new Date(userData.dateOfBirth);
        const diff = new Date(now.getTime() - dob.getTime());
        const age = diff.getUTCFullYear() - 1970;
        const paymentUrl = hasPaid ? "/" : "/competition-registration";
        let nextUrl = age >= 18 ? paymentUrl : "/parent-info";

        let token = getToken();
        if (!token)
            return;
        try {
            await _getParentData(token);
            // If succeeds, parent data is already present
            nextUrl = paymentUrl;
        } catch (err) {
            if (err && err.response && err.response.status === 404) {
            } else {
                throw err;
            }
        }

        if (!hasPaid && competitionId)
            nextUrl += "?competition_id=" + competitionId;
        history.push(nextUrl);
        
    } catch (err) {
        err.tag = ErrorTag.SIGNUP;
        dispatch(addError(err));
    } finally {
        dispatch({ type: USER_LOADING, payload: false });
    }
};

export const getCompetitionUsers = (compId, type) => async (dispatch) => {
    try {
        dispatch(clearErrors(ErrorTag.COMPETITION_USERS));
        dispatch({ type: SET_COMPETITION_USERS_LOADING, payload: true });

        const token = getToken();
        if (!token)
            return;

        let users;
        if (type === "mentor") {
            users = await _getCompetitionMentors(compId, token);
        } else if (type === "paid") {
            users = await _getCompetitionUsers(compId, token);
        } else if (type === "unpaid") {
            users = await _getUnpaidUsers(token);
        } else {
            users = [];
        }

        dispatch({ type: SET_COMPETITION_USERS, payload: users });

    } catch (err) {
        err.tag = ErrorTag.COMPETITION_USERS;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_COMPETITION_USERS_LOADING, payload: false });
    }
};

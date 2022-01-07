import {
    SET_USER,
    SET_ALL_USERS,
    USER_LOADING,
    ALL_USERS_LOADING,
    USER_UPDATE_EDITING,
    USER_UPDATE_LOADING,
    RESET_PASSWORD_LOADING,
    SET_SCHOOLS_AND_ORGS,
    SET_SCHOOLS_AND_ORGS_LOADING,
    SET_PARENT_INFO_LOADING,
    SET_SUBMIT_PARENT_LOADING,
    SET_PARENT_CONSENT_LOADING,
    SET_PARENT_DATA,
    SET_USER_PARENT_DATA,
    SET_PARENT_CONSENT_STATUS,
    SET_PARTIAL_USER,
    SET_COMPETITION_USERS_LOADING,
    SET_COMPETITION_USERS,
    LOGOUT
} from "../actions/types";

const initialState = {
    loading: false,
    parentInfoLoading: false,
    submitParentLoading: false,
    parentConsentLoading: false,
    loggedIn: false,
    resetPasswordLoading: false,
    updateLoading: {
        username: false,
        email: false
    },
    updateEditing: {
        username: false,
        email: false
    },
    allUsers: {
        list: [],
        loading: false
    },
    schoolsAndOrgs: {
        list: [],
        loading: false
    },
    competitionUsers: {
        list: [],
        loading: false
    },
    parent: null,
    userParentData: null,
    parentConsentStatus: null,
    partialUser: null
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER: {
            return { ...state, ...action.payload, loading: false };
        }
        case SET_ALL_USERS: {
            return { ...state, allUsers: { list: action.payload, loading: false } };
        }
        case USER_LOADING: {
            return { ...state, loading: action.payload };
        }
        case ALL_USERS_LOADING: {
            return { ...state, allUsers: { ...state.allUsers, loading: action.payload } };
        }
        case USER_UPDATE_LOADING: {
            return {
                ...state,
                updateLoading: {
                    ...state.updateLoading,
                    ...action.payload
                }
            };
        }
        case USER_UPDATE_EDITING: {
            return {
                ...state,
                updateEditing: {
                    ...state.updateLoading,
                    ...action.payload
                }
            };
        }
        case RESET_PASSWORD_LOADING: {
            return {
                ...state,
                resetPasswordLoading: action.payload
            };
        }
        case SET_SCHOOLS_AND_ORGS: {
            return { ...state, schoolsAndOrgs: { list: action.payload, loading: false } };
        }
        case SET_SCHOOLS_AND_ORGS_LOADING: {
            return { ...state, schoolsAndOrgs: { ...state.schoolsAndOrgs, loading: action.payload } };
        }
        case SET_PARENT_INFO_LOADING: {
            return { ...state, parentInfoLoading: action.payload };
        }
        case SET_SUBMIT_PARENT_LOADING: {
            return { ...state, submitParentLoading: action.payload };
        }
        case SET_PARENT_CONSENT_LOADING: {
            return { ...state, parentConsentLoading: action.payload };
        }
        case SET_PARENT_DATA: {
            return { ...state, parent: action.payload };
        }
        case SET_USER_PARENT_DATA: {
            return { ...state, userParentData: action.payload };
        }
        case SET_PARENT_CONSENT_STATUS: {
            return { ...state, parentConsentStatus: action.payload };
        }
        case SET_PARTIAL_USER: {
            return { ...state, partialUser: action.payload };
        }
        case SET_COMPETITION_USERS_LOADING: {
            return {
                ...state,
                competitionUsers: {
                    ...state.competitionUsers,
                    loading: action.payload
                }
            };
        }
        case SET_COMPETITION_USERS: {
            return {
                ...state,
                competitionUsers: {
                    ...state.competitionUsers,
                    list: action.payload
                }
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

export default user;

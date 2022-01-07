import {
    USER_SEARCH,
    USER_SEARCH_LOADING,
    CLEAR_USER_SEARCH,
    LOGOUT
} from "../actions/types";

const asArray = v => Array.isArray(v) ? v : [v];

const initialState = {
    users: {
        results: [],
        loading: false
    }
};

const search = (state = initialState, action) => {
    switch (action.type) {
        case USER_SEARCH: {
            return { ...state, users: {
                results: asArray(action.payload),
                loading: false
            }};
        }
        case USER_SEARCH_LOADING: {
            return { ...state, users: {
                ...state.users,
                usersLoading: action.payload
            }};
        }
        case CLEAR_USER_SEARCH: {
            return { ...state, users: {
                results: [],
                loading: false
            }};
        }
        case LOGOUT: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default search;

import {
    SET_SIMS,
    SIMS_LOADING,
    SIMS_REFRESHING,
    LOGOUT
} from "../actions/types";

const initialState = {
    list: [],
    loading: false,
    refreshing: false
};

const sims = (state = initialState, action) => {
    switch (action.type) {
        case SET_SIMS: {
            return { list: action.payload, loading: false, refreshing: false };
        }
        case SIMS_LOADING: {
            return { ...state, loading: action.payload };
        }
        case SIMS_REFRESHING: {
            return { ...state, refreshing: action.payload };
        }
        case LOGOUT: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default sims;

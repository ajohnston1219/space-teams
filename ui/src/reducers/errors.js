import {
    SET_ERRORS,
    CLEAR_ERRORS,
    LOGOUT
} from "../actions/types";

const initialState = null;

const errors = (state = initialState, action) => {
    switch (action.type) {
        case SET_ERRORS: {
            return state
                ? [ ...state, ...action.payload ]
                : action.payload
        }
        case CLEAR_ERRORS: {
            if (!action.payload)
                return null;
            return state && state.filter(e => e.tag !== action.payload);
        }
        case LOGOUT: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default errors;

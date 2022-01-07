import { SET_NOTIFICATIONS, NOTIFICATIONS_LOADING, LOGOUT } from "../actions/types";

const initialState = {
    list: [],
    loading: false
};

const notifications = (state = initialState, action) => {
    switch (action.type) {
        case SET_NOTIFICATIONS: {
            return { list: action.payload, loading: false };
        }
        case NOTIFICATIONS_LOADING: {
            return { ...state, loading: action.payload };
        }
        case LOGOUT: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default notifications;

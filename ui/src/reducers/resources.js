import {
    SET_DOWNLOAD_LINK,
    SET_DOWNLOAD_LINK_LOADING,
    LOGOUT
} from "../actions/types";

const initialState = {
    downloadLink: null,
    downloadLinkLoading: false
};

const resources = (state = initialState, action) => {
    switch (action.type) {
        case SET_DOWNLOAD_LINK: {
            return { ...state, downloadLink: action.payload };
        }
        case SET_DOWNLOAD_LINK_LOADING: {
            return { ...state, downloadLinkLoading: action.payload };
        }
        case LOGOUT: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default resources;

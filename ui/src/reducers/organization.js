import {
    SET_ORGANIZATION_LOADING,
    SET_CREATE_ORGANIZATION_LOADING,
    SET_ORGANIZATION_DATA,
    LOGOUT
} from "../actions/types";

const initialState = {
    loading: false,
    createOrgLoading: false,
    org: null
};

const organization = (state = initialState, action) => {
    switch (action.type) {
        case SET_ORGANIZATION_LOADING: {
            return { ...state, loading: action.payload };
        }
        case SET_CREATE_ORGANIZATION_LOADING: {
            return { ...state, createOrgLoading: action.payload };
        }
        case SET_ORGANIZATION_DATA: {
            return { ...state, org: action.payload };
        }
        case LOGOUT: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default organization;

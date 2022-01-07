import {
    USER_SEARCH,
    USER_SEARCH_LOADING,
    CLEAR_USER_SEARCH
} from "./types";
import authServer from "../api/auth";
import { ErrorTag } from "../utils/enums";
import { addError, clearErrors } from "./errors";
import { getToken } from "./user";

const _userSearch = async (query, token) => {
    try {
        const result = await authServer.get(
            encodeURI(`/users?query=${query}`),
            { headers: { Authorization: token } }
        );
        return result.data;
    } catch (err) {
        throw err;
    }
};

export const userSearch = query => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.USER_SEARCH));
        dispatch({ type: USER_SEARCH_LOADING, payload: true });

        let token;
        if (!(token = getToken()))
            return;

        const users = await _userSearch(query, token);
        dispatch({ type: USER_SEARCH, payload: users });

    } catch (err) {
        err.tag = ErrorTag.USER_SEARCH;
        dispatch(addError(err));
    } finally {
        dispatch({ type: USER_SEARCH_LOADING, payload: false });
    }
};

export const clearUserSearch = () => ({ type: CLEAR_USER_SEARCH });

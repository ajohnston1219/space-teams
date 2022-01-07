import {
    SET_SIMS,
    SIMS_LOADING,
    SIMS_REFRESHING
} from "./types";
import { addError, clearErrors } from "./errors";
import { getToken } from "./user";
import { ErrorTag } from "../utils/enums";
import simsServer from "../api/sims";

const getAvailableSims = async token => {
    try {
        const simsResult = await simsServer.get(
            "/", { headers: { Authorization: token } }
        );
        return simsResult.data;
    } catch (err) {
        throw err;
    }
};

export const getSims = (refreshing = false) => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.SIMS));
        if (refreshing) {
            dispatch({ type: SIMS_REFRESHING, payload: true });
        } else {
            dispatch({ type: SIMS_LOADING, payload: true });
        }
        let token;
        if (!(token = getToken()))
            return;

        const sims = await getAvailableSims(token);
        const simsList = [];
        Object.keys(sims)
              .forEach(k => {
                  sims[k].forEach(s => simsList.push({ ...s, teamName: k }))
              });
        dispatch({
            type: SET_SIMS,
            payload: simsList
        });

    } catch (err) {
        err.tag = ErrorTag.SIMS;
        dispatch(addError(err));
    } finally {
        if (refreshing) {
            dispatch({ type: SIMS_REFRESHING, payload: false });
        } else {
            dispatch({ type: SIMS_LOADING, payload: false });
        }
    }
};

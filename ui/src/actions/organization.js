import {
    SET_ORGANIZATION_LOADING,
    SET_CREATE_ORGANIZATION_LOADING,
    SET_ORGANIZATION_DATA
} from "./types";
import { addError, clearErrors } from "./errors";
import { openConfirmation } from "./ui";
import { ErrorTag } from "../utils/enums";
import authServer from "../api/auth";
import {
    organizationRegistrationThankYou
} from "../utils/confirmations";

const _getOrgName = async (orgId) => {
    try {
        const orgName = await authServer.get("/organizations/name?id=" + orgId);
        return orgName.data;
    } catch (err) {
        throw err;
    }
};

export const getOrgName = (orgId) => async (dispatch) => {
    try {
        dispatch(clearErrors(ErrorTag.GET_ORG));
        dispatch({ type: SET_ORGANIZATION_LOADING, payload: true });

        const orgName = await _getOrgName(orgId);

        dispatch({
            type: SET_ORGANIZATION_DATA,
            payload: { name: orgName }
        });

    } catch (err) {
        err.tag = ErrorTag.GET_ORG;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_ORGANIZATION_LOADING, payload: false });
    }
};

export const registerOrganization = (orgData, competitionId, history) => async dispatch => {
    try {
        dispatch(clearErrors(ErrorTag.CREATE_ORG));
        dispatch({ type: SET_CREATE_ORGANIZATION_LOADING, payload: true });

        history.push("/");
        dispatch(openConfirmation(organizationRegistrationThankYou()));

    } catch (err) {
        err.tag = ErrorTag.CREATE_ORG;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_CREATE_ORGANIZATION_LOADING, payload: false });
    }
};

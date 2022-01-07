import {
    SET_ERRORS,
    CLEAR_ERRORS,
    BUG_REPORT_LOADING
} from "./types";
import { AlertType, ErrorTag } from "../utils/enums";
import { openAlert, closeAlert, closeBugReportModal } from "./ui";
import { getToken } from "./user";
import authServer from "../api/auth";
import { ALERT_TIME } from "../utils/constants";

const getError = err => {
    err.tag = err.tag || "Unknown";
    // Handle axios response errors
    if (err.response) {
        err.status = err.response.status || 500;
        err.message =
            (err.response.data && err.response.data.message) || "Unknown error";
        err.field = err.response.data && err.response.data.field;
        err.link = err.response.data && err.response.data.link;
    } else {
        err.status = 500;
        err.message = err.message || "Unknown error";
    }

    return {
        tag: err.tag,
        status: err.status,
        message: err.message,
        field: err.field,
        link: err.link
    };
};

export const addError = err => {
    return {
        type: SET_ERRORS,
        payload: [getError(err)]
    }
};

export const addErrorAlert = (_err, header) => {
    const { message } = getError(_err);
    return openAlert({
        type: AlertType.ERROR,
        header,
        message
    });
}

export const setErrors = errs => {
    if (!Array.isArray(errs)) {
        errs = [ errs ];
    }
    return {
        type: SET_ERRORS,
        payload: errs
    };
};

export const clearErrors = tag => ({ type: CLEAR_ERRORS, payload: tag });

const _reportBug = async (report, token) => {
    try {
        await authServer.post(
            "/bugs",
            report,
            { headers: { Authorization: token } }
        );
    } catch (err) {
        throw err;
    }
}

export const reportBug = message => async (dispatch, getState) => {
    try {
        dispatch(clearErrors(ErrorTag.BUG_REPORT));
        dispatch({ type: BUG_REPORT_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;

        await _reportBug({
            state: getState(),
            message
        }, token);
        dispatch(openAlert({
            type: AlertType.SUCCESS,
            header: "Bug Report Sent",
            message: "Your bug report has been sent to our technical team. " +
                "They will review it and get back to you with any updates. Thanks " +
                "for helping us make SpaceCRAFT even better."
        }));
        dispatch(closeBugReportModal());
        setTimeout(() => dispatch(closeAlert()), ALERT_TIME);

    } catch (err) {
        err.tag = ErrorTag.BUG_REPORT;
        dispatch(addError(err));
    } finally {
        dispatch({ type: BUG_REPORT_LOADING, payload: false });
    }
};

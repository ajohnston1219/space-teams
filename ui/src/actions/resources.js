import { getToken } from "./user";
import { addError, clearErrors } from "./errors";
import { ErrorTag } from "../utils/enums";
import resourceServer from "../api/resources";
import {
    SET_DOWNLOAD_LINK_LOADING,
    SET_DOWNLOAD_LINK
} from "./types";

const _getApplicationDownloadLink = async (token) => {
    try {
        const version = process.env.REACT_APP_SC_VERSION;
        if (!version) {
            console.error("SpaceCRAFT version not specified");
            throw new Error("Application version not specified");
        }
        const downloadLink = await resourceServer.get(
            "/application?version=" + encodeURIComponent(version),
            { headers: { Authorization: token } }
        );
        return downloadLink.data;
    } catch (err) {
        // Ignore no payment error, button will be disabled already
        if (err.response.status === 402) {
            return "#";
        }
        throw err;
    }
};

export const getApplicationDownloadLink = () => async (dispatch) => {
    try {
        dispatch({ type: SET_DOWNLOAD_LINK_LOADING, payload: true });
        dispatch(clearErrors(ErrorTag.DOWNLOAD_LINK));
        const token = getToken();
        if (!token)
            return;
        const link = await _getApplicationDownloadLink(token);

        dispatch({ type: SET_DOWNLOAD_LINK, payload: link });
        
    } catch (err) {
        err.tag = ErrorTag.DOWNLOAD_LINK;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_DOWNLOAD_LINK_LOADING, payload: false });
    }
};

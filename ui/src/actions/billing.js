import {
    COMPETITION_LIST_LOADING,
    SET_COMPETITION_LIST,
    ADD_TO_CART,
    REMOVE_FROM_CART,
    SET_COMPETITION_PRICE,
    SET_ORGANIZATION_PAYMENT_INFO,
    SET_PRICE_LOADING,
    SET_PAYMENT_LOADING,
    SET_RECEIPT,
    CLEAR_RECEIPT,
    ADD_DISCOUNT,
    DISCOUNT_LOADING,
    RECEIPT_LOADING
} from "./types";
import { ErrorTag } from "../utils/enums";
import { addError, clearErrors } from "./errors";
import { getToken, loadUserData } from "./user";

import billingServer from "../api/billing";

const _getCompetitionList = async () => {
    try {
        const url = "/competitions";
        const list = await billingServer.get(url);
        return list.data;
    } catch (err) {
        throw err;
    }
};

const _getDiscount = async (code) => {
    try {
        const url = `/discount?code=${encodeURIComponent(code)}`;
        const discount = await billingServer.get(url);
        return discount.data;
    } catch (err) {
        throw err;
    }
};

const _getCompetitionPrice = async (id, discountCode) => {
    try {
        let url = `/competition-price?competition_id=${id}`;
        if (discountCode) {
            url += `&discount_code=${discountCode}`;
        }
        const priceResp = await billingServer.get(url);
        return priceResp.data;
    } catch (err) {
        throw err;
    }
};

const _submitPayment = async (authToken, paymentInfo, cart) => {
    try {
        const paymentResp = await billingServer.post(
            "/payment",
            { paymentInfo, cart },
            { headers: { Authorization: authToken } }
        );
        return paymentResp.data;
    } catch (err) {
        throw err;
    }
};

const _getReceipt = async (token, paymentId) => {
    try {
        const receiptResp = await billingServer.get(
            `/receipt?payment_id=${encodeURIComponent(paymentId)}`,
            { headers: { Authorization: token } }
        );
        return receiptResp.data;
    } catch (err) {
        throw err;
    }
};

const _submitCompetitionPayment = async (token, competitionId, paymentInfo, discountCode) => {
    try {
        const cardInfo = {
            number: paymentInfo.cardNumber,
            expiration: paymentInfo.expiration,
            code: paymentInfo.code
        };
        const billingInfo = {
            firstName: paymentInfo.firstName,
            lastName: paymentInfo.lastName,
            address: paymentInfo.address,
            country: paymentInfo.country,
            city: paymentInfo.city,
            state: paymentInfo.stateOrProvince,
            zip: paymentInfo.zipCode
        };
        const paymentResp = await billingServer.post(
            "/competition",
            { competitionId, cardInfo, billingInfo, discountCode },
            { headers: { Authorization: token } }
        );
        return paymentResp.data;
    } catch (err) {
        throw err;
    }
};

const _submitBulkCompetitionPayment = async (competitionId, orgId, numStudents, paymentInfo) => {
    try {
        const cardInfo = {
            number: paymentInfo.cardNumber,
            expiration: paymentInfo.expiration,
            code: paymentInfo.code
        };
        const billingInfo = {
            firstName: paymentInfo.firstName,
            lastName: paymentInfo.lastName,
            address: paymentInfo.address,
            country: paymentInfo.country,
            city: paymentInfo.city,
            state: paymentInfo.stateOrProvince,
            zip: paymentInfo.zipCode
        };
        const paymentResp = await billingServer.post(
            "/competition-bulk-pay",
            { competitionId, orgId, numStudents, cardInfo, billingInfo }
        );
        return paymentResp.data;
    } catch (err) {
        throw err;
    }
};

export const getCompetitionList = () => async (dispatch) => {
    try {
        dispatch(clearErrors(ErrorTag.COMPETITION_STORE));
        dispatch({ type: COMPETITION_LIST_LOADING, payload: true });
        const list = await _getCompetitionList();
        dispatch({ type: SET_COMPETITION_LIST, payload: list });
    } catch (err) {
        err.tag = ErrorTag.COMPETITION_STORE;
        dispatch(addError(err));
    } finally {
        dispatch({ type: COMPETITION_LIST_LOADING, payload: false });
    }
};

export const addToCart = (id) => ({
    type: ADD_TO_CART,
    payload: id
});

export const removeFromCart = (id) => ({
    type: REMOVE_FROM_CART,
    payload: id
});

export const addDiscount = (code, cb) => async (dispatch) => {
    try {
        dispatch(clearErrors(ErrorTag.DISCOUNT_CODE));
        dispatch({ type: DISCOUNT_LOADING, payload: true });
        const discount = await _getDiscount(code);
        dispatch({ type: ADD_DISCOUNT, payload: discount });
        cb();
    } catch (err) {
        err.tag = ErrorTag.DISCOUNT_CODE;
        dispatch(addError(err));
    } finally {
        dispatch({ type: DISCOUNT_LOADING, payload: false });
    }
};

export const getCompetitionPrice = (id, discountCode) => async (dispatch) => {
    try {
        dispatch(clearErrors(ErrorTag.PRICE_LOOKUP));
        dispatch({ type: SET_PRICE_LOADING, payload: true });
        const priceInfo = await _getCompetitionPrice(id, discountCode);
        dispatch({ type: SET_COMPETITION_PRICE, payload: priceInfo });

    } catch (err) {
        err.tag = ErrorTag.PRICE_LOOKUP;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_PRICE_LOADING, payload: false });
    }
};

export const setReceipt = (data) => ({
    type: SET_RECEIPT,
    payload: data
});

export const clearReceipt = () => ({
    type: CLEAR_RECEIPT
});

export const submitPayment = (paymentToken, cart, history) => async (dispatch) => {
    try {
        dispatch(clearErrors(ErrorTag.PAYMENT));
        dispatch({ type: SET_PAYMENT_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;

        const paymentResult =
              await _submitPayment(token, paymentToken, cart);
        dispatch(setReceipt(paymentResult));
        dispatch(loadUserData());
        history.push(`/receipt?payment_id=${encodeURIComponent(paymentResult.paymentId)}`);

    } catch (err) {
        err.tag = ErrorTag.PAYMENT;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_PAYMENT_LOADING, payload: false });
    }
};

export const getReceipt = (paymentId) => async (dispatch) => {
    try {
        dispatch(clearErrors(ErrorTag.RECEIPT));
        dispatch({ type: RECEIPT_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;

        const receipt = await _getReceipt(token, paymentId);
        dispatch(setReceipt(receipt));

    } catch (err) {
        err.tag = ErrorTag.RECEIPT;
        dispatch(addError(err));
    } finally {
        dispatch({ type: RECEIPT_LOADING, payload: false });
    }
};

export const submitCompetitionPayment = (compId, paymentInfo, discountCode) => async (dispatch) => {
    try {
        dispatch(clearErrors(ErrorTag.PAYMENT));
        dispatch({ type: SET_PAYMENT_LOADING, payload: true });
        let token;
        if (!(token = getToken()))
            return;

        const paymentResult =
              await _submitCompetitionPayment(token, compId, paymentInfo, discountCode);
        dispatch(setReceipt(paymentResult));
        dispatch(loadUserData());

    } catch (err) {
        err.tag = ErrorTag.PAYMENT;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_PAYMENT_LOADING, payload: false });
    }
};

export const submitBulkCompetitionPayment = (compId, orgId, numStudents, paymentInfo) => async (dispatch) => {
    try {
        dispatch(clearErrors(ErrorTag.PAYMENT));
        dispatch({ type: SET_PAYMENT_LOADING, payload: true });

        const paymentResult = await _submitBulkCompetitionPayment(compId, orgId, numStudents, paymentInfo);
        dispatch(setReceipt(paymentResult));
        dispatch(loadUserData());

    } catch (err) {
        err.tag = ErrorTag.PAYMENT;
        dispatch(addError(err));
    } finally {
        dispatch({ type: SET_PAYMENT_LOADING, payload: false });
    }
};

export const setOrganizationPaymentInfo = (orgInfo) => ({
    type: SET_ORGANIZATION_PAYMENT_INFO,
    payload: orgInfo
});

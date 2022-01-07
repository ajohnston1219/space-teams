import {
    COMPETITION_LIST_LOADING,
    SET_COMPETITION_LIST,
    ADD_TO_CART,
    REMOVE_FROM_CART,
    SET_COMPETITION_PRICE,
    SET_PRICE_LOADING,
    SET_PAYMENT_LOADING,
    SET_RECEIPT,
    CLEAR_RECEIPT,
    SET_COMPETITION_PAYMENT_INFO,
    SET_ORGANIZATION_PAYMENT_INFO,
    ADD_DISCOUNT,
    DISCOUNT_LOADING,
    RECEIPT_LOADING
} from "../actions/types";
import { uniqueById } from "../utils/unique";

const initialState = {
    competitions: {
        loading: false,
        list: []
    },
    cart: {
        items: [],
        discounts: []
    },
    discountLoading: false,
    competitionPrice: null,
    discount: null,
    priceLoading: false,
    paymentLoading: false,
    competitionPaymentInfo: null,
    receipt: {
        approved: false
    },
    receiptLoading: false,
    orgInfo: {
        id: null,
        numStudents: 0
    }
};

const persistCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
}

const initialCart = () => {
    try {
        const cart = JSON.parse(localStorage.getItem("cart"));
        return cart || initialState.cart;
    } catch (err) {
        console.error(err);
        return initialState.cart;
    }
};

const competitions = (state = { ...initialState, cart: initialCart() }, action) => {
    switch (action.type) {
        case COMPETITION_LIST_LOADING: {
            return {
                ...state,
                competitions: {
                    ...state.competitions,
                    loading: action.payload
                }
            };
        }
        case SET_COMPETITION_LIST: {
            return {
                ...state,
                competitions: {
                    ...state.competitions,
                    list: action.payload
                }
            };
        }
        case ADD_TO_CART: {
            const newCart = {
                ...state.cart,
                items: uniqueById([ ...state.cart.items, { id: action.payload, qty: 1 } ])
            };
            persistCart(newCart);
            return {
                ...state,
                cart: newCart
            };
        }
        case REMOVE_FROM_CART: {
            const newCart = {
                ...state.cart,
                items: state.cart.items.filter((item) => item.id !== action.payload)
            };
            persistCart(newCart);
            return {
                ...state,
                cart: newCart
            };
        };
        case DISCOUNT_LOADING: {
            return { ...state, discountLoading: action.payload };
        };
        case ADD_DISCOUNT: {
            // NOTE(adam): Currently only supporting one discount per purchase
            const newCart = {
                ...state.cart,
                discounts: [ action.payload ]
            };
            persistCart(newCart);
            return {
                ...state,
                cart: newCart
            };
        }
        case SET_COMPETITION_PRICE: {
            return {
                ...state,
                competitionPrice: action.payload.price,
                discount: action.payload.discount
            };
        }
        case SET_PRICE_LOADING: {
            return { ...state, priceLoading: action.payload };
        }
        case SET_PAYMENT_LOADING: {
            return { ...state, paymentLoading: action.payload };
        }
        case SET_COMPETITION_PAYMENT_INFO: {
                return { ...state, competitionPaymentInfo: action.payload };
        }
        case SET_ORGANIZATION_PAYMENT_INFO: {
                return { ...state, orgInfo: action.payload };
        }
        case SET_RECEIPT: {
            return { ...state, receipt: { ...action.payload, approved: true } };
        }
        case CLEAR_RECEIPT: {
            return { ...state, receipt: { approved: false } };
        }
        case RECEIPT_LOADING: {
            return { ...state, receiptLoading: action.payload };
        }
        default: {
            return state;
        }
    }
};

export default competitions;

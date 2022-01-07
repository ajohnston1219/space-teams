import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Card, Message } from "semantic-ui-react";
import { getCompetitionList, submitPayment } from "../actions/billing";
import { getCart, getSubtotal, getTotalDiscount } from "../selectors/billing";
import { setActiveNavTab } from "../actions/ui";
import { getTaggedErrors } from "../selectors/errors";
import { ErrorTag } from "../utils/enums";

import CartTotal from "../components/CartTotal";
import { clearErrors } from "../actions/errors";

const APPLICATION_ID = "sandbox-sq0idb-BRJ2Rkgds9UHr3Qo7iafDA";
const LOCATION_ID = "L450JVFH17SWD";

const Checkout = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const cart = useSelector(getCart);
    const cartLoading = useSelector((state) => state.billing.competitions.loading);
    const subtotal = useSelector(getSubtotal);
    const totalDiscount = useSelector(getTotalDiscount);
    const total = subtotal - totalDiscount;
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.PAYMENT));
    const paymentProcessing = useSelector((state) => state.billing.paymentLoading);

    const [waitingOnSquare, setWaitingOnSquare] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const timeout = setTimeout(() => {
        setLoadError("Error loading payment processor. Wait a few minutes and try again. " +
                     "If the problem persists, click the 'Help' icon to the right and submit " +
                     "a support ticket.");
    }, 5000);

    useEffect(() => {
        dispatch(setActiveNavTab(null));
    }, []);

    useEffect(() => {
        dispatch(clearErrors(ErrorTag.PAYMENT));
        dispatch(getCompetitionList());
    }, []);

    useEffect(() => {
        if (paymentLoading) {
            setPaymentLoading(false);
        }
    }, [paymentProcessing]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    useEffect(() => {
        if (window.Square && waitingOnSquare) {
            setWaitingOnSquare(false);
            window.payments = window.Square.payments(APPLICATION_ID, LOCATION_ID);
            window.payments.card()
                .then(card => {
                    window.card = card;
                    card.attach("#card-container")
                        .then(() => {
                            clearTimeout(timeout);
                            setLoading(false);
                        })
                        .catch(err => console.error(err));
                })
                .catch(err => console.error(err));
        }
    }, [window.Square, waitingOnSquare]);

    useEffect(() => {
        if (!loading && !cartLoading && cart.items.length === 0) {
            history.push("/store");
        }
    }, [loading, cartLoading, cart.items]);

    const renderContent = () => {
        if (loading || cartLoading) {
            return (
                <Card.Content>
                    Loading...
                </Card.Content>
            );
        }
        return (
            <Card.Content>
                <CartTotal
                    subtotal={subtotal}
                    discount={totalDiscount}
                    total={total}
                />
            </Card.Content>
        );
    };

    const handlePayment = async () => {
        setPaymentLoading(true);
        const paymentToken = await window.card.tokenize();
        console.log("token:", paymentToken);
        dispatch(submitPayment(paymentToken, { ...cart, subtotal, totalDiscount, total }, history));
    };

    return (
        <Card className="dashboard-card">
            {renderContent()}
            <Card.Content>
                <div id="card-container"></div>
                <Button
                    onClick={handlePayment}
                    primary
                    fluid
                    disabled={loading || cartLoading || paymentLoading}
                >
                    Pay
                </Button>
                {errors && (
                    <Message
                        error
                        header="Payment Error"
                        content={errors[0].message}
                    />
                )}
            </Card.Content>
        </Card>
    );
};

export default Checkout;

import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Divider, Message } from "semantic-ui-react";
import CartList from "../components/CartList";
import CartTotal from "../components/CartTotal";
import { getReceipt } from "../actions/billing";
import { getTaggedErrors } from "../selectors/errors";
import { setActiveNavTab } from "../actions/ui";
import { ErrorTag } from "../utils/enums";

const Receipt = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const paymentId = new URLSearchParams(location.search).get("payment_id");
    // TODO: Show list of payments to select from if payment ID not present

    const receipt = useSelector((state) => state.billing.receipt);
    const receiptLoading = useSelector((state) => state.billing.receiptLoading);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.RECEIPT));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(setActiveNavTab(null));
        dispatch(getReceipt(paymentId));
    }, []);

    useEffect(() => {
        let timeout = null;
        if (loading && !receiptLoading) {
            timeout = setTimeout(() => setLoading(false), 100);
        }
        return () => timeout && clearTimeout(timeout);
    }, [receiptLoading]);

    const renderContent = () => {
        if (loading) {
            return (
                <Card.Content>
                    <p>Loading...</p>
                </Card.Content>
            );
        }
        if (errors) {
            return (
                <Card.Content>
                    <Message
                        error
                        content={errors[0].message}
                    />
                </Card.Content>
            );
        }
        return (
            <React.Fragment>
                <Card.Content>
                    <CartList
                        cart={receipt.cart}
                    />
                </Card.Content>
                <Card.Content>
                    <CartTotal
                        subtotal={receipt.cart.subtotal}
                        discount={receipt.cart.totalDiscount}
                        total={receipt.cart.total}
                    />
                    <p>{`Card: ${receipt.payment.card_details.card.card_brand} XXXX XXXX XXXX ${receipt.payment.card_details.card.last_4}`}</p>
                    <p>{`Payment ID: ${receipt.id}`}</p>
                </Card.Content>
                <Card.Content>
                    <p>You will also receive an email with this information</p>
                </Card.Content>
            </React.Fragment>
        );
    };

    return (
        <Card className="dashboard-card">
            <Card.Content>
                <Card.Header>Receipt</Card.Header>
            </Card.Content>
            {renderContent()}
        </Card>
    );
};

export default Receipt;

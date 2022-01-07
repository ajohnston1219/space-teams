import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getCompetitionList, addDiscount, removeFromCart } from "../actions/billing";
import { getTaggedErrors } from "../selectors/errors";
import { getCart, getSubtotal, getTotalDiscount } from "../selectors/billing";
import { setActiveNavTab } from "../actions/ui";
import { addError } from "../actions/errors";
import { ErrorTag } from "../utils/enums";
import { Button, Card, Divider, Grid, Statistic } from "semantic-ui-react";

import CartList from "../components/CartList";
import ApplyDiscount from "../components/ApplyDiscount";
import CartTotal from "../components/CartTotal";

const Cart = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const loading = useSelector((state) => state.billing.competitions.loading);
    const discountLoading = useSelector((state) => state.billing.discountLoading);
    const discountErrors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.DISCOUNT_CODE));
    const appliedDiscounts = useSelector((state) => state.billing.cart.discounts);

    const cart = useSelector(getCart);
    const subtotal = useSelector(getSubtotal);
    const totalDiscount = useSelector(getTotalDiscount);
    const total = subtotal - totalDiscount;

    useEffect(() => {
        dispatch(setActiveNavTab(null));
        dispatch(getCompetitionList());
    }, []);

    const handleRemoveItem = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleApplyDiscount = (code, clear) => {
        if (appliedDiscounts.some(d => d.code === code)) {
            dispatch(addError({
                tag: ErrorTag.DISCOUNT_CODE,
                message: "Discount " + code + " has already been applied"
            }));
            return;
        }
        dispatch(addDiscount(code, clear));
    };

    const handleCheckout = () => {
        history.push("/checkout");
    };

    const contentStyle = {
        padding: "1rem 2.5rem"
    };
    const renderContent = () => {
        if (loading) {
            return (
                <Card.Content>
                    Loading...
                </Card.Content>
            );
        }
        if (cart.items.length === 0) {
            return (
                <React.Fragment>
                    <Card.Content>
                        <p>You don't have any items in your cart.</p>
                        <Button
                            primary
                            onClick={() => history.push("/store")}
                        >
                            Go To Store
                        </Button>
                    </Card.Content>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <Card.Content style={contentStyle}>
                    <CartList cart={cart} onRemoveItem={handleRemoveItem} />
                </Card.Content>
                <Card.Content style={contentStyle}>
                    <ApplyDiscount
                        onApply={handleApplyDiscount}
                        appliedDiscounts={appliedDiscounts}
                        items={cart.items}
                        loading={discountLoading}
                        errors={discountErrors}
                    />
                </Card.Content>
                <Card.Content style={contentStyle}>
                    <CartTotal
                        subtotal={subtotal}
                        discount={totalDiscount}
                        total={total}
                    />
                </Card.Content>
                <Card.Content>
                    <Button
                        onClick={handleCheckout}
                        fluid
                        primary
                        disabled={cart.items.length === 0}
                    >
                        Checkout
                    </Button>
                </Card.Content>
            </React.Fragment>
        );
    }

    return (
        <Card className="dashboard-card">
            <Card.Content>
                <Card.Header>Cart</Card.Header>
            </Card.Content>
            {renderContent()}
        </Card>
    );
};

export default Cart;

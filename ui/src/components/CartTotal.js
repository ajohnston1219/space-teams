import React from "react";
import { Grid, Statistic, Divider } from "semantic-ui-react";

const CartTotal = ({ subtotal, discount, total }) => {
    const priceStr = price => `$${Number.parseFloat(price).toFixed(2)}`;

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={12}>
                    <h4>Subtotal:</h4>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic size="mini" style={{ float: "right" }}>
                        <Statistic.Value>{priceStr(subtotal)}</Statistic.Value>
                    </Statistic>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={12}>
                    <h4>Total Discount:</h4>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic size="mini" style={{ float: "right" }}>
                        <Statistic.Value>{priceStr(discount)}</Statistic.Value>
                    </Statistic>
                </Grid.Column>
            </Grid.Row>
            <Divider />
            <Grid.Row>
                <Grid.Column width={12}>
                    <h3>Total:</h3>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic size="tiny" style={{ float: "right" }}>
                        <Statistic.Value>{priceStr(total)}</Statistic.Value>
                        <Statistic.Label>USD</Statistic.Label>
                    </Statistic>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default CartTotal;

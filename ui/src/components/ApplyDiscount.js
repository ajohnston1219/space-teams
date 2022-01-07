import React from "react";
import { Form, Button, List, Divider, Message } from "semantic-ui-react";

const DiscountInfo = ({ item, discount }) => {
    const discountStr = `$${(Number.parseFloat(discount.discount) * 100).toFixed(0)}%`;
    return (
        <List.Content>
            <p style={{ float: "left", marginRight: "1rem", fontWeight: "bold" }}>{`${discount.code}:`}</p>
            <p>{`${discountStr} off ${item.name}`}</p>
        </List.Content>
    );
};

const Discounts = ({ items, discounts }) => {
    return (
        <List>
            {items && items.map((item) => {
                const discs = discounts
                    .filter(d => Object.keys(d.amounts).some(id => id === item.id))
                    .map(d => ({
                        code: d.code,
                        discount: d.amounts[item.id]
                    }));
                return (
                    discs && discs.map((discount) => (
                        <List.Item key={discount.code}>
                            <DiscountInfo item={item} discount={discount} />
                        </List.Item>
                    ))
                );
            })}
        </List>
    );
};

const ApplyDiscount = ({ onApply, appliedDiscounts, items, loading, errors }) => {
    const [discount, setDiscount] = React.useState("");

    const clearDiscount = () => setDiscount("");

    return (
        <React.Fragment>
            <h4>Discounts</h4>
            <div style={{ padding: "0 1rem" }}>
                <Discounts items={items} discounts={appliedDiscounts} />
                <Divider />
                <Form loading={loading}>
                    <Form.Group>
                        <Form.Field inline>
                            <label>Discount Code</label>
                            <input
                                name="discount"
                                placeholder="Code"
                                value={discount}
                                onChange={({ target: { value } }) => setDiscount(value)}
                            />
                        </Form.Field>
                        <Button
                            onClick={() => onApply(discount, clearDiscount)}
                            floated="right"
                            primary
                        >
                            Apply
                        </Button>
                    </Form.Group>
                </Form>
                {errors && (
                    <Message
                        error
                        header="Discount Error"
                        content={errors[0].message}
                    />
                )}
            </div>
        </React.Fragment>
    );
};

export default ApplyDiscount;

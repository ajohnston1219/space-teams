import React from "react";
import { List, Divider, Button } from "semantic-ui-react";
import moment from "moment";

const keyStyle = {
    fontWeight: "bold",
    fontSize: "1.1rem",
};
const valueStyle = {
    fontWeight: "light",
    fontSize: "1.1rem",
    float: "right"
};

const KeyValue = ({ keyName, value }) => (
    <p>
        <span style={keyStyle}>{`${keyName}: `}</span>
        <span style={valueStyle}>{value}</span>
    </p>
);

const detailsStyle = {
    width: "50%",
    maxWidth: "300px"
};
const ItemDetails = ({ item }) => (
    <div style={detailsStyle}>
        <KeyValue keyName="Name" value={item.name}/>
        <KeyValue keyName="Start Date" value={moment(item.startDate).format("MMM Do, YYYY")}/>
        <KeyValue keyName="Price" value={`$${item.price} USD`}/>
    </div>
);

const CartList = ({ cart, onRemoveItem }) => {
    return (
        <List>
            {cart.items.map((item, idx) => (
                <React.Fragment key={item.id}>
                    {idx !== 0 && (<Divider />)}
                    <List.Item key={item.id}>
                        {onRemoveItem && (
                            <List.Content floated="right">
                                <Button color="red" onClick={() => onRemoveItem(item.id)}>Remove</Button>
                            </List.Content>
                        )}
                        <List.Content>
                            <ItemDetails item={item} />
                        </List.Content>
                    </List.Item>
                </React.Fragment>
            ))}
        </List>
    );
};

export default CartList;

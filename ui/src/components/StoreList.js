import React from "react";
import {
    Item,
    Button,
    Icon
} from "semantic-ui-react";

const AddToCartButton = ({ onClick }) => (
    <Button onClick={onClick} primary floated="right">Add to Cart</Button>
);
const RemoveFromCartButton = ({ onClick }) => (
    <Button onClick={onClick} color="red" floated="right">Remove</Button>
);

const StoreList = ({ items, onAddToCart, onRemoveFromCart }) => {
    return (
        <Item.Group divided>
            {items.map((item) => (
                <Item key={item.id}>
                    <Item.Content>
                        <Item.Header>{item.name}</Item.Header>
                        <Item.Meta>{`$${item.price} USD`}</Item.Meta>
                        {item.selected && (
                            <Item.Extra>
                                <Icon color="green" name="check" />
                                Added
                            </Item.Extra>)}
                        <Item.Description>{item.description}</Item.Description>
                        <Item.Extra>
                            {item.selected
                                ? (
                                    <RemoveFromCartButton onClick={() => onRemoveFromCart(item.id)}/>
                                ) : (
                                    <AddToCartButton onClick={() => onAddToCart(item.id)}/>
                                )}
                        </Item.Extra>
                    </Item.Content>
                </Item>
            ))}
        </Item.Group>
    );
}

export default StoreList;

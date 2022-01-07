import React from "react";
import { Item, List } from "semantic-ui-react";

const SimItem = ({ sim }) => (
    <Item>
      <Item.Content>
        <Item.Header>{sim.name}</Item.Header>
        <Item.Meta>{sim.teamName}</Item.Meta>
        <Item.Description>
            <List>
            {
                sim.members.map(m => (
                    <List.Item
                      key={m.id}
                    >
                      <List.Icon name="user"/>
                      <List.Content>{m.username}</List.Content>
                    </List.Item>
                ))
            }
            </List>
        </Item.Description>
      </Item.Content>
    </Item>
);

export default SimItem;

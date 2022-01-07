import React from "react";
import { getFieldError } from "../utils/formErrors";
import { Form, Button, Icon } from "semantic-ui-react";

const ScorecardForm = ({
    category,
    leagues,
    setCategory,
    removeCategory,
    showRemoveButton,
    errors
}) => {

    let err;

    return (
        <>
          <Form.Input
            label="Category"
            placeholder="Category"
            value={category.name}
            onChange={(e, { value }) => setCategory({ ...category, name: value })}
            error={(err = getFieldError("name", errors)) && {
                content: err,
                pointing: "below"
            }}
          />
          {leagues.map((l, i) => {
              return (
                  <Form.Input
                    key={i}
                    label={`${l} Weight`}
                    placeholder={`${l} Weight`}
                    value={category.weights[i].weight}
                    onChange={(e, { value }) => setCategory({
                        ...category,
                        weights: [
                            ...category.weights.slice(0, i),
                            { league: l, weight: value },
                            ...category.weights.slice(i+1)
                        ]
                    })}
                    error={(err = getFieldError("name", errors)) && {
                        content: err,
                        pointing: "below"
                    }}
                  />
              )
          })}
          {showRemoveButton && (
              <Button color="red" onClick={removeCategory}>
                <Icon name="delete"/>
                Remove
              </Button>
          )}
        </>
    );
};

export default ScorecardForm;

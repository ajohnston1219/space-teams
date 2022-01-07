import React from "react";
import { getFieldError } from "../utils/formErrors";
import { Form, Card, Button, Icon, Segment } from "semantic-ui-react";
import DatePicker from "react-semantic-ui-datepickers";
import ScorecardForm from "./ScorecardForm";

const ActivityForm = ({
    activity,
    leagues,
    setActivity,
    blankCategory,
    errors
}) => {

    let err;

    const renderScorecardForm = (activity, errors) => {
        return activity.scorecard.map((category, i) => {
            const setCategory = c => setActivity({
                ...activity,
                scorecard: [
                    ...activity.scorecard.slice(0, i),
                    c,
                    ...activity.scorecard.slice(i+1)
                ]
            });
            const removeCategory = () => setActivity({
                ...activity,
                scorecard: [
                    ...activity.scorecard.slice(0, i),
                    ...activity.scorecard.slice(i+1)
                ]
            });
            return (
                <Segment raised key={i}>
                  <ScorecardForm
                    category={category}
                    leagues={leagues}
                    setCategory={setCategory}
                    removeCategory={removeCategory}
                    showRemoveButton={activity.scorecard.length > 1}
                    errors={errors}
                  />
                </Segment>
            );
        });
    };

    return (
        <>
          <Form.Input
            label="Name"
            placeholder="Name"
            value={activity.name}
            onChange={(e, { value }) => setActivity({ ...activity, name: value })}
            error={(err = getFieldError("name", errors)) && {
                content: err,
                pointing: "below"
            }}
          />

          <Form.Group>
            <Form.Field>
              <label>Start Date</label>
              <DatePicker
                onChange={
                    (e, data) => setActivity({ ...activity, startDate: data.value })
                }
                value={activity.startDate}
              />
            </Form.Field>
            <Form.Field>
              <label>End Date</label>
              <DatePicker
                onChange={
                    (e, data) => setActivity({ ...activity, endDate: data.value })
                }
                value={activity.endDate}
              />
            </Form.Field>
          </Form.Group>

          <Card fluid raised>
            <Card.Content>
              <Card.Header>Scorecard</Card.Header>
            </Card.Content>
            <Card.Content>
              {renderScorecardForm(activity, errors)}
            </Card.Content>
            <Card.Content>
              <Button primary onClick={() => setActivity({
                  ...activity,
                  scorecard: [ ...activity.scorecard, blankCategory(leagues) ]
              })}>
                <Icon name="plus"/>
                Add Category
              </Button>
            </Card.Content>
          </Card>

        </>
    );
};

export default ActivityForm;

import React from "react";
import { getFieldError, getFormError } from "../utils/formErrors";
import { Form, Card, Message, Button, Icon, Item, Popup } from "semantic-ui-react";
import DatePicker from "react-semantic-ui-datepickers";
import ActivityForm from "./ActivityForm";

const minimizeActivityButtonStyle = {
  position: "absolute",
  top: "6px",
  right: "65px",
  width: "52px"
};

const removeActivityButtonStyle = {
  position: "absolute",
  top: "6px",
  right: "13px",
  width: "52px"
};

const removeLeagueButtonStyle = {
  height: "80%",
  position: "relative",
  top: "24px",
  width: "52px"
};

const blankCategory = (leagues) => ({
  name: "",
  weights: leagues.map(l => ({ league: l, weight: "" }))
});

const blankActivity = (leagues) => ({
  name: "",
  startDate: null,
  endDate: null,
  scorecard: [ blankCategory(leagues) ]
});

const CompetitionForm = ({
  errors,
  competition,
  setCompetition
}) => {

  let err;

  const [ editingActivities, setEditingActivities ] = React.useState(
    competition.activities.map((a, i) => true)
  );

  const competitionIsValid = (competition) => {
    if (!competition.name || competition.name.length < 3) {
      return false;
    }
    if (!competition.startDate || !competition.endDate) {
      return false;
    }
    if (competition.leagues.length === 0 || competition.leagues.some(l => l.length < 3)) {
      return false;
    }
    return true;
  };

  const activityIsValid = (activity) => {
    if (!activity.name || activity.name.length < 3) {
      return false;
    }
    if (!activity.startDate || !activity.endDate) {
      return false;
    }
    if (activity.scorecard.length === 0) {
      return false;
    }
    if (activity.scorecard.some(
      s => s.name.length < 3 || s.weights.some(w => !w.weight || w.weight.length === 0)
    )) {
      return false;
    }
    return true;
  };

  const addActivity = () => {
    setCompetition({
      ...competition,
      activities: [ ...competition.activities, blankActivity(competition.leagues) ]
    });
    setEditingActivities(s => [ ...s, true ]);
  };

  const renderLeagues = (competition, errors) => {
    const addLeague = () => setCompetition({
      ...competition,
      activities: competition.activities.map(a => ({
        ...a,
        scorecard: a.scorecard.map(c => ({
          ...c,
          weights: [ ...c.weights, { league: "", weight: "" } ]
        })),
      })),
      leagues: [ ...competition.leagues, "" ]
    });
    const updateLeague = (value, i) => setCompetition({
      ...competition,
      activities: competition.activities.map(a => ({
        ...a,
        scorecard: a.scorecard.map(c => ({
          ...c,
          weights: [
            ...c.weights.slice(0, i),
            { league: value, weight: c.weights[i].weight },
            ...c.weights.slice(i+1)
          ]
        }))
      })),
      leagues: [
        ...competition.leagues.slice(0, i),
        value,
        ...competition.leagues.slice(i+1)
      ]
    });
    const removeLeague = (i) => setCompetition({
      ...competition,
      activities: competition.activities.map(a => ({
        ...a,
        scorecard: a.scorecard.map(c => ({
          ...c,
          weights: [
            ...c.weights.slice(0, i),
            ...c.weights.slice(i+1)
          ]
        }))
      })),
      leagues: [
        ...competition.leagues.slice(0, i),
        ...competition.leagues.slice(i+1)
      ]
    });

    return (
      <Card fluid raised>
        <Card.Content>
          <Card.Header>Leagues</Card.Header>
        </Card.Content>
        <Card.Content>
          {competition.leagues.map((l, i) => {
            return (
              <Form.Group key={i}>
                <Form.Input
                  label="Name"
                  placeholder="Name"
                  value={l}
                  onChange={(e, { value }) => updateLeague(value, i)}
                  error={(err = getFieldError(`league-${i}`, errors)) && {
                    content: err,
                    pointing: "below"
                  }}
                />
                {competition.leagues.length > 1 && (
                  <Button color="red" onClick={() => removeLeague(i)} style={removeLeagueButtonStyle}>
                    <Icon name="delete"/>
                  </Button>
                )}
              </Form.Group>
            );
          })}
        </Card.Content>
        <Card.Content>
          <Button primary onClick={addLeague}>
            <Icon name="plus"/>
            Add League
          </Button>
        </Card.Content>
      </Card>
    );
  };

  const renderActivitySaveButton = (isValid, onClick) => {
    if (isValid) {
      return (
        <Button
          primary
          style={minimizeActivityButtonStyle}
          onClick={onClick}
        >
          <Icon name="save" style={{ marginRight: 0 }}/>
        </Button>
      );
    } else {
      return (
        <Popup
          content="Please fill out all activity data before saving"
          trigger={
            <div style={{ display: "inline" }}>
              <Button
                primary
                style={minimizeActivityButtonStyle}
                disabled
              >
                <Icon name="save" style={{ marginRight: 0 }}/>
              </Button>
            </div>
          }
        />
      );
    }
  }

  const renderActivityForm = (activity, index) => {
    const isEditing = editingActivities[index];
    if (isEditing) {
      return (
        <Card fluid raised key={index}>
          <Card.Content>
            <Card.Header>{`Activity ${index + 1}`}</Card.Header>
            {renderActivitySaveButton(
              activityIsValid(activity),
              () => setEditingActivities(s => [ ...s.slice(0, index), false, ...s.slice(index + 1) ])
            )}
            <Button
              style={removeActivityButtonStyle} color="red"
              onClick={() => setCompetition({
                ...competition,
                activities: [
                  ...competition.activities.slice(0, index),
                  ...competition.activities.slice(index + 1)
                ]
              })}>
              <Icon name="delete" style={{ marginRight: 0 }}/>
            </Button>
          </Card.Content>
          <Card.Content>
            <ActivityForm
              activity={activity}
              leagues={competition.leagues}
              setActivity={act => setCompetition({
                ...competition,
                activities: [
                  ...competition.activities.slice(0, index),
                  act,
                  ...competition.activities.slice(index + 1)
                ]
              })}
              blankCategory={blankCategory}
              errors={errors}
            />
          </Card.Content>
        </Card>
      );
    } else { // not editing
      const renderDates = () => {
        if (activity.startDate && activity.endDate) {
          return `${activity.startDate.toDateString()} - ${activity.endDate.toDateString()}`;
        } else {
          return "No dates specified";
        }
      }
      return (
        <Card fluid raised key={index}>
          <Card.Content>
            <Card.Header>{activity.name}</Card.Header>
            <Card.Meta>
              {renderDates()}
            </Card.Meta>
          </Card.Content>
          <Card.Content>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Item.Header>Scorecard</Item.Header>
                  <Item.Description>
                    <ul>
                      {activity.scorecard.map((c, i) => {
                        return (
                          <li key={i}>
                            {c.name}
                            <ul>
                              {c.weights.map((w, i) => {
                                return (
                                  <li key={i}>
                                  {`${w.league}: ${w.weight}`}
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                        );
                      })}
                    </ul>
                  </Item.Description>
                </Item.Content>
              </Item>
            </Item.Group>
          </Card.Content>
          <Card.Content>
            <Button onClick={() => setEditingActivities(s => [ ...s.slice(0, index), true, ...s.slice(index + 1) ])}>
              <Icon name="edit"/>
              Edit
            </Button>
          </Card.Content>
        </Card>
      );
    }
  };

  const renderActivityForms = (competition, errors) => {
    return competition.activities.map((a, i) => renderActivityForm(a, i));
  };

  const renderActivityButton = (isValid) => {
    if (isValid) {
      return (
        <Button primary onClick={addActivity}>
          <Icon name="plus"/>
          Add Activity
        </Button>
      );
    } else {
      return (
        <Popup
          content="Please fill out competition details before adding an activity"
          trigger={(
            <div style={{ display: "inline" }}>
              <Button primary disabled>
                <Icon name="plus"/>
                Add Activity
              </Button>
            </div>
          )}
        />
      );
    }
  }

  return (
    <Form
      error={!!getFormError(errors)}
    >
      <Form.Input
        label="Name"
        placeholder="Name"
        value={competition.name}
        onChange={(e, { value }) => setCompetition({ ...competition, name: value })}
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
              (e, data) => setCompetition({ ...competition, startDate: data.value })
            }
          />
        </Form.Field>
        <Form.Field>
          <label>End Date</label>
          <DatePicker
            onChange={
              (e, data) => setCompetition({ ...competition, endDate: data.value })
            }
          />
        </Form.Field>
      </Form.Group>

      {renderLeagues(competition, errors)}

      {renderActivityForms(competition, errors)}

      {renderActivityButton(competitionIsValid(competition))}

      <Message
        error
        header="Add Competition"
        content={getFormError(errors)}
      />

    </Form>
  );
};

export default CompetitionForm;

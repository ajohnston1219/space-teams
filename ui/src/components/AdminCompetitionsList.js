/* eslint-disable react-hooks/exhaustive-deps */
import React from "react"
import { useSelector } from "react-redux";
import moment from "moment";
import { Card, Item, Accordion, Button, Icon } from "semantic-ui-react";
import { useHistory } from "react-router-dom";

const AdminCompetitionsList = () => {

    const history = useHistory();

    const competitions = useSelector((state) => state.competitions.activeComps);
    const loading = useSelector((state) => state.competitions.loading);

    let activityCounter = 0;
    const getActivityDescription = (activity) => (
        <p style={{ textDecoration: "none", color: "black" }}>{activity.description}</p>
    )
    const getActivityPanels = activities => activities && activities.map(activity => {
        const startDateStr = moment(activity.startDate).utc().format("M-D-YY");
        const endDateStr = moment(activity.endDate).utc().format("M-D-YY");
        const panel = {
            key: `panel-${activityCounter++}`,
            title: `${activity.name} (${startDateStr} - ${endDateStr})`,
            content: { content: getActivityDescription(activity) },
        };
        return panel;
    });

    const renderItem = (competition) => {
        return (
            <Item key={competition.id}>
              <Item.Content>
                <Item.Header>{competition.name}</Item.Header>
                <Item.Description>
                  <Accordion fluid panels={getActivityPanels(competition.activities)} styled />
                </Item.Description>
                <Item.Meta>
                  <Button>
                    <Icon name="edit"/>
                    Edit
                  </Button>
                </Item.Meta>
              </Item.Content>
            </Item>
        );
    };

    const renderList = (loading, competitions) => {
        if (!loading && competitions && competitions.length) {
            return (
                <Card className="dashboard-card" centered>
                  <Card.Content>
                    <Card.Header>Competitions</Card.Header>
                  </Card.Content>
                  <Card.Content>
                    <Item.Group divided>
                      {competitions.map(renderItem)}
                    </Item.Group>
                  </Card.Content>
                </Card>
            );
        }
        return (
            "No active competitions"
        );
    };

    return (
        <>
          <Card className="dashboard-card" centered>
            <Card.Content>
              <Card.Header>Competitions</Card.Header>
            </Card.Content>
            <Card.Content>
              {renderList(loading, competitions)}
            </Card.Content>
            <Card.Content>
              <Button primary onClick={() => history.push("/create-competition")} >
                <Icon name="plus"/>
                Add Competition
              </Button>
            </Card.Content>
          </Card>
        </>
    );
};

export default AdminCompetitionsList;

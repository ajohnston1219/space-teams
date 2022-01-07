/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
    Accordion,
    Card,
    Container,
    Header,
    Popup,
    Button,
} from "semantic-ui-react";
import { openScorecardModal } from "../actions/ui";

const compDateFormatStr = "ddd MMM Do YYYY";
const actDateFormatStr = "ddd MMM Do";

const CompetitionItem = ({
    competition,
    cardWidth,
    cardFluid,
    containerStyle,
    selectedCompItem,
    cardOnClick,
    descriptionOnly
}) => {

    const dispatch = useDispatch();

    const teams = useSelector((state) => state.teams.list);

    const defaultCardStyle = {
        margin: "auto",
        width: cardWidth,
    };

    const selectedCardStyle = {
        margin: "auto",
        width: cardWidth,
        border: "2px solid",
        borderRadius: "10px",
    };

    const [cardStyle, setCardStyle] = React.useState(defaultCardStyle);

    React.useEffect(() => {
        (selectedCompItem === competition.id)
            ? setCardStyle(selectedCardStyle)
            : setCardStyle(defaultCardStyle);

    }, [competition, selectedCompItem]);

    const getActivities = (competition) => {

        const { activities } = competition;

        if (!activities || activities.length === 0) {
            return null;
        }

        let activityCounter = 0;
        const activityPanels = activities.map(activity => {
            const startDate = new Date(activity.startDate);
            const startDateStr = moment(activity.startDate).utc().format(actDateFormatStr);
            const endDateStr = moment(activity.endDate).utc().format(actDateFormatStr);
            const today = new Date();
            const hasStarted = today > startDate;
            const panel = {
                key: `panel-${activityCounter++}`,
                title: `${activity.name} (${startDateStr} - ${endDateStr})`,
                content: { content: getActivityDescription(activity) },
            };
            if (!hasStarted) {
                panel.onTitleClick = () => {};
                panel.title = (
                    <Popup
                        trigger={
                            <Accordion.Title className="disabled-accordion-title">
                                {`${activity.name} (${startDateStr} - ${endDateStr})`}
                            </Accordion.Title>
                        }
                    >
                        <Popup.Content>{
                            "This activity will be availiable on " +
                                startDateStr
                        }</Popup.Content>
                    </Popup>
                );
            }
            return panel;
        });

        return activityPanels;
    };

    const getActivityDescription = (activity) => {
        if (!activity.scorecard) {
            return (
                <>
                    <p style={{ textDecoration: "none", color: "black" }}>{activity.description}</p>
                    {!descriptionOnly && <Button disabled>No Submission</Button>}
                </>
            );
        }
        return (
            <>
                <p style={{ textDecoration: "none", color: "black" }}>{activity.description}</p>
                {!descriptionOnly && (
                    <Button
                        onClick={() => dispatch(openScorecardModal(activity, false))}
                    >
                        Scorecard
                    </Button>
                )}
            </>
        );
    }

    const renderAccordion = (panels) => (
        competition.activities && competition.activities.length
            ? (
                <>
                    <Header size="medium">Activities</Header>
                    <Accordion fluid panels={panels} styled />
                </>
            ) : (
                <>
                    <Header size="medium">No Activities</Header>
                </>
            )
    )

    const endDate = moment(competition.endDate).utc().format(compDateFormatStr);

    const renderTeamName = (id, teams) => {
        const team = teams.find(t => t.id === id);
        if (team) {
            return team.name;
        } else {
            return "";
        }
    };

    return (
        <Container style={containerStyle} color="green">
            <Card centered fluid={!cardFluid && true} style={cardStyle} onClick={cardOnClick}>
                <Card.Content>
                    <Header size="large">{competition.name}</Header>
                    {competition.teamId && teams && (
                        <Card.Meta>
                            <p>{`Team: ${renderTeamName(competition.teamId, teams)}`}</p>
                            <p>{`League: ${competition.league || ""}`}</p>
                        </Card.Meta>
                    )}
                </Card.Content>
                <Card.Content>
                    {renderAccordion(getActivities(competition))}
                </Card.Content>
                <Card.Content extra>
                    {endDate}
                </Card.Content>
            </Card>
        </Container>
    )
}

export default CompetitionItem;

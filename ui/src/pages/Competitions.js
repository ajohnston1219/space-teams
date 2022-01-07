/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useDispatch } from "react-redux";
import { Card } from "semantic-ui-react";
import {
    setActiveNavTab
} from "../actions/ui";
import { getUserCompetitions } from "../actions/competitions";
import CompetitionsList from '../components/CompetitionsList';
import { NavTab } from "../utils/enums";

const Competitions = () => {

    const dispatch = useDispatch();
    
    React.useEffect(() => {
        dispatch(setActiveNavTab(NavTab.COMPETITIONS));
    }, []);

    React.useEffect(() => {
        dispatch(getUserCompetitions());
    }, []);

    return (
        <div>
            <Card
                className="dashboard-card"
                centered
            >
                <Card.Content>
                    <Card.Header>Competitions</Card.Header>
                </Card.Content>
                <Card.Content>
                    <CompetitionsList />
                </Card.Content>
            </Card>
        </div>
    );
};

export default Competitions;

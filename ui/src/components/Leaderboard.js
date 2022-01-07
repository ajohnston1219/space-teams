/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Card,
    Item,
    Message,
    Dropdown
} from "semantic-ui-react";
import { getCompetitionLeaderboard, setSelectedLeaderboard } from "../actions/competitions";
import { uniqueById } from "../utils/unique";

import LeaderboardTeam from "./LeaderboardTeam";

const createLeaderboard = (scoreList, n) => {
    return scoreList.slice(0, Math.min(scoreList.length, n))
        .map((s, i) => ({
            key: s.team.id,
            score: s.score,
            id: s.team.id,
            name: s.team.name,
            league: s.league,
            rank: i+1
        }));
};

const renderLeaderboard = (leaderboard, selectedComp, competitions) => {
    if (!selectedComp) {
        return null;
    }
    if (!competitions || !competitions.length) {
        return (
            <Message>
                <Message.Header>Create a Team</Message.Header>
                <p>
                    Create a team to view the leaderboard
                </p>
            </Message>
        );
    }
    if (leaderboard && leaderboard.length !== 0) {
        return (
            <Item.Group divided>
                {createLeaderboard(leaderboard, 3).map(t => (
                    <LeaderboardTeam key={t.id} team={t}/>
                ))}
            </Item.Group>
        );
    }
    return "LOADING...";
};

const renderMyTeam = (leaderboard, teams) => {
    if (teams && teams.length) {
        const myTeam = createLeaderboard(leaderboard, leaderboard.length).find(s => teams.some(t => t.name === s.name));
        if (!myTeam || myTeam.rank <= 3) {
            return null;
        }
        return (
            <React.Fragment>
                <Card.Content>
                    <Card.Header>My Team</Card.Header>
                </Card.Content>
                <Card.Content>
                    <Item.Group divided>
                        <LeaderboardTeam team={myTeam} league={myTeam.league}/>
                    </Item.Group>
                </Card.Content>
            </React.Fragment>
        );
    }
};

const Leaderboard = () => {

    const dispatch = useDispatch();

    const teams = useSelector((state) => state.teams.list);
    const competitions = useSelector(
        (state) => uniqueById(state.competitions.userComps.filter(c => c.teamIsActive))
    );
    const leaderboard = useSelector((state) => state.competitions.leaderboard.list);
    const selectedComp = useSelector((state) => state.competitions.currentCompetition);

    React.useEffect(() => {
        const leaderboardPoll = () => {
            if (selectedComp) {
                dispatch(getCompetitionLeaderboard(selectedComp.id));
            }
        };
        leaderboardPoll();
        const interval = setInterval(leaderboardPoll, 5000);
        return () => clearInterval(interval);
    }, [selectedComp]);

    React.useEffect(() => {
        if (selectedComp)
            dispatch(setSelectedLeaderboard(selectedComp.id));
    }, [selectedComp]);

    return (
        <Card className="dashboard-card" centered>
            <Card.Content>
                <Card.Header>Leaderboard</Card.Header>
            </Card.Content>
            <Card.Content>
                {renderLeaderboard(leaderboard, selectedComp, competitions)}
            </Card.Content>
            {renderMyTeam(leaderboard, teams)}
        </Card>
    );
};

export default Leaderboard;

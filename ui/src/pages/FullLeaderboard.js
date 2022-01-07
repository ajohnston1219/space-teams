/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Card,
    Item,
    Message,
    Dropdown,
    Form
} from "semantic-ui-react";
import {
    getCompetitionLeaderboard,
    setSelectedLeaderboard
} from "../actions/competitions";
import {
    setActiveNavTab
} from "../actions/ui";
import { NavTab, UserType } from "../utils/enums";
import { uniqueById } from "../utils/unique";

import LeaderboardTeam from "../components/LeaderboardTeam";
const createLeaderboard = (scoreList, league) => {
    return scoreList
        .filter(t => league === "ALL" || t.league === league)
        .map((s, i) => ({
            key: s.team.id,
            score: s.score,
            id: s.team.id,
            name: s.team.name,
            rank: i+1
        }));
};

const FullLeaderboard = () => {

    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const teams = useSelector((state) => state.teams.list);
    const competitions = useSelector(
        (state) => {
            if (user.type === UserType.ADMIN) {
                return state.competitions.activeComps;
            } else {
                return uniqueById(state.competitions.userComps.filter(c => c.teamIsActive))
            }
        }
    );
    const leaderboard = useSelector((state) => state.competitions.leaderboard.list);
    const leaderboardLoading = useSelector((state) => state.competitions.leaderboard.loading);
    const selectedComp = useSelector((state) => state.competitions.currentCompetition);
    const leagues = selectedComp && selectedComp.leagues;

    const [activities, setActivities] = React.useState([]);
    const [activityOptions, setActivityOptions] = React.useState([
        { key: "Total Score", text: "Total Score", value: "Total" },
    ]);
    const [selectedActivity, setSelectedActivity] = React.useState("Total");
    const [selectedLeague, setSelectedLeague] = React.useState("ALL");

    React.useEffect(() => {
        dispatch(setActiveNavTab(NavTab.LEADERBOARD));
    }, []);

    React.useEffect(() => {
        const leaderboardPoll = () => {
            if (selectedComp) {
                dispatch(getCompetitionLeaderboard(selectedComp.id, selectedActivity));
            }
        };
        leaderboardPoll();
        const interval = setInterval(leaderboardPoll, 5000);
        return () => clearInterval(interval);
    }, [selectedComp, selectedActivity, getCompetitionLeaderboard]);

    React.useEffect(() => {
        if (selectedComp) {
            if (selectedComp.activities) {
                setActivities(selectedComp.activities);
                setActivityOptions([
                    { key: "Total Score", text: "Total Score", value: "Total" },
                    ...selectedComp.activities.map(a => ({
                        key: a.id,
                        text: a.name,
                        value: a.id
                    }))
                ]);
            } else {
                setActivityOptions([
                    { key: "Total Score", text: "Total Score", value: "Total" },
                ]);
            }
        }
    }, [selectedComp]);

    // const getCompetitionOptions = () => competitions
    //       .filter(c => c.teamId && c.teamIsActive)
    //       .map(c => ({
    //           key: c.id,
    //           text: c.name,
    //           value: c.id
    //       }));

    const myTeam = teams
          .filter(t => selectedComp && t.competitionId === selectedComp.id)
          .find(t => t.members.some(m => m.id === user.id));

    const getActivity = () => activities.find(a => a.id === selectedActivity);

    const renderLeaderboard = () => {
        if (!selectedComp) {
            return null;
        }
        if (!competitions || !competitions.length) {
            return (
                <Message>
                    <Message.Header>Create a Team</Message.Header>
                    <p>
                        Create a team on the home page to view the leaderboard
                    </p>
                </Message>
            );
        }
        if (leaderboard.length === 0 && leaderboardLoading)
            return "LOADING...";
        if (leaderboard && leaderboard.length !== 0) {
            return (
                <Item.Group divided>
                    {createLeaderboard(leaderboard, selectedLeague)
                     .map(t => (
                         <LeaderboardTeam
                             key={t.id}
                             team={t}
                             myTeam={myTeam}
                             activity={getActivity()}
                             full
                         />
                     ))
                    }
                </Item.Group>
            );
        }
        return (
            <Item.Group divided>
            </Item.Group>
        );
    };

    let leagueOpts = [{ key: "ALL", text: "All", value: "ALL" }];
    if (leagues)
        leagueOpts = [...leagueOpts, ...leagues.map(l => ({
            key: l.id,
            text: l.name,
            value: l.name
        }))];

    return (
        <Card className="dashboard-card" centered>
            <Card.Content>
                <Card.Header>Leaderboard</Card.Header>
            </Card.Content>
            <Card.Content>
                <Form>
                    <label for="league" style={{ marginRight: "1rem"}}>League</label>
                    <Dropdown
                        selection
                        search
                        name="league"
                        label="League"
                        placeholder="Select League"
                        value={selectedLeague}
                        onChange={(e, { value }) => setSelectedLeague(value)}
                        options={leagueOpts}
                    />
                </Form>
            </Card.Content>
            {competitions && !!competitions.length && selectedComp && (
                <Card.Content>
                    <Form>
                        <Form.Select
                            inline
                            label="Activity"
                            placeholder="Select Activity"
                            value={selectedActivity}
                            options={activityOptions}
                            onChange={(e, { value }) => setSelectedActivity(value)}
                        />
                    </Form>
                </Card.Content>
            )}
            <Card.Content>
                {renderLeaderboard()}
            </Card.Content>
        </Card>
    );
};

export default FullLeaderboard;

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Item,
    Grid,
    Statistic,
    Button
} from "semantic-ui-react";
import { openScorecardComparisonModal } from "../actions/ui";
import { UserType } from "../utils/enums";

const LeaderboardTeam = ({ team, myTeam, activity, full }) => {

    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const competition = useSelector(
        (state) => {
            if (user.type === UserType.ADMIN) {
                return state.competitions.currentCompetition;
            } else {
                return state.competitions.userComps
                    .filter(c => c.teamIsActive)
                    .find(c => myTeam && (c.teamId === myTeam.id));
            }
        }
    );
    let completedActivities;
    if (user.type === UserType.ADMIN) {
        completedActivities = competition && competition.activities;
    } else {
        completedActivities = competition && competition.activities.filter(a => !!a.scorecard);
    }

    const score = parseFloat(team.score);
    const scoreStr = score >= 100 ? score.toFixed(1).toString() : score.toFixed(2).toString();

    return (
        <Item key={team.name}>
            <Item.Content>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            <Statistic size="small">
                                <Statistic.Value>{team.rank}</Statistic.Value>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Item.Header><h3>{team.name}</h3></Item.Header>
                            <Item.Meta><h3>{team.league}</h3></Item.Meta>
                            {/* <Item.Description> */}
                            {/*   <List> */}
                            {/*     {team.members.map(m => ( */}
                            {/*         <List.Item key={m.username}> */}
                            {/*           <List.Icon name="user"/> */}
                            {/*           <List.Content>{m.username}</List.Content> */}
                            {/*         </List.Item> */}
                            {/*     ))} */}
                            {/*   </List> */}
                            {/* </Item.Description> */}
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Statistic size="small">
                                <Statistic.Value>{scoreStr}</Statistic.Value>
                                <Statistic.Label>Points</Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                        {full && (
                            <Grid.Column width={2}>
                                {activity && activity !== "" && user.type !== UserType.ADMIN && (
                                    <Button
                                        onClick={
                                            () => dispatch(
                                                openScorecardComparisonModal(myTeam.id, team.id, activity)
                                            )
                                        }
                                        floated="right"
                                        disabled={!completedActivities.some(a => a.id === activity.id)}
                                    >
                                        Compare
                                    </Button>
                                )}
                            </Grid.Column>
                        )}
                    </Grid.Row>
                </Grid>
            </Item.Content>
        </Item>
    );
};

export default LeaderboardTeam;

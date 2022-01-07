import React from "react";
import { useSelector } from "react-redux";
import {
    Card,
    Statistic,
    Dimmer,
    Loader
} from "semantic-ui-react";

const UserStats = ({
    user,
    teams
}) => {

    const user = useSelector((state) => state.user);
    const teams = useSelector((state) => state.teams);

    return (
        <Card className="dashboard-card" centered>
            <Card.Content>
                <Card.Header>{ user.username }</Card.Header>
                <Card.Meta>Statistics</Card.Meta>
            </Card.Content>
            <Card.Content>
                <Statistic.Group widths="two">
                    {
                        teams.loading
                            ? (
                                <Loader active/>
                            ) : (
                                <Statistic>
                                    <Statistic.Value>
                                        {teams.list.length}
                                    </Statistic.Value>
                                    <Statistic.Label>
                                        Teams
                                    </Statistic.Label>
                                </Statistic>
                            )
                    }
                    <Statistic>
                        <Statistic.Value>
                            1
                        </Statistic.Value>
                        <Statistic.Label>
                            Competitions
                        </Statistic.Label>
                    </Statistic>
                </Statistic.Group>
            </Card.Content>
        </Card>
    );
}

export default UserStats;

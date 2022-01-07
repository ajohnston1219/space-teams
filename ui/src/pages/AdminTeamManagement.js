import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Grid,
    Container,
    Card,
    Item,
    Loader,
    Input,
    Dropdown,
    Button
} from "semantic-ui-react";
import TeamItem from "../components/TeamItem";

import { getAllTeams } from "../actions/teams";

const Search = ({ search, setSearch, clear }) => {
    return (
        <Grid style={{ marginTop: "1rem" }}>
            <Grid.Row>
                <Grid.Column width={14}>
                    <Input
                        placeholder="Search"
                        fluid
                        value={search}
                        onChange={(e, { value }) => setSearch(value)}
                    />
                </Grid.Column>
                <Grid.Column width={2}>
                    <Button icon="close" onClick={clear}/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

const TeamsList = ({ teams, search, selectedLeague, loading }) => {
    const [teamsList, setTeamsList] = React.useState(teams);
    const [isFiltered, setIsFiltered] = React.useState(false);
    React.useEffect(() => {
        if (search !== "") {
            const regex = new RegExp(search, "i");
            setTeamsList(teams.filter(t => regex.test(t.name)));
            console.log("SEARCH", teamsList);
            setIsFiltered(true);
        } else if (isFiltered && search === "") {
            setTeamsList(teams);
            console.log("NO SEARCH", teamsList);
            setIsFiltered(false);
        }
    }, [search]);

    return (
        <Item.Group>
            {teamsList
             .filter(t => selectedLeague === "ALL" || t.league === selectedLeague)
             .map(t => (
                 <TeamItem
                     key={t.id}
                     team={t}
                     noButtons
                 />
             ))}
        </Item.Group>
    );
};


const AdminTeamManagement = () => {

    const dispatch = useDispatch();

    const currentComp = useSelector((state) => state.competitions.currentCompetition);
    const leagues = currentComp && currentComp.leagues;
    const loading = useSelector((state) => state.teams.loading);
    const teams = useSelector((state) => state.teams.list);

    const [hasLoaded, setHasLoaded] = React.useState(false);
    const [lastLoadedComp, setLastLoadedComp] = React.useState(currentComp);
    const [selectedLeague, setSelectedLeague] = React.useState("ALL");
    const [search, setSearch] = React.useState("");

    const clearSearch = () => {
        setSearch("");
    };

    // Loading
    React.useEffect(() => {
        if (currentComp && !loading && !hasLoaded) {
            setLastLoadedComp(currentComp);
            dispatch(getAllTeams(currentComp.id));
            setHasLoaded(true);
        }
    }, [currentComp, loading, hasLoaded]);
    // Change competition
    React.useEffect(() => {
        if (hasLoaded && currentComp && currentComp.id !== lastLoadedComp.id && !loading) {
            setHasLoaded(false);
            setLastLoadedComp(currentComp);
            dispatch(getAllTeams(currentComp.id));
        }
    }, [currentComp, lastLoadedComp, hasLoaded, loading]);

    let leagueOpts = [{ key: "ALL", text: "All", value: "ALL" }];
    if (leagues)
        leagueOpts = [...leagueOpts, ...leagues.map(l => ({
            key: l.id,
            text: l.name,
            value: l.name
        }))];

    let teamOpts = [{ key: "ALL", text: "All", value: "ALL" }];
    if (teams)
        teamOpts = [...teamOpts, ...teams.map(t => ({
            key: t.id,
            text: t.name,
            value: t.id
        }))];

    const renderTeamsList = () => {
        if (loading) {
            return <Loader/>;
        }
        return (
            <TeamsList
                teams={teams}
                search={search}
                selectedLeague={selectedLeague}
                loading={loading}
            />
        );
    };

    return (
        <Container>
            <Card
                className="dashboard-card"
                centered
            >
                <Card.Content>
                    <Grid style={{ marginTop: "1rem" }}>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <h3>Team Management</h3>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Dropdown
                                    selection
                                    search
                                    fluid
                                    placeholder="League"
                                    value={selectedLeague}
                                    onChange={(e, { value }) => setSelectedLeague(value)}
                                    options={leagueOpts}
                                />
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Button
                                    icon="refresh"
                                    onClick={() => dispatch(getAllTeams(currentComp.id))}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Content>
                <Card.Content>
                    <h4>Search</h4>
                    <Search
                        search={search}
                        setSearch={setSearch}
                        clear={clearSearch}
                    />
                </Card.Content>
                <Card.Content>
                    {renderTeamsList()}
                </Card.Content>
            </Card>
        </Container>
    );
};

export default AdminTeamManagement;

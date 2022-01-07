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
import { UserType } from "../utils/enums";
import { getCompetitionUsers } from "../actions/user";

const KeyValue = ({ keyName, value }) => {
    return (
        <p>
            <span
                style={{
                    fontWeight: "bold"
                }}
            >
                {`${keyName}: `}
            </span>
            {value}
        </p>
    );
};

const UserItem = ({ user }) => {

    const baseURL = process.env.REACT_APP_WEBSITE_URL;
    const activationLink = baseURL + `/activate-user-account?hash=${user.hash}&email=${user.email}`;
    const platformCode = user.learningPlatformCode || "Not Assigned";
    const activeText = user.active ? "True" : "False";

    return (
        <Item>
            <Item.Content>
                <Item.Header>{`${user.firstName || ""} ${user.lastName || ""}`}</Item.Header>
                <Item.Meta>{user.team}</Item.Meta>
                <Item.Description>
                    <KeyValue keyName="Active" value={activeText}/>
                    <KeyValue keyName="ID" value={user.id}/>
                    <KeyValue keyName="Email" value={user.email}/>
                    <KeyValue keyName="Username" value={user.username}/>
                    <KeyValue keyName="Learning Platform Code" value={platformCode}/>
                    {user.hash && !user.active && (
                        <KeyValue keyName="Activation Link" value={activationLink}/>
                    )}
                </Item.Description>
            </Item.Content>
        </Item>
    );
};

const MentorItem = ({ user }) => {

    return (
        <Item>
            <Item.Content>
                <Item.Header>{`${user.firstName || ""} ${user.lastName || ""}`}</Item.Header>
                <Item.Description>
                    <KeyValue keyName="ID" value={user.id}/>
                    <KeyValue keyName="Email" value={user.email}/>
                    <KeyValue keyName="Username" value={user.username}/>
                </Item.Description>
            </Item.Content>
        </Item>
    );
};

const UserList = ({ users, search, searchField }) => {
    const [userList, setUserList] = React.useState(users);
    const [isFiltered, setIsFiltered] = React.useState(false);
    React.useEffect(() => {
        if (search !== "" && searchField !== "") {
            const regex = new RegExp(search, "i");
            setUserList(users.filter(u => regex.test(u[searchField])));
            setIsFiltered(true);
        } else if (isFiltered && search === "") {
            setUserList(users);
            setIsFiltered(false);
        }
    }, [search, searchField]);

    return (
        <Item.Group divided>
            {userList.map(u => (<UserItem key={u.id} user={u}/>))}
        </Item.Group>
    );
};

const MentorList = ({ users, search, searchField }) => {
    const [userList, setUserList] = React.useState(users);
    const [isFiltered, setIsFiltered] = React.useState(false);
    React.useEffect(() => {
        if (search !== "" && searchField !== "") {
            const regex = new RegExp(search, "i");
            setUserList(users.filter(u => regex.test(u[searchField])));
            setIsFiltered(true);
        } else if (isFiltered && search === "") {
            setUserList(users);
            setIsFiltered(false);
        }
    }, [search, searchField]);

    return (
        <Item.Group divided>
            {userList.map(u => (<MentorItem key={u.id} user={u}/>))}
        </Item.Group>
    );
};

const searchByOptions = [
    { key: "username", text: "Username", value: "username" },
    { key: "email", text: "Email", value: "email" },
    { key: "firstName", text: "First Name", value: "firstName" },
    { key: "lastName", text: "Last Name", value: "lastName" }
];

const Search = ({ search, setSearch, searchField, setSearchField, clear }) => {
    return (
        <Grid style={{ marginTop: "1rem" }}>
            <Grid.Row>
                <Grid.Column width={8}>
                    <Input
                        placeholder="Search"
                        fluid
                        value={search}
                        onChange={(e, { value }) => setSearch(value)}
                    />
                </Grid.Column>
                <Grid.Column width={6}>
                    <Dropdown
                        selection
                        search
                        fluid
                        placeholder="Search By"
                        value={searchField}
                        onChange={(e, { value }) => setSearchField(value)}
                        options={searchByOptions}
                    />
                </Grid.Column>
                <Grid.Column width={2}>
                    <Button icon="close" onClick={clear}/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

const AdminUserManagement = () => {

    const dispatch = useDispatch();

    const currentComp = useSelector((state) => state.competitions.currentCompetition);
    const loading = useSelector((state) => state.user.competitionUsers.loading);
    const users = useSelector((state) => state.user.competitionUsers.list);

    const [hasLoaded, setHasLoaded] = React.useState(false);
    const [lastLoadedComp, setLastLoadedComp] = React.useState(currentComp);
    const [search, setSearch] = React.useState("");
    const [searchField, setSearchField] = React.useState("");
    const [userType, setUserType] = React.useState("paid");

    const clearSearch = () => {
        setSearch("");
        setSearchField("");
    };

    // Loading
    React.useEffect(() => {
        if (currentComp && !loading && !hasLoaded) {
            setLastLoadedComp(currentComp);
            dispatch(getCompetitionUsers(currentComp.id, userType));
            setHasLoaded(true);
        }
    }, [currentComp, loading, hasLoaded]);
    // Change competition
    React.useEffect(() => {
        if (hasLoaded && currentComp && currentComp.id !== lastLoadedComp.id && !loading) {
            setHasLoaded(false);
            setLastLoadedComp(currentComp);
            dispatch(getCompetitionUsers(currentComp.id, userType));
        }
    }, [currentComp, lastLoadedComp, hasLoaded, loading]);
    // Change user type
    React.useEffect(() => {
        if (currentComp) {
            dispatch(getCompetitionUsers(currentComp.id, userType));
        }
    }, [userType]);

    const userTypeOptions = [
        { key: "paid", value: "paid", text: "Paid Users" },
        { key: "unpaid", value: "unpaid", text: "Un-Paid Users" },
        { key: "mentor", value: "mentor", text: "Mentors" }
    ];

    const renderUserList = () => {
        if (loading) {
            return <Loader/>;
        }
        if (userType === "mentor") {
            return (
                <MentorList
                    users={users}
                    search={search}
                    searchField={searchField}
                />
            );
        }
        return (
            <UserList
                users={users}
                search={search}
                searchField={searchField}
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
                                <h3>User Management</h3>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Dropdown
                                    selection
                                    search
                                    fluid
                                    placeholder="User Type"
                                    value={userType}
                                    onChange={(e, { value }) => setUserType(value)}
                                    options={userTypeOptions}
                                />
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Button
                                    icon="refresh"
                                    onClick={() => dispatch(getCompetitionUsers(currentComp.id, userType))}
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
                        searchField={searchField}
                        setSearchField={setSearchField}
                        clear={clearSearch}
                    />
                </Card.Content>
                <Card.Content>
                    {renderUserList()}
                </Card.Content>
            </Card>
        </Container>
    );
};

export default AdminUserManagement;

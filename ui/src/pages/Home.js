import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import TeamList from "../components/TeamList";
import Bulletin from "../components/Bulletin";
import Leaderboard from "../components/Leaderboard";
import LoginForm from "../components/LoginForm";

const Home = () => {
    const user = useSelector((state) => state.user);

    return (
        <Grid columns={3} stackable>
            {!user.loggedIn && (
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90vw",
                        background: "rgba(5, 5, 5, 0.5)"
                    }}
                >
                    <LoginForm/>
                </div>
            )}
            {user.loggedIn && (
                <Grid.Row>
                    <Grid.Column>
                        <TeamList/>
                    </Grid.Column>
                    <Grid.Column>
                        <Bulletin/>
                    </Grid.Column>
                    <Grid.Column>
                        <Leaderboard/>
                    </Grid.Column>
                </Grid.Row>
            )}
        </Grid>
    );
}

export default Home;

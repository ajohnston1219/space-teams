import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import AnnouncementList from "../components/AnnouncementList";
import LoginForm from "../components/LoginForm";
import AdminCompetitionsList from "../components/AdminCompetitionsList";

const AdminHome = () => {

    const user = useSelector((state) => state.user);

    return (
        <Grid columns={1} stackable>
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
                        <AnnouncementList/>
                    </Grid.Column>
                    {/* <Grid.Column> */}
                    {/*     <AdminCompetitionsList/> */}
                    {/* </Grid.Column> */}
                </Grid.Row>
            )}
        </Grid>
    );
}

export default AdminHome;

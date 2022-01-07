/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { NavTab, UserType } from "./utils/enums";
import { PARENT_CONSENT_AGE } from "./utils/constants";
import "./App.scss";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";

import AlertModal from "./components/AlertModal";
import ConfirmationModal from "./components/ConfirmationModal";
import LoginModal from "./components/LoginModal";
import CreateTeamModal from "./components/CreateTeamModal";
import TeamInviteModal from "./components/TeamInviteModal";
import TeamInviteTypeModal from "./components/TeamInviteTypeModal";
import InviteToSimModal from "./components/InviteToSimModal";
import MentorInviteModal from "./components/MentorInviteModal";
import MentorSignup from "./pages/MentorSignup";
import JoinTeamModal from "./components/JoinTeamModal";
import JoinCompetitionModal from "./components/JoinCompetitionModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdminHome from "./pages/AdminHome";
import Competitions from "./pages/Competitions";
import Signup from "./pages/Signup";
import AccountInfo from "./pages/AccountInfo";
import ActivateAccount from "./pages/ActivateAccount";
import ParentInfo from "./pages/ParentInfo";
import ParentConsent from "./pages/ParentConsent";
import ResetPassword from "./pages/ResetPassword";
import AccountSettings from "./pages/AccountSettings";
import BugReportModal from "./components/BugReportModal";
import CreateAnnouncementModal from "./components/CreateAnnouncementModal";
import ScorecardModal from "./components/ScorecardModal";
import ScorecardComparisonModal from "./components/ScorecardComparisonModal";
import CompetitionInfoModal from "./components/CompetitionInfoModal";
import CreateCompetition from "./pages/CreateCompetition";
import CompetitionRegistration from "./pages/CompetitionRegistration";
import PaymentConfirmationModal from "./components/PaymentConfirmationModal";
import CompetitionBulkPay from "./pages/CompetitionBulkPay";
import BulkPaymentConfirmationModal from "./components/BulkPaymentConfirmationModal";
import OrganizationRegistration from "./pages/OrganizationRegistration";
import SignupTypeModal from "./components/SignupTypeModal";
import FullLeaderboard from "./pages/FullLeaderboard";
import Downloads from "./pages/Downloads";
import Chat from "./pages/Chat";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminTeamManagement from "./pages/AdminTeamManagement";
import ChatModeration from "./pages/ChatModeration";
import Store from "./pages/Store";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Receipt from "./pages/Receipt";

import {
    openLoginModal,
    closeLoginModal,
    openCreateTeamModal,
    closeCreateTeamModal,
    openTeamInviteModal,
    closeTeamInviteModal,
    openJoinCompetitionModal,
    closeJoinCompetitionModal,
    setAppLoading,
    openResetPasswordModal,
    closeResetPasswordModal,
    closeCompetitionInfoModal,
    setActiveNavTab
} from "./actions/ui";
import { loadUserData } from "./actions/user";
import { setCurrentCompetition } from "./actions/competitions";
import { Loader } from "semantic-ui-react";
import moment from "moment";

import pusherClient from "./utils/pusher";

const App = () => {

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const ui = useSelector((state) => state.ui);
    const user = useSelector((state) => state.user);
    const userComps = useSelector((state) => state.competitions.userComps);
    const activeComps = useSelector((state) => state.competitions.activeComps);
    const selectedComp = useSelector((state) => state.competitions.currentCompetition);

    // Set admin competition
    React.useEffect(() => {
        if (user.loggedIn && user.type === UserType.ADMIN && activeComps && !selectedComp) {
            const sortedActiveComps = activeComps.sort((a, b) => {
                const aStart = moment(a.startDate);
                const bStart = moment(a.startDate);
                return aStart.diff(bStart);
            });
            dispatch(setCurrentCompetition(sortedActiveComps[0]));
        }
    }, [user.loggedIn, user.type, activeComps, selectedComp]);

    React.useEffect(() => {
        if (localStorage.getItem("token"))
            dispatch(setAppLoading(true));
        dispatch(loadUserData());
    }, []);

    React.useEffect(() => {
        if (user.loggedIn) {
            if (!pusherClient.isConnected) {
                pusherClient
                    .connect()
                    .then(() => console.log("Pusher connected"))
                    .catch(err => console.warn("Pusher connection error:", err));
            }
        } else { // not logged in
            if (pusherClient.isConnected) {
                pusherClient.disconnect();
            }
        }
    }, [user.loggedIn]);

    let competitionId = new URLSearchParams(location.search).get("competition_id");
    if (competitionId)
        localStorage.setItem("competition_id", competitionId);
    else
        competitionId = localStorage.getItem("competition_id");


    const renderDashboardContent = (tab) => {
        switch (tab) {
        case NavTab.HOME: {
            return <Home />;
        }
        case NavTab.SIMULATIONS: {
            history.push("/simulations");
            return <div />;
        }
        case NavTab.COMPETITIONS: {
            history.push("/competitions");
            return <div />;
        }
        case NavTab.LEADERBOARD: {
            history.push("/leaderboard");
            return <div />;
        }
        case NavTab.CHAT: {
            history.push("/chat");
            return <div />;
        }
        case NavTab.DOWNLOADS: {
            history.push("/downloads");
            return <div />;
        }
        case NavTab.STORE: {
            history.push("/store");
            return <div />;
        }
        default: {
            setActiveNavTab(NavTab.HOME);
            return <Home />;
        }
        }
    };

    const renderAdminDashboardContent = (tab) => {
        switch (tab) {
        case NavTab.HOME: {
            return <AdminHome />;
        }
        case NavTab.USER_MANAGEMENT: {
            history.push("/user-management");
            return <div />;
        }
        case NavTab.TEAM_MANAGEMENT: {
            history.push("/team-management");
            return <div />;
        }
        case NavTab.CHAT: {
            history.push("/chat");
            return <div />;
        }
        case NavTab.LEADERBOARD: {
            history.push("/leaderboard");
            return <div />;
        }
        default: {
            setActiveNavTab(NavTab.HOME);
            return <AdminHome />;
        }
        }
    };

    const navHeight = plus => `${6 + plus}rem`;

    const renderApp = () => {
        const loginBlockedPaths = [
            "/signup",
            "/mentor-signup",
            "/organization-registration",
            "/competition-bulk-pay"
        ];

        if (user.loggedIn && loginBlockedPaths.some(p => location.pathname.startsWith(p))) {
            history.push("/");
        }

        if (user.type !== UserType.INITIAL_USER && location.pathname.startsWith("/finish-registration")) {
            let nextUrl = user.age >= PARENT_CONSENT_AGE ? "/competition-registration" : "/parent-info";
            if (competitionId)
                nextUrl += "?competition_id=" + competitionId;
            if (userComps.length > 0)
                nextUrl = "/";
            history.push(nextUrl);
        }
        if (ui.loading) {
            return (
                <Loader active />
            );
        }
        if (!user.loggedIn) {
            const blockedPaths = [
                "/competitions",
                "/leaderboard",
                "/downloads",
                "/chat",
                "/account-settings"
            ];
            if (blockedPaths.some(p => location.pathname.startsWith(p))) {
                history.push("/");
            }
            return (
                <>
                    <div style={{ paddingTop: navHeight(4) }}>
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/signup" component={Signup} />
                            <Route exact path="/mentor-signup" component={MentorSignup} />
                            <Route exact path="/activate-user-account" component={ActivateAccount} />
                            <Route exact path="/reset-password/:key" component={ResetPassword} />
                            <Route exact path="/competition-bulk-pay" component={CompetitionBulkPay} />
                            <Route exact path="/organization-registration" component={OrganizationRegistration} />
                            <Route exact path="/parent-consent" component={ParentConsent} />
                        </Switch>
                        <ResetPasswordModal
                            open={ui.resetPasswordModalOpen}
                            onOpen={() => dispatch(openResetPasswordModal())}
                            onClose={() => dispatch(closeResetPasswordModal())}
                        />
                        <AlertModal />
                        <ConfirmationModal />
                        <LoginModal
                            open={ui.loginModalOpen}
                            onOpen={() => dispatch(openLoginModal())}
                            onClose={() => dispatch(closeLoginModal())}
                        />
                        <BulkPaymentConfirmationModal />
                        <SignupTypeModal />
                    </div>
                    <Navbar height={navHeight} />
                </>
            );
        }
        if (user.type === UserType.INITIAL_USER) {
            if (!location.pathname.startsWith("/finish-registration")) {
                let url = "/finish-registration";
                if (competitionId)
                    url += "?competition_id=" + competitionId;
                history.push(url);
            }
            return (
                <>
                    <div style={{ paddingTop: navHeight(4) }}>
                        <AlertModal />
                        <ConfirmationModal />
                        <Route exact path="/finish-registration" component={AccountInfo} />
                    </div>
                    <Navbar height={navHeight} />
                </>
            );
        }
        if (user.type === UserType.ADMIN) {
            return (
                <>
                    <div style={{ paddingTop: navHeight(4) }}>
                        <Switch>
                            <Route exact path="/" component={() => renderAdminDashboardContent(ui.activeNavTab)} />
                            <Route exact path="/user-management" component={AdminUserManagement} />
                            <Route exact path="/team-management" component={AdminTeamManagement} />
                            <Route exact path="/account-settings" component={AccountSettings} />
                            <Route exact path="/create-competition" component={CreateCompetition} />
                            <Route exact path="/chat" component={ChatModeration} />
                            <Route exact path="/leaderboard" component={FullLeaderboard} />
                        </Switch>
                        <AlertModal />
                        <ConfirmationModal />
                        <BugReportModal />
                        <CreateAnnouncementModal />
                        <LoginModal
                            open={ui.loginModalOpen}
                            onOpen={() => dispatch(openLoginModal())}
                            onClose={() => dispatch(closeLoginModal())}
                        />
                    </div>
                    <Navbar height={navHeight} />
                </>
            );
        }
        return ( // Regular user logged in
            <>
                <div style={{ paddingTop: navHeight(4) }}>
                    <Switch>
                        <Route exact path="/" component={() => renderDashboardContent(ui.activeNavTab)} />
                        <Route exact path="/account-settings" component={AccountSettings} />
                        <Route exact path="/competitions" component={Competitions} />
                        <Route exact path="/leaderboard" component={FullLeaderboard} />
                        <Route exact path="/downloads" component={Downloads} />
                        <Route exact path="/competition-registration" component={CompetitionRegistration} />
                        <Route exact path="/parent-info" component={ParentInfo} />
                        <Route exact path="/update-parent-info" component={ParentInfo} />
                        <Route exact path="/parent-consent" component={ParentConsent} />
                        <Route exact path="/chat" component={Chat} />
                        <Route exact path="/activate-user-account" component={ActivateAccount} />
                        <Route exact path="/store" component={Store} />
                        <Route exact path="/cart" component={Cart} />
                        <Route exact path="/checkout" component={Checkout} />
                        <Route exact path="/receipt" component={Receipt} />
                    </Switch>
                    <LoginModal
                        open={ui.loginModalOpen}
                        onOpen={() => dispatch(openLoginModal())}
                        onClose={() => dispatch(closeLoginModal())}
                    />
                    <CreateTeamModal
                        open={ui.createTeamModalOpen}
                        onOpen={() => dispatch(openCreateTeamModal())}
                        onClose={() => dispatch(closeCreateTeamModal())}
                    />
                    <TeamInviteTypeModal />
                    <TeamInviteModal
                        open={ui.teamInviteModalOpen}
                        onOpen={() => dispatch(openTeamInviteModal())}
                        onClose={() => dispatch(closeTeamInviteModal())}
                    />
                    <MentorInviteModal />
                    <InviteToSimModal />
                    <JoinTeamModal />
                    <JoinCompetitionModal
                        open={ui.JoinCompetitionModalOpen}
                        onOpen={() => dispatch(openJoinCompetitionModal())}
                        onClose={() => dispatch(closeJoinCompetitionModal())}
                    />
                    <ScorecardModal />
                    <ScorecardComparisonModal />
                    <AlertModal />
                    <ConfirmationModal />
                    <BugReportModal />
                    <CompetitionInfoModal
                        onClose={() => {
                            ui.closeCompetitionInfoCallback();
                            dispatch(closeCompetitionInfoModal());
                        }}
                    />
                    <PaymentConfirmationModal />
                </div>
                <Navbar height={navHeight} />
            </>
        );
    };

    return (
        <div className="App">
            {renderApp()}
        </div>
    );
};

export default App;

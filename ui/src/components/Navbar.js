/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    Menu,
    Dropdown,
    Segment,
    Button,
    Icon,
    Label
} from "semantic-ui-react";
import {
    setActiveNavTab,
    openLoginModal,
    openSignupTypeModal
} from "../actions/ui";
import { logout } from "../actions/user";
import { openBugReportModal } from "../actions/ui";
import { UserType, NavTab } from "../utils/enums";
import { uniqueById } from "../utils/unique";

import CompetitionSelection from "./CompetitionSelection";

const Navbar = ({
    height
}) => {

    const history = useHistory();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const userComps = useSelector(
        (state) => uniqueById(state.competitions.userComps.filter(c => c.teamIsActive))
    );
    const activeComps = useSelector((state) => state.competitions.activeComps);
    const activeNavTab = useSelector((state) => state.ui.activeNavTab);
    const numItemsInCart = useSelector((state) => state.billing.cart.items.length);

    const [mobileTabsVisible, setMobileTabsVisible] = React.useState(false);

    React.useEffect(() => {
        if (history.location.pathname === "/" && !activeNavTab) {
            dispatch(setActiveNavTab("Home"));
        }
    }, [history, activeNavTab, setActiveNavTab]);

    const handleItemClick = name => {
        setMobileTabsVisible(false);
        if (name === "Login") {
            dispatch(openLoginModal());
        }
        else if (name === "Logout") {
            dispatch(logout());
            dispatch(setActiveNavTab("Home"));
            history.push("/");
        }
        else if (name === "Sign Up") {
            dispatch(setActiveNavTab(null));
            dispatch(openSignupTypeModal());
        }
        else if (name === "Account Settings") {
            dispatch(setActiveNavTab(null));
            history.push("/account-settings");
        }
        else if (name === "Cart") {
            dispatch(setActiveNavTab(null));
            history.push("/cart");
        }
        else if (name === NavTab.HOME) {
            dispatch(setActiveNavTab(name));
            history.push("/");
        }
        else if (name === NavTab.COMPETITIONS) {
            dispatch(setActiveNavTab(name));
            history.push("/competitions");
        }
        else if (name === NavTab.LEADERBOARD) {
            dispatch(setActiveNavTab(name));
            history.push("/leaderboard");
        }
        else if (name === NavTab.CHAT) {
            dispatch(setActiveNavTab(name));
            history.push("/chat");
        }
        else if (name === NavTab.DOWNLOADS) {
            dispatch(setActiveNavTab(name));
            history.push("/downloads");
        }
        else if (name === NavTab.USER_MANAGEMENT) {
            dispatch(setActiveNavTab(name));
            history.push("/user-management");
        }
        else if (name === NavTab.TEAM_MANAGEMENT) {
            dispatch(setActiveNavTab(name));
            history.push("/team-management");
        }
        else if (name === NavTab.STORE) {
            dispatch(setActiveNavTab(name));
            history.push("/store");
        }
        else {
            dispatch(setActiveNavTab(name));
            history.push("/");
        }
    };

    const handleBugReportClick = () => {
        dispatch(openBugReportModal());
    };

    const renderAccountButtons = (user, isMobile) => {
        if (user.loggedIn) {
            return (
                <React.Fragment>
                    <Menu.Item
                        onClick={() => handleItemClick("Cart")}
                    >
                        <Icon name="cart"/>
                        {numItemsInCart > 0 && (
                            <Label color="red" floating>
                                {numItemsInCart}
                            </Label>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        <Dropdown text={user.username} pointing>
                            <Dropdown.Menu style={{ position: "absolute", left: "-60px", top: "20px" }}>
                                <Dropdown.Item
                                    text="Account Settings" icon="cog"
                                    onClick={() => handleItemClick("Account Settings")}
                                />
                                <Dropdown.Item
                                    text="Logout"
                                    onClick={() => handleItemClick("Logout")}
                                />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <Menu.Item
                        name="Login"
                        onClick={() => handleItemClick("Login")}
                    />
                    <Menu.Item
                        name="Sign Up"
                        onClick={() => handleItemClick("Sign Up")}
                    />
                </React.Fragment>
            );
        }
    };

    const renderNavTab = name => (
        <Menu.Item
            className="tab"
            name={name}
            active={activeNavTab === name}
            onClick={() => handleItemClick(name)}
        />
    );

    const renderTabs = user => (
        <>
            {renderNavTab(NavTab.HOME)}
            {user.loggedIn
             && (user.type === UserType.USER || user.type === UserType.MENTOR)
             && userComps && userComps.length > 0
             && renderNavTab(NavTab.COMPETITIONS)}
            {user.loggedIn
             && (((user.type === UserType.USER
                   || user.type === UserType.MENTOR)
                  && userComps && userComps.length > 0)
                 || user.type === UserType.ADMIN
                 && activeComps)
             && renderNavTab(NavTab.LEADERBOARD)}
            {user.loggedIn
             && (user.type === UserType.USER || user.type === UserType.MENTOR)
             && renderNavTab(NavTab.CHAT)}
            {user.loggedIn
             && (user.type === UserType.USER || user.type === UserType.MENTOR)
             && renderNavTab(NavTab.DOWNLOADS)}
            {user.loggedIn
             && (user.type === UserType.USER)
             && renderNavTab(NavTab.STORE)}
            {user.loggedIn
             && (user.type === UserType.ADMIN)
             && renderNavTab(NavTab.USER_MANAGEMENT)}
            {user.loggedIn
             && (user.type === UserType.ADMIN)
             && renderNavTab(NavTab.TEAM_MANAGEMENT)}
            {user.loggedIn
             && (user.type === UserType.ADMIN)
             && renderNavTab(NavTab.CHAT)}
        </>
    );

    const renderNavButtons = user => (
        <Menu.Menu position="right">
            {renderAccountButtons(user, false)}
        </Menu.Menu>
    );

    const renderMobileTabs = (visible, user) => (
        <div className={`mobile-tabs ${visible && "mobile-tabs--visible"}`} style={{ top: height }}>
            <div className="tab-row">
                {renderNavTab(NavTab.HOME)}
            </div>
            <div className="tab-row">
                {user.loggedIn
                 && (user.type === UserType.USER || user.type === UserType.MENTOR)
                 && userComps && userComps.length > 0
                 && renderNavTab(NavTab.COMPETITIONS)}
            </div>
            <div className="tab-row">
                {user.loggedIn
                 && (((user.type === UserType.USER
                       || user.type === UserType.MENTOR)
                      && userComps && userComps.length > 0)
                     || user.type === UserType.ADMIN
                     && activeComps)
                 && renderNavTab(NavTab.LEADERBOARD)}
            </div>
            <div className="tab-row">
                {user.loggedIn
                 && (user.type === UserType.USER || user.type === UserType.MENTOR)
                 && renderNavTab(NavTab.CHAT)}
            </div>
            <div className="tab-row">
                {user.loggedIn
                 && (user.type === UserType.USER || user.type === UserType.MENTOR)
                 && userComps && userComps.length > 0
                 && renderNavTab(NavTab.DOWNLOADS)}
            </div>
            <div className="tab-row">
                {user.loggedIn
                 && (user.type === UserType.USER)
                 && renderNavTab(NavTab.STORE)}
            </div>
            <div className="tab-row">
                {user.loggedIn
                 && (user.type === UserType.ADMIN)
                 && renderNavTab(NavTab.USER_MANAGEMENT)}
            </div>
            <div className="tab-row">
                {user.loggedIn
                 && (user.type === UserType.ADMIN)
                 && renderNavTab(NavTab.TEAM_MANAGEMENT)}
            </div>
            <div className="tab-row">
                {user.loggedIn
                 && (user.type === UserType.ADMIN)
                 && renderNavTab(NavTab.CHAT)}
            </div>
        </div>
    );

    const renderMobileNavButtons = user => (
        <Menu.Menu position="right" className="mobile-nav-buttons">
            {renderAccountButtons(user, true)}
        </Menu.Menu>
    );

    const renderMobile = user => (
        <Menu pointing secondary inverted className="navbar navbar--mobile">
            <Button className="nav-button" icon="bars"
                    onClick={() => setMobileTabsVisible(!mobileTabsVisible)}
            />

            {renderMobileTabs(mobileTabsVisible, user)}
            {renderMobileNavButtons(user)}
        </Menu>
    );

    const logo = () => {
        if (process.env.NODE_ENV === "production") {
            return <h1>Space Teams</h1>;
        }
        return <h1>DEMO</h1>;
    };

    const renderDesktop = user => (
        <Menu pointing secondary inverted className="navbar navbar--desktop">
            {renderTabs(user)}
            <Menu.Header className="nav-header">
                {logo()}
            </Menu.Header>
            {renderNavButtons(user)}
        </Menu>
    );

    return (
        <Segment inverted className="nav top-nav" style={{ height }}>

            {renderMobile(user)}
            {renderDesktop(user)}
            {user.loggedIn && (<CompetitionSelection/>)}

        </Segment>
    );
};

export default Navbar;

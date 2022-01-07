/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { NavTab } from "../utils/enums";
import { setActiveNavTab } from "../actions/ui";
import { getUserCompetitions } from "../actions/competitions";
import {
    Container,
    Card,
    List,
    Message,
    Popup,
    Button
} from "semantic-ui-react";
import { getTaggedErrors } from "../selectors/errors";
import { ErrorTag } from "../utils/enums";
import { getApplicationDownloadLink } from "../actions/resources";

const Downloads = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const link = useSelector((state) => state.resources.downloadLink);
    const competitions = useSelector((state) => state.competitions.userComps);
    const loading = useSelector((state) => state.resources.downloadLinkLoading);
    const compsLoading = useSelector((state) => state.competitions.loading);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.DOWNLOAD_LINK));

    React.useEffect(() => {
        dispatch(setActiveNavTab(NavTab.DOWNLOADS));
    }, []);

    React.useEffect(() => {
        if (!compsLoading)
            dispatch(getUserCompetitions());
        if (!loading)
            dispatch(getApplicationDownloadLink());
        // Refresh link before it expires
        const linkExp = 5 * 3600; // 5 mins
        const interval = setInterval(() => dispatch(getApplicationDownloadLink()), linkExp);
        return () => clearInterval(interval);
    }, []);

    const renderContent = () => {
        if (!competitions || !competitions.length) {
            return(
                <p>
                    You must have registered for a competition to download the application.
                </p>
            );
        }
        return (
            <List as="ol">
                <List.Item as="li">
                    Download the application by clicking the 'Download' button below
                </List.Item>
                <List.Item as="li">
                    Unzip the downloaded folder into your 'Documents' or 'Downloads' folder
                </List.Item>
                <List.Item as="li">
                    Run the Prerequisites Installer
                    (SpaceCRAFT/FirstTimeSetup.bat)
                </List.Item>
                <List.Item as="li">
                    Run SpaceCRAFT/SpaceCRAFT.exe
                </List.Item>
                <List.Item as="li">
                    If you get a Windows Defender SmartScreen "Windows protected your PC" popup,
                    click "More Info", then "Run anyway".
                </List.Item>
                <List.Item as="li">
                    If you get a "Windows Firewall has blocked some features of this program"
                    alert for letting SpaceCRAFT's connection to our servers through your firewall,
                    press "Allow access"
                </List.Item>
            </List>
        );
    };

    const handleRegisterClick = () => {
        dispatch(setActiveNavTab(null));
        history.push("/competition-registration");
    };

    const renderButton = () => {
        if (!competitions || !competitions.length) {
            return (
                <Button
                    size="large"
                    content="Register"
                    onClick={handleRegisterClick}
                    primary
                    fluid
                />
            );
        }
        if (process.env.REACT_APP_DOWNLOAD_DISABLED && process.env.REACT_APP_DOWNLOAD_DISABLED !== 0) {
            return (
                <Popup
                    content="This is where you can download the application once the competition has started"
                    position="top center"
                    trigger={
                        <div>
                            <Button
                                size="large"
                                content="Download"
                                as="a"
                                href={link}
                                target="_blank"
                                loading={loading && !link}
                                disabled
                                primary
                                fluid
                            />
                        </div>
										}
                />
            );
        }
        return (
            <Button
                size="large"
                content="Download"
                as="a"
                href={link}
                target="_blank"
                loading={loading && !link}
                primary
                fluid
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
                    <Card.Header>Application Download</Card.Header>
                </Card.Content>
                <Card.Content>
                    <h4 style={{ fontWeight: "normal", fontSize: "1.4rem", marginTop: "1rem" }}>
                        Installation Instructions:
                    </h4>
                    <div style={{ padding: "1rem" }}>
                        {renderContent()}
                    </div>
                    {errors && errors.length && (
                        <Message
                            error
                            header="Error Getting Download Link"
                            content={errors[0].message}
                        />
                    )}
                </Card.Content>
                <Card.Content extra>
                    {renderButton()}
                </Card.Content>
            </Card>
        </Container>
    );
};

export default Downloads;

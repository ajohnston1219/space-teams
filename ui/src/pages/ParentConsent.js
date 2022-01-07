/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import {
    Container,
    Segment,
    Header,
    Divider,
    Message,
    Button
} from "semantic-ui-react";
import { getTaggedErrors } from "../selectors/errors";
import { ErrorTag, ParentConsentStatus } from "../utils/enums";
import {
    getUserDataFromParent,
    submitParentConsent
} from "../actions/user";

const invalidLinkMsg = (
    <>
        Please use the link provided to you in your welcome
        email. If you need help, contact us at
        &nbsp;
        <a href="mailto:support@spacecraft-vr.com?subject=Parent%20Consent%20Link">
            support@spacecraft-vr.com
        </a>
    </>
);

const approveMsg = (studentName) => (
    <>
        {`Thanks for approving registration for ${studentName}. `}
        {`If you have any questions or concerns, please reach out to us at `}
        <a href="mailto:support@spacecraft-vr.com?subject=Parent%20Consent">
            support@spacecraft-vr.com
        </a>
    </>
);

const denyMsg = (studentName) => (
    <>
        {`We've received your request to deny registration for ${studentName}. `}
        {`You can change this decision at any time by using the same link. `}
        {`If you have any questions or concerns, please reach out to us at `}
        <a href="mailto:support@spacecraft-vr.com?subject=Parent%20Consent">
            support@spacecraft-vr.com
        </a>
    </>
);

const ParentConsent = () => {

    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();

    const hash = new URLSearchParams(location.search).get("hash");
    const userId = new URLSearchParams(location.search).get("user_id");

    const loading = useSelector((state) => state.user.loading);
    const parentConsentLoading = useSelector((state) => state.user.parentConsentLoading);
    const userParentData = useSelector((state) => state.user.userParentData);
    const consentStatus = useSelector((state) => state.user.parentConsentStatus);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.USER));
    const submitErrors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.PARENT_CONSENT));

    React.useEffect(() => {
        if (userId && hash)
            dispatch(getUserDataFromParent(userId, hash));
    }, []);

    const handleApprove = () => {
        dispatch(submitParentConsent(userId, hash, ParentConsentStatus.APPROVED, history));
    };

    const handleDeny = () => {
        dispatch(submitParentConsent(userId, hash, ParentConsentStatus.DENIED, history));
    };

    const renderContent = () => {
        if (!hash || !userId) {
            return (
                <Message
                    header="Invalid Link"
                    content={invalidLinkMsg}
                    error
                />
            );
        }
        if (loading) {
            return "Loading...";
        }
        if (errors && errors.length) {
            return (
                <Message
                    header="Error"
                    content={errors[0].message || "Unknown Error"}
                    error
                />
            );
        }
        if (submitErrors && submitErrors.length) {
            return (
                <>
                    <Message
                        header="Consent Submission Error"
                        content={submitErrors[0].message || "Unknown Error"}
                        error
                    />
                    <Divider style={{ marginBottom: "2rem" }}/>
                    <Button
                        size="huge"
                        content="Try Again"
                        onClick={() => history.go(0)}
                        primary
                    />
                </>
            );
        }
        if (consentStatus) {
            const studentName =
                  userParentData.studentFirstName + " " + userParentData.studentLastName;
            const consentMsg = consentStatus === ParentConsentStatus.APPROVED
                  ? approveMsg(studentName)
                  : denyMsg(studentName);
            return (
                <>
                    <h3>Thank You!</h3>
                    <p style={{ fontSize: "1.2rem" }}>
                        {consentMsg}
                    </p>
                </>
            );
        }
        
        return (
            <>
                <h3>{userParentData && (userParentData.studentFirstName + " " + userParentData.studentLastName)}</h3>
                <p style={{ fontSize: "1.2rem" }}>
                    The student named above has been registered to participate in a virtual Space STEM program and requires approval from their parent or guardian.
                    Please use the buttons below to approve or deny their participation. 
                </p>
                <Divider style={{ marginBottom: "2rem" }}/>
                <Button.Group
                    size="huge"
                    style={{ width: "100%" }}
                >
                    <Button
                        onClick={handleApprove}
                        loading={parentConsentLoading}
                        primary
                    >
                        Approve
                    </Button>
                    <Button.Or/>
                    <Button
                        onClick={handleDeny}
                        loading={parentConsentLoading}
                        primary
                    >
                        Deny
                    </Button>
                </Button.Group>
                <Divider style={{ marginBottom: "2rem" }}/>
                <p>
                    If you have any questions about our privacy policy, the following links define exactly how we use personal information.
                    In short, we will not share this information in any form, and will only use it for the purposes of this program. 
                </p>
                <div style={{ textAlign: "center" }}>
                    <a
                        href="https://www.space-teams.com/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Privacy Policy
                    </a>
                    <br/>
                    <a
                        href="https://www.space-teams.com/terms-of-use"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Terms and Conditions
                    </a>
                </div>
            </>
        );
    };
    
    return (
        <Segment>
            <Container style={{ padding: "2rem 1rem" }}>
                <Header size="huge">Space Teams Parent Consent</Header>
                <Divider style={{ marginBottom: "2rem" }}/>
                {renderContent()}
            </Container>
        </Segment>
    );
};

export default ParentConsent;

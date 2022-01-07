/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
    Segment,
    Container,
    Header,
    Divider,
    Button,
    Dropdown,
    Message,
    List,
    Item,
    Form
} from "semantic-ui-react";
import { useHistory, useLocation } from "react-router-dom";
import CompetitionPaymentForm from "../components/CompetitionPaymentForm";
import {
    getCompetitionPrice,
    clearReceipt,
} from "../actions/billing";
import { openBulkPaymentConfirmationModal } from "../actions/ui";
import { getOrgName } from "../actions/organization";
import { getAllActiveCompetitions } from "../actions/competitions";
import { getTaggedErrors } from "../selectors/errors";
import { getFormError, getFieldError } from "../utils/formErrors";
import { ErrorTag } from "../utils/enums";

const CompetitionBulkPay = () => {

    let err;

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const competitionId = new URLSearchParams(location.search).get("competition_id");
    const orgId = new URLSearchParams(location.search).get("organization_id");

    const billing = useSelector((state) => state.billing);
    const competitions = useSelector((state) => state.competitions);
    const org = useSelector((state) => state.organization.org);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.PAYMENT));

    const [paymentInfo, setPaymentInfo] = React.useState({
        firstName: "",
        lastName: "",
        cardNumber: "",
        expiration: "",
        code: "",
        address: "",
        country: "",
        city: "",
        stateOrProvince: "",
        zipCode: "",
    });

    const [selectedComp, setSelectedComp] = React.useState(competitionId);
    const [compLoading, setCompLoading] = React.useState(true);
    const [numStudents, setNumStudents] = React.useState(0);

    React.useEffect(() => {
        dispatch(getOrgName(orgId));
    }, [orgId]);

    React.useEffect(() => {
        dispatch(getAllActiveCompetitions());
    }, []);

    React.useEffect(() => {
        if (selectedComp)
            dispatch(getCompetitionPrice(selectedComp));
    }, [selectedComp]);

    setTimeout(() => setCompLoading(false), 1000);

    const compOptions = competitions.activeComps.map(c => ({
        key: c.id,
        text: c.name,
        value: c.id
    }));

    const handleRegistration = () => {
        const comp = competitions.activeComps.find(c => c.id === selectedComp);
        dispatch(openBulkPaymentConfirmationModal(
            comp, orgId, numStudents, billing.competitionPrice, paymentInfo
        ));
    };

    const renderContent = () => {

        if (compLoading || competitions.loading) {
            return "Loading...";
        }

        if (!orgId) {
            return (
                <p>
                    This link is not a valid bulk payment link. Check your
                    email for a valid link, or contact us at
                    &nbsp;
                    <a href="mailto:support@spacecraft-vr.com?subject=Request%20Organization%20Payment%20Link">
                        support@spacecraft-vr.com
                    </a>
                    &nbsp;
                    to get a new link
                </p>
            );
        }

        if (billing.receipt && billing.receipt.approved) {
            const { invoiceId, transactionId, totalPaid } = billing.receipt;
            const price = parseFloat(billing.competitionPrice).toFixed(2).toString();
            return (
                <Item>
                    <Item.Content>
                        <Item.Header>Registration and Payment Complete</Item.Header>
                        <List>
                            <List.Item>
                                <Item.Content>
                                    <div>
                                        <List.Header style={{ display: "inline" }}>
                                            {"Transaction ID: "}
                                        </List.Header>{transactionId}
                                    </div>
                                    <div>
                                        <List.Header style={{ display: "inline" }}>
                                            {"Invoice ID: "}
                                        </List.Header>{invoiceId}
                                    </div>
                                    <div>
                                        <List.Header style={{ display: "inline" }}>
                                            {"Price per Student: "}
                                        </List.Header>{"$" + price + " (USD)"}
                                    </div>
                                    <div>
                                        <List.Header style={{ display: "inline" }}>
                                            {"Total Paid: "}
                                        </List.Header>{"$" + totalPaid + " (USD)"}
                                    </div>
                                </Item.Content>
                            </List.Item>
                        </List>
                        <Item.Extra>Thank you for registering your organization. Check your email for next steps to sign up individual students.</Item.Extra>
                    </Item.Content>
                    <Divider style={{ marginTop: "2rem" }}/>
                    <Button
                        size="huge"
                        fluid
                        primary
                        onClick={() => {
                            history.push("/");
                            dispatch(clearReceipt());
                        }}
                    >
                        Done
                    </Button>
                </Item>
            );
        }
        if (selectedComp) {
            let priceText;
            if (billing.competitionPrice) {
                priceText = "$" + billing.competitionPrice + " (USD)";
            } else if (billing.priceLoading) {
                priceText = "Loading...";
            } else {
                priceText = "Error. Please refresh your browser. If the problem persists, " +
                    "click the 'Help' button to the right to contact support.";
            }

            const compInfo = competitions.activeComps.find(c => c.id === selectedComp);

            // NOTE: Happens when the URL param 'competition_id' is invalid
            if (!compInfo) {
                return (
                    <>
                        <Message error>
                            {`Competition with ID ${selectedComp} not found. If you think ` +
                             `this is a mistake, contact the person who gave you this link. ` +
                             `Otherwise, click the button below to select the competition manually.`}
                        </Message>
                        <Divider style={{ marginTop: "2rem" }}/>
                        <Button
                            primary
                            fluid
                            size="huge"
                            onClick={() => {
                                setSelectedComp(null);
                                history.push("/competition-bulk-payment");
                            }}
                        >
                            Select Different Competition
                        </Button>
                    </>
                );
            }

            const startDateStr = moment(compInfo.startDate).utc().format("M-D-YY");
            const endDateStr = moment(compInfo.endDate).utc().format("M-D-YY");

            const getTotalPrice = () => {
                const num = parseInt(numStudents);
                if (Number.isNaN(num)) {
                    return "Please enter a valid number for 'Number of Students' below";
                };
                return "$" + parseFloat(num * billing.competitionPrice).toFixed(2).toString() + " USD";
            };

            return (
                <>
                    <Item>
                        <Item.Content>
                            <Item.Header as="h2">
                                {compInfo.name}
                            </Item.Header>
                            <Item.Description style={{ color: "black" }}>
                                <p>{`Price per Student: ${priceText}`}</p>
                            </Item.Description>
                            <Item.Description style={{ color: "black" }}>
                                <p>{`Total price: ${getTotalPrice()}`}</p>
                            </Item.Description>
                            <Item.Description style={{ color: "black" }}>
                                <p>{`Start Date: ${startDateStr}`}</p>
                            </Item.Description>
                            <Item.Description style={{ color: "black" }}>
                                <p>{`End Date: ${endDateStr}`}</p>
                            </Item.Description>
                            <Button
                                as="a"
                                href="https://space-teams.com" target="_blank"
                                content="More Info"
                                primary
                            />
                            <Button
                                as="a"
                                style={{ cursor: "pointer", marginTop: "1rem" }}
                                onClick={() => setSelectedComp(null)}
                                content="Select Different Competition"
                                primary
                            />
                            <Divider style={{ marginTop: "2rem" }}/>
                            <Form>
                                <Form.Input
                                    type="number"
                                    label="Number of Students"
                                    placeholder="Number of Students"
                                    value={numStudents}
                                    onChange={({ target: { value } }) => setNumStudents(value)}
                                    error={(err = getFieldError("numStudents", errors)) && {
                                        content: err,
                                        pointing: "below"
                                    }}
                                />
                            </Form>
                        </Item.Content>
                    </Item>
                    <Divider style={{ marginTop: "2rem" }}/>
                    <CompetitionPaymentForm
                        formState={paymentInfo}
                        setFormState={setPaymentInfo}
                        errors={errors}
                        loading={billing.paymentLoading}
                    />
                    <Divider style={{ marginTop: "2rem" }}/>
                    {!!getFormError(errors) && (
                        <Message
                            error
                            header="Payment"
                            content={errors[0].message || "Unknown error"}
                        />
                    )}
                    <Button
                        primary
                        fluid
                        size="huge"
                        onClick={handleRegistration}
                        loading={billing.paymentLoading}
                    >
                        Complete Registration
                    </Button>
                </>
            );
        }
        return (
            <Dropdown
                selection
                search
                fluid
                placeholder="Select Competition"
                value={selectedComp}
                onChange={(e, { value }) => setSelectedComp(value)}
                options={compOptions}
            />
        );
    };

    return (
        <Segment className="form-background">
            <Container style={{ padding: "2rem 1rem" }}>
                <Header size="huge">{`${(org && org.name) || ""} Competition Registration`}</Header>
                <Divider style={{ marginBottom: "2rem" }}/>
                {renderContent()}
            </Container>
        </Segment>
    );
};

export default CompetitionBulkPay;

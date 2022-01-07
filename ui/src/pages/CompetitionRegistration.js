/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
    Segment,
    Container,
    Form,
    Input,
    Header,
    Divider,
    Button,
    Dropdown,
    Message,
    List,
    Item
} from "semantic-ui-react";
import { useHistory, useLocation } from "react-router-dom";
import CompetitionPaymentForm from "../components/CompetitionPaymentForm";
import {
    getCompetitionPrice,
    clearReceipt
} from "../actions/billing";
import { openPaymentConfirmationModal } from "../actions/ui";
import { getTaggedErrors } from "../selectors/errors";
import { getFieldError, getFormError } from "../utils/formErrors";
import { ErrorTag } from "../utils/enums";

const CompetitionRegistration = () => {

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const billing = useSelector((state) => state.billing);
    const competitions = useSelector((state) => state.competitions);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.PAYMENT));

    let err;

    let competitionId = user.desiredCompetitionId;
    if (!competitionId) {
        competitionId = localStorage.getItem("competition_id");
        if (!competitionId) {
            competitionId = new URLSearchParams(location.search).get("competition_id");
            if (competitionId)
                localStorage.setItem("competition_id", competitionId);
        }
    }

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
    const [discountCodeText, setDiscountCodeText] = React.useState("");
    const [discountCode, setDiscountCode] = React.useState(null);

    React.useEffect(() => {
        if (selectedComp)
            dispatch(getCompetitionPrice(selectedComp, discountCode));
    }, [selectedComp, discountCode]);

    React.useEffect(() => {
        if (!user.loggedIn && !user.loading) {
            history.push("/signup");
        }
        return () => dispatch(clearReceipt());
    }, []);

    setTimeout(() => setCompLoading(false), 1000);

    const availableComps = competitions.activeComps
          .filter(c => !competitions.userComps.some(uc => uc.id === c.id));
    const compOptions = availableComps.map(c => ({
        key: c.id,
        text: c.name,
        value: c.id
    }));

    const handleRegistration = () => {
        const comp = availableComps.find(c => c.id === selectedComp);
        dispatch(openPaymentConfirmationModal(
            comp, billing.competitionPrice, paymentInfo, discountCode
        ));
    };

    const renderContent = () => {

        if (compLoading || competitions.loading) {
            return "Loading...";
        }

        if (billing.receipt && billing.receipt.approved) {
            const { invoiceId, transactionId } = billing.receipt;
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
                                            {"Total Paid: "}
                                        </List.Header>{"$" + billing.competitionPrice + " (USD)"}
                                    </div>
                                </Item.Content>
                            </List.Item>
                        </List>
                        <Item.Extra>You will also receive an email with this information.</Item.Extra>
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

            const compInfo = availableComps.find(c => c.id === selectedComp);

            // NOTE: Happens when logged in user is already registered for competition
            //       in URL param 'competition_id', or the competition ID is invalid
            if (!compInfo) {
                const userCompInfo = competitions.userComps.find(c => c.id === selectedComp);
                if (!userCompInfo) {
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
                                    history.push("/competition-registration");
                                }}
                            >
                                Select Different Competition
                            </Button>
                        </>
                    );
                }
                return (
                    <>
                        <Message>
                            {`You are already registered for the ${userCompInfo.name} competition.`}
                        </Message>
                        <Divider style={{ marginTop: "2rem" }}/>
                        <Button
                            primary
                            fluid
                            size="huge"
                            onClick={() => history.push("/")}
                        >
                            Homepage
                        </Button>
                    </>
                );
            }

            const startDateStr = moment(compInfo.startDate).utc().format("M-D-YY");
            const endDateStr = moment(compInfo.endDate).utc().format("M-D-YY");

            return (
                <>
                    <Item>
                        <Item.Content>
                            <Item.Header as="h2">
                                {compInfo.name}
                            </Item.Header>
                            <Item.Description style={{ color: "black" }}>
                                <p>{`Price: ${priceText}`}</p>
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
                        </Item.Content>
                    </Item>
                    <Divider style={{ marginTop: "2rem" }}/>
                    <Form>
                        <Form.Field inline>
                            <label>Code</label>
                            <Input
                                placeholder="Code (optional)"
                                value={discountCodeText}
                                onChange={({ target: { value } }) => setDiscountCodeText(value)}
                                error={(err = getFieldError("discountCode", errors)) && {
                                    content: err,
                                    pointing: "below"
                                }}
                            />
                            <Button
                                primary
                                content="Apply"
                                loading={billing.priceLoading}
                                onClick={() => setDiscountCode(discountCodeText)}
                                style={{
                                    position: "relative",
                                    left: "5px",
                                    top: "2px"
                                }}
                            />
                        </Form.Field>
                    </Form>
                    <Divider style={{ marginTop: "2rem" }}/>
                    <CompetitionPaymentForm
                        user={user}
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
                        Register
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
                <Header size="huge">Competition Registration</Header>
                <Divider style={{ marginBottom: "2rem" }}/>
                {renderContent()}
            </Container>
        </Segment>
    );
};

export default CompetitionRegistration;

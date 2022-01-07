import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Modal,
    Checkbox,
    List,
    Button
} from "semantic-ui-react";
import {
    closePaymentConfirmationModal
} from "../actions/ui";
import { submitCompetitionPayment } from "../actions/billing";

const PaymentConfirmationModal = () => {

    const dispatch = useDispatch();

    const open = useSelector((state) => state.ui.paymentConfirmationModalOpen);
    const competitionPaymentInfo = useSelector((state) => state.billing.competitionPaymentInfo);

    const [hasCompRequirements, setHasCompRequirements] = React.useState(false);
    const [agreeToTnC, setAgreeToTnC] = React.useState(false);

    if (!competitionPaymentInfo)
        return <div/>;

    const { comp, price, paymentInfo, discountCode } = competitionPaymentInfo;

    const header = "Pay $" + price + " (USD) to register for competition?";
    let message = `By clicking yes, you agree to pay $${price} (USD) ` +
          `to register for the ${comp.name}`;
    const compNameExpr = /competition/i;
    if (compNameExpr.test(comp.name)) {
        message += ".";
    } else {
        message += " competition.";
    }
    const handleConfirm = () => {
        dispatch(submitCompetitionPayment(comp.id, paymentInfo, discountCode));
        setHasCompRequirements(false);
        setAgreeToTnC(false);
        dispatch(closePaymentConfirmationModal());
    };

    const compRequirements = (
        <List>
            <List.Item>
                A CPU with at least 4 cores / 2.7 GHz
            </List.Item>
            <List.Item>
                At least 6 GB RAM
            </List.Item>
            <List.Item>
                15 GB available on hard drive
            </List.Item>
            <List.Item>
                Windows 10
            </List.Item>
            <List.Item>
                GPU is recommended
            </List.Item>
        </List>
    );

    return (
        <Modal
            open={open}
            onClose={() => dispatch(closePaymentConfirmationModal())}
        >
            <Modal.Header>{header}</Modal.Header>
            <Modal.Content>
                <p>{message}</p>
                <p>
                    Computer Requirements:
                </p>
                {compRequirements}
                <div>
                    <Checkbox
                        label="I have access to a computer with the above minimum requirements"
                        onChange={() => setHasCompRequirements(!hasCompRequirements)}
                        checked={hasCompRequirements}
                    />
                </div>
                <div>
                    <Checkbox
                        label="I agree to the Terms and Conditions"
                        onChange={() => setAgreeToTnC(!agreeToTnC)}
                        checked={agreeToTnC}
                    />
                    <a
                        href="https://www.space-teams.com/terms-of-use"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "block", marginTop: "1rem" }}
                    >
                        Terms and Conditions
                    </a>
                </div>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    content="Cancel"
                    onClick={() => dispatch(closePaymentConfirmationModal())}
                />
                <Button
                    onClick={handleConfirm}
                    content="Yes"
                    disabled={!hasCompRequirements || !agreeToTnC}
                    primary
                />
            </Modal.Actions>
        </Modal>
    );
}

export default PaymentConfirmationModal;

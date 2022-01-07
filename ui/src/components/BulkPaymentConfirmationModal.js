/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Modal,
    Checkbox,
    List,
    Button
} from "semantic-ui-react";
import {
    closeBulkPaymentConfirmationModal
} from "../actions/ui";
import { submitBulkCompetitionPayment } from "../actions/billing";

const BulkPaymentConfirmationModal = ({
    info
}) => {

    const dispatch = useDispatch();

    const open = useSelector((state) => state.ui.bulkPaymentConfirmationModalOpen);
    const competitionPaymentInfo = useSelector((state) => state.billing.competitionPaymentInfo);
    const orgId = useSelector((state) => state.billing.orgInfo.id);
    const numStudents = useSelector((state) => state.billing.orgInfo.numStudents);

    const [agreeToTnC, setAgreeToTnC] = React.useState(false);

    if (!competitionPaymentInfo)
        return <div/>;

    const { comp, price, paymentInfo } = competitionPaymentInfo;

    const totalPrice = (price * numStudents).toFixed(2).toString();
    const header = "Pay $" + totalPrice + " (USD) to register " +
          numStudents + " students for competition?";
    let message = `By clicking yes, you agree to pay $${totalPrice} (USD) ` +
          `to register ${numStudents} students for the ${comp.name}`;
    const compNameExpr = /competition/i;
    if (compNameExpr.test(comp.name)) {
        message += ".";
    } else {
        message += " competition.";
    }
    const handleConfirm = () => {
        dispatch(submitBulkCompetitionPayment(comp.id, orgId, numStudents, paymentInfo));
        dispatch(closeBulkPaymentConfirmationModal());
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

    const renderContent = () => {
        if (Number.isNaN(numStudents) || numStudents <= 0) {
            return (
                <>
                    <Modal.Header>Invalid Number of Students</Modal.Header>
                    <Modal.Content>
                        <p>Please enter a valid number of students</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            content="Okay"
                            onClick={() => dispatch(closeBulkPaymentConfirmationModal())}
                        />
                    </Modal.Actions>
                </>
            );
        }
        return (
            <>
                <Modal.Header>{header}</Modal.Header>
                <Modal.Content>
                    <p>{message}</p>
                    <p>
                        Computer Requirements:
                    </p>
                    {compRequirements}
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
                        onClick={() => dispatch(closeBulkPaymentConfirmationModal())}
                    />
                    <Button
                        onClick={handleConfirm}
                        content="Yes"
                        disabled={!agreeToTnC}
                        primary
                    />
                </Modal.Actions>
            </>
        );
    };

    return (
        <Modal
            open={open}
            onClose={() => dispatch(closeBulkPaymentConfirmationModal())}
        >
            {renderContent()}
        </Modal>
    );
}

export default BulkPaymentConfirmationModal;

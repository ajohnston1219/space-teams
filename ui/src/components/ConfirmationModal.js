import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Confirm, Modal } from "semantic-ui-react";
import { closeConfirmation } from "../actions/ui";

const ConfirmationModal = () => {

    const dispatch = useDispatch();

    const confirmation = useSelector((state) => state.ui.confirmation);
    const open = useSelector((state) => state.ui.confirmationOpen);

    const handleConfirm = () => {
        confirmation.onConfirm();
        dispatch(closeConfirmation());
    };

    const handleCancel = () => {
        if (confirmation.onCancel)
            confirmation.onCancel();
        if (!confirmation.newModalOnCancel)
            dispatch(closeConfirmation());
    };

    if (confirmation.okayOnly) {
        return (
            <Modal
                open={open}
                header={confirmation.header}
                content={confirmation.message}
                actions={["OK"]}
                onActionClick={handleConfirm}
            />
        );
    }

    return (
        <Confirm
          open={open}
          header={confirmation.header || "Confirmation"}
          content={confirmation.message || "Are you sure?"}
          confirmButton={confirmation.confirmText || "Yes"}
          cancelButton={confirmation.cancelText || "No"}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
    );
}

export default ConfirmationModal;

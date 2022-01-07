import React from "react";
import { useSelector } from "react-redux";
import {
    Portal,
    Message
} from "semantic-ui-react";
import { AlertType } from "../utils/enums";

const AlertModal = () => {

    const alert = useSelector((state) => state.ui.alert);
    const open = useSelector((state) => state.ui.alertOpen);

    if (alert) {
        return (
            <Portal
              open={open}
            >
              <Message
                positive={alert.type === AlertType.SUCCESS}
                warning={alert.type === AlertType.WARNING}
                negative={alert.type === AlertType.ERROR}
                style={{
                    position: "fixed",
                    top: "99vh",
                    left: "49vw",
                    transform: "translateY(-130%)",
                    width: "50vw",
                    zIndex: 10000
                }}
              >
                <Message.Header>{alert.header}</Message.Header>
                <p>{alert.message}</p>
              </Message>
            </Portal>
        );
    }
    return <React.Fragment/>;
};

export default AlertModal;

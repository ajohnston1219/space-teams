import React from "react";
import { Modal } from "semantic-ui-react";
import LoginForm from "../components/LoginForm";

const LoginModal = ({
  open,
  onOpen,
  onClose,
  trigger
}) => (
  <Modal
    open={open}
    onOpen={onOpen}
    onClose={onClose}
    trigger={trigger}
    className="login-modal"
  >
    <Modal.Header>Login or Sign Up</Modal.Header>
    <Modal.Content>
      <LoginForm/>
    </Modal.Content>
  </Modal>
);

export default LoginModal;

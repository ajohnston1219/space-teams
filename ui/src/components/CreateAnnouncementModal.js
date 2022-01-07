import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "semantic-ui-react";
import CreateAnnouncementForm from "./CreateAnnouncementForm";
import { openAddAnnouncementModal, closeAddAnnouncementModal } from "../actions/ui";
import { setAnnouncementToAdd, postAnnouncement } from "../actions/messages";

const CreateAnnouncementModal = () => {

    const dispatch = useDispatch();

    const open = useSelector((state) => state.ui.addAnnouncementModalOpen);
    const announcementToAdd = useSelector((state) => state.messages.announcementToAdd);
    const loading = useSelector((state) => state.messages.announcements.loading);

    const setFormState = fn => dispatch(setAnnouncementToAdd(fn(announcementToAdd)));

    return (

        <Modal
            open={open}
            onOpen={() => dispatch(openAddAnnouncementModal())}
            onClose={() => dispatch(closeAddAnnouncementModal())}
        >
            <Modal.Header>Add Announcement</Modal.Header>
            <Modal.Content>
                <CreateAnnouncementForm
                    formState={announcementToAdd}
                    setFormState={setFormState}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button
                    icon="close" content="Cancel"
                    onClick={() => dispatch(closeAddAnnouncementModal())}
                />
                <Button
                    primary icon="add" content="Create"
                    onClick={() => dispatch(postAnnouncement(announcementToAdd))}
                    loading={loading}
                />
            </Modal.Actions>
        </Modal>
    );
};

export default CreateAnnouncementModal;

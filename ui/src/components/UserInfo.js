import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Card, Item, Button, Form, Loader } from "semantic-ui-react";
import { getFieldError, getFormError } from "../utils/formErrors";
import { getTaggedErrors } from "../selectors/errors";
import { ErrorTag } from "../utils/enums";
import { updateUser, userUpdateEditing, sendPasswordResetLink } from "../actions/user";
import { clearErrors } from "../actions/errors";
import { PARENT_CONSENT_AGE } from "../utils/constants";

const InfoItem = ({
    header,
    value,
    onEditClick,
    onCloseEditClick,
    onSaveClick,
    saveLoading,
    isEditing,
    error
}) => {

    const [formState, setFormState] = React.useState(value);

    if (isEditing) {
        return (
            <Item>
                <Item.Content>
                    <Item.Header>{header}</Item.Header>
                    <Form>
                        <Form.Input
                            placeholder={header}
                            value={formState}
                            onChange={({ target: { value } }) => setFormState(value)}
                            error={error && {
                                content: error,
                                pointing: "below"
                            }}
                        />
                    </Form>
                    <Item.Extra>
                        <Button.Group>
                            <Button
                                icon="close" content="Cancel"
                                onClick={onCloseEditClick}
                            />
                            <Button
                                icon="save" content="Save" primary
                                onClick={() => onSaveClick(formState)}
                            />
                        </Button.Group>
                    </Item.Extra>
                </Item.Content>
            </Item>
        );
    }

    return (
        <Item>
            <Item.Content>
                <Item.Header>{header}</Item.Header>
                <Item.Description>{value}</Item.Description>
            </Item.Content>
            <Item.Content>
                <Item.Content>
                    <Button
                        icon="pencil" floated="right"
                        onClick={onEditClick}
                    />
                </Item.Content>
            </Item.Content>
        </Item>
    );
};

const passwordReset = (user, sendPasswordResetLink, loading) => (
    <Item>
        <Item.Content>
            <Item.Header>Reset Password</Item.Header>
            <Item.Description style={{ marginRight: 5 }}>
                Click the button to have a password reset link sent to your email.
            </Item.Description>
        </Item.Content>
        <Item.Content>
            <Item.Content>
                <Button
                    icon="mail" floated="right"
                    onClick={() => sendPasswordResetLink(user)}
                    loading={loading}
                />
            </Item.Content>
        </Item.Content>
    </Item>
);

const UserInfo = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const user = useSelector((state) => ({
        id: state.user.id,
        username: state.user.username,
        email: state.user.email,
        age: state.user.age,
        parent: state.user.parent
    }));
    const loading = useSelector((state) => state.user.loading);
    const updateLoading = useSelector((state) => state.user.updateLoading);
    const isEditing = useSelector((state) => state.user.updateEditing);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.USER_UPDATE));

    const handleEditClick = (field, isEditing) => {
        dispatch(clearErrors(ErrorTag.USER_UPDATE));
        dispatch(userUpdateEditing({ [field]: isEditing }));
    }

    const handleSaveClick = (field, value) => {
        dispatch(updateUser(field, value));
    };

    const renderParentUpdate = () => {
        if (user && user.age < PARENT_CONSENT_AGE && user.parent) {
            return (
                <Item>
                    <Item.Content>
                        <Item.Header>Parent Info</Item.Header>
                        <Item.Description>Update parent contact info</Item.Description>
                    </Item.Content>
                    <Item.Content>
                        <Item.Content>
                            <Button
                                icon="pencil" floated="right"
                                onClick={() => history.push("/update-parent-info")}
                            />
                        </Item.Content>
                    </Item.Content>
                </Item>
            );
        }
        return null;
    };

    return (
        <Card centered fluid style={{ maxWidth: "40rem" }}>
            <Card.Content>
                <Card.Header>My Info</Card.Header>
            </Card.Content>
            <Card.Content>
                {loading
                 ? (
                     <Loader active/>
                 ): (
                     <Card.Description>
                         <Item.Group divided>
                             <InfoItem
                                 header="Username"
                                 value={user.username}
                                 isEditing={isEditing.username}
                                 onEditClick={() => handleEditClick("username", true)}
                                 onCloseEditClick={() => handleEditClick("username", false)}
                                 onSaveClick={value => handleSaveClick("username", value)}
                                 loading={updateLoading.username}
                                 error={getFieldError("username", errors) || getFormError(errors)}
                             />
                             <InfoItem
                                 header="Email"
                                 value={user.email}
                                 isEditing={isEditing.email}
                                 onEditClick={() => handleEditClick("email", true)}
                                 onCloseEditClick={() => handleEditClick("email", false)}
                                 onSaveClick={value => handleSaveClick("email", value)}
                                 loading={updateLoading.email}
                                 error={getFieldError("email", errors) || getFormError(errors)}
                             />
                             {passwordReset(
                                 user.email,
                                 () => dispatch(sendPasswordResetLink()),
                                 updateLoading.password
                             )}
                             {renderParentUpdate()}
                         </Item.Group>
                     </Card.Description>
                 )}
            </Card.Content>
        </Card>
    );
};

export default UserInfo;

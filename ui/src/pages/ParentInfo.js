/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
    Container,
    Segment,
    Header,
    Divider,
    Loader,
    Button
} from "semantic-ui-react";
import { ErrorTag } from "../utils/enums";
import { getTaggedErrors } from "../selectors/errors";
import {
    getParentData,
    submitParentInfo,
    updateParentInfo
} from "../actions/user";
import ParentInfoForm from "../components/ParentInfoForm";

const ParentInfo = () => {

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.PARENT_INFO));

    const isUpdating = location.pathname === "/update-parent-info";
    const competitionId = new URLSearchParams(location.search).get("competition_id");

    const [formState, setFormState] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
    });

    React.useEffect(() => {
        if (!user.loggedIn && !user.loading) {
            let nextUrl = "/signup";
            if (competitionId) {
                nextUrl += "?competition_id=" + encodeURIComponent(competitionId);
            }
            history.push(nextUrl);
            return;
        }
        if (isUpdating) {
            dispatch(getParentData());
        }
    }, []);

    React.useEffect(() => {
        if (user.parent) {
            setFormState({
                firstName: user.parent.firstName,
                lastName: user.parent.lastName,
                email: user.parent.email,
                phoneNumber: user.parent.phoneNumber
            });
        }
    }, [user.parent]);

    const handleSubmit = (data) => {
        if (isUpdating) {
            dispatch(updateParentInfo(data, history));
        } else {
            dispatch(submitParentInfo(data, history));
        }
    };

    return (
        <Segment className="form-background">
            <Container style={{ padding: "2rem 1rem" }}>
                <Header size="huge">Parent Information</Header>
                <Divider style={{ marginBottom: "2rem" }}/>
                {user.parentInfoLoading
                 ? (
                     <Loader/>
                 ) : (
                     <ParentInfoForm
                         formState={formState}
                         setFormState={setFormState}
                         errors={errors}
                     />
                 )}
                <Divider style={{ marginTop: "2rem" }}/>
                <Button
                    primary
                    fluid
                    size="huge"
                    content={isUpdating ? "Update" : "Submit"}
                    loading={user.submitParentLoading || user.parentInfoLoading}
                    onClick={() => handleSubmit(formState)}
                />
            </Container>
        </Segment>
    );
};

export default ParentInfo;

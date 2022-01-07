/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ErrorTag } from "../utils/enums";
import { getFieldError, getFormError } from "../utils/formErrors";
import { getTaggedErrors } from "../selectors/errors";
import {
    Message,
    Form,
    Dropdown
} from "semantic-ui-react";
import DatePicker from "react-semantic-ui-datepickers";
import countries from "../utils/countries";
import states from "../utils/us-states";
import { getSchoolsAndOrgs, addSchoolOrOrg } from "../actions/user";

const AccountInfoForm = ({
    formState,
    setFormState
}) => {

    const dispatch = useDispatch();
    
    const loading = useSelector((state) => state.user.loading);
    const schoolsAndOrgs = useSelector((state) => state.user.schoolsAndOrgs.list);
    const schoolsAndOrgsLoading = useSelector((state) => state.user.schoolsAndOrgs.loading);
    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.ACCOUNT_INFO));

    React.useEffect(() => {
        dispatch(getSchoolsAndOrgs());
    }, []);

    const countryOpts = countries.map(c => ({ key: c.name, text: c.name, value: c.name }));

    const schoolsAndOrgsOpts = schoolsAndOrgs.map(so => ({ key: so, text: so, value: so }));

    let err;

    return (

        <Form error={!!getFormError(errors)} loading={loading}>

            <Form.Input
                label="First Name*"
                placeholder="First Name"
                value={formState.firstName}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, firstName: value }))}
                error={(err = getFieldError("firstName", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Input
                label="Last Name*"
                placeholder="Last Name"
                value={formState.lastName}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, lastName: value }))}
                error={(err = getFieldError("lastName", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Field
                error={(err = getFieldError("dateOfBirth", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            >
                <label>Date of Birth*</label>
                <DatePicker
                    onChange={
                        (e, data) => setFormState(s => ({ ...s, dateOfBirth: data.value }))
                    }
                    value={formState.dateOfBirth}
                    showToday={false}
                    format="MM/DD/YYYY"
                />
                {(err = getFieldError("dateOfBirth", errors)) && (
                    <Message
                        style={{ display: "block" }}
                        error
                        content={err}
                    />
                )}
            </Form.Field>
            <Form.Input
                label="Address"
                placeholder="Address"
                value={formState.address}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, address: value }))}
                error={(err = getFieldError("address", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Field>
                <label>Country*</label>
                <Dropdown
                    selection
                    search
                    placeholder="Select Country"
                    value={formState.country}
                    onChange={(e, { value }) => setFormState(s => ({ ...s, country: value }))}
                    options={countryOpts}
                    error={(err = getFieldError("country", errors)) && {
                        content: err,
                        pointing: "below"
                    }}
                />
            </Form.Field>
            <Form.Input
                label="City*"
                placeholder="City"
                value={formState.city}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, city: value }))}
                error={(err = getFieldError("city", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            {formState.country === "United States of America" && (
                <Form.Field>
                    <label>State</label>
                    <Dropdown
                        selection
                        search
                        placeholder="Select State"
                        value={formState.state}
                        onChange={(e, { value }) => setFormState(s => ({ ...s, stateOrProvince: value }))}
                        options={states.map(s => ({ key: s.value, text: s.name, value: s.value }))}
                        error={(err = getFieldError("stateOrProvince", errors)) && {
                            content: err,
                            pointing: "below"
                        }}
                    />
                </Form.Field>
            )}
            <Form.Input
                label="Zip Code"
                placeholder="Zip Code"
                value={formState.zipCode}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, zipCode: value }))}
                error={(err = getFieldError("zipCode", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Field>
                <label>School or Organization</label>
                <Dropdown
                    selection
                    search
                    allowAdditions
                    loading={schoolsAndOrgsLoading}
                    placeholder="School or Organization"
                    noResultsMessage="Enter a your School or Organization"
                    value={formState.state}
                    onChange={(e, { value }) => setFormState(s => ({ ...s, schoolOrOrganization: value }))}
                    onAddItem={(e, { value }) => dispatch(addSchoolOrOrg(value))}
                    options={schoolsAndOrgsOpts}
                    error={(err = getFieldError("schoolOrOrganization", errors)) && {
                        content: err,
                        pointing: "below"
                    }}
                />
            </Form.Field>

            <Message
                error
                header="Update Account Info Error"
                content={getFormError(errors)}
            />

        </Form>
    );

};

export default AccountInfoForm;

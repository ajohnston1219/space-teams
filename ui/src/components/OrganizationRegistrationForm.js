import React from "react";
import { useSelector } from "react-redux";
import { ErrorTag } from "../utils/enums";
import { getFieldError, getFormError } from "../utils/formErrors";
import { getTaggedErrors } from "../selectors/errors";
import {
    Message,
    Form,
    Dropdown
} from "semantic-ui-react";
import countries from "../utils/countries";
import states from "../utils/us-states";

const OrganizationRegistrationForm = ({
    formState,
    setFormState
}) => {

    const countryOpts = countries.map(c => ({ key: c.name, text: c.name, value: c.name }));

    const errors = useSelector((state) => getTaggedErrors(state.errors, ErrorTag.CREATE_ORG));

    let err;

    return (

        <Form error={!!getFormError(errors)}>

            <Form.Input
                label="Organization Name"
                placeholder="Organization Name"
                value={formState.name}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, name: value }))}
                error={(err = getFieldError("name", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Input
                label="Contact First Name"
                placeholder="Contact First Name"
                value={formState.contactFirstName}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, contactFirstName: value }))}
                error={(err = getFieldError("contactFirstName", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Input
                label="Contact Last Name"
                placeholder="Contact Last Name"
                value={formState.contactLastName}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, contactLastName: value }))}
                error={(err = getFieldError("contactLastName", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Input
                label="Contact Email"
                placeholder="Contact Email"
                value={formState.contactEmail}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, contactEmail: value }))}
                error={(err = getFieldError("contactEmail", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Input
                label="Phone Number"
                placeholder="Phone Number"
                value={formState.phoneNumber}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, phoneNumber: value }))}
                error={(err = getFieldError("phoneNumber", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
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
                <label>Country</label>
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
                label="City"
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
                        placeholder="State"
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

            <Message
                error
                header="Registration Error"
                content={getFormError(errors)}
            />

        </Form>
    );

};

export default OrganizationRegistrationForm;

/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { getFieldError, getFormError } from "../utils/formErrors";
import { Form, Dropdown, Checkbox } from "semantic-ui-react";
import countries from "../utils/countries";
import states from "../utils/us-states";

const CompetitionPaymentForm = ({
    user,
    formState,
    setFormState,
    errors,
    loading
}) => {

    let err;

    const countryOpts = countries.map(c => ({ key: c.name, text: c.name, value: c.name }));
    const stateOpts = states.map(s => ({ key: s.name, text: s.name, value: s.value }));

    const [isSameAsUser, setIsSameAsUser] = React.useState(false);

    const handleBillingInfoIsSame = () => {
        if (user && !isSameAsUser) {
            setFormState(s => ({
                ...s,
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address || "",
                country: user.country,
                city: user.city,
                stateOrProvince: user.stateOrProvince || "",
                zipCode: user.zipCode || ""
            }));
        }
        setIsSameAsUser(!isSameAsUser);
    };

    React.useEffect(() => {
        if (!user || formState.firstName !== user.firstName ||
            formState.lastName !== user.lastName ||
            (user.address && (formState.address !== user.address)) ||
            formState.country !== user.country ||
            formState.city !== user.city ||
            (user.stateOrProvince && (formState.stateOrProvince !== user.stateOrProvince)) ||
            (user.zipCode && (formState.zipCode !== user.zipCode))
        ) {
            setIsSameAsUser(false);
        } else {
            setIsSameAsUser(true);
        }
    }, [formState]);

    return (
        <Form
            loading={loading}
            error={!!getFormError(errors)}
        >
            <Form.Input
                label="Credit Card Number"
                placeholder="Credit Card Number"
                value={formState.cardNumber}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, cardNumber: value }))}
                autoComplete="off"
                error={(err = getFieldError("cardNumber", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Input
                label="Credit Card Expiration (MMYY)"
                placeholder="MMYY"
                value={formState.expiration}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, expiration: value }))}
                autoComplete="off"
                error={(err = getFieldError("expiration", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Input
                /* type="password" */
                label="CVC"
                placeholder="CVC"
                value={formState.code}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, code: value }))}
                autoComplete="off"
                error={(err = getFieldError("code", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            {user && (
                <Form.Field>
                    <Checkbox
                        label="Billing information is same as mine"
                        onChange={() => handleBillingInfoIsSame()}
                        checked={isSameAsUser}
                        disabled={!user}
                    />
                </Form.Field>
            )}
            <Form.Input
                label="Billing First Name"
                placeholder="Billing First Name"
                value={formState.firstName}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, firstName: value }))}
                error={(err = getFieldError("firstName", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Input
                label="Billing Last Name"
                placeholder="Billing Last Name"
                value={formState.lastName}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, lastName: value }))}
                error={(err = getFieldError("lastName", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Input
                label="Billing Address"
                placeholder="Billing Address"
                value={formState.address}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, address: value }))}
                error={(err = getFieldError("address", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            <Form.Field>
                <label>Billing Country</label>
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
                label="Billing City"
                placeholder="Billing City"
                value={formState.city}
                onChange={({ target: { value } }) => setFormState(s => ({ ...s, city: value }))}
                error={(err = getFieldError("city", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
            {formState.country === "United States of America" && (
                <Form.Field>
                    <label>Billing State</label>
                    <Dropdown
                        selection
                        search
                        placeholder="Select State"
                        value={formState.stateOrProvince}
                        onChange={(e, { value }) => setFormState(s => ({ ...s, stateOrProvince: value }))}
                        options={stateOpts}
                        error={(err = getFieldError("state", errors)) && {
                            content: err,
                            pointing: "below"
                        }}
                    />
                </Form.Field>
            )}
            <Form.Input
                label="Billing Zip Code"
                placeholder="Billing Zip Code"
                value={formState.zipCode}
                onChange={({ target: { value } }) => setFormState({ ...formState, zipCode: value })}
                error={(err = getFieldError("zip", errors)) && {
                    content: err,
                    pointing: "below"
                }}
            />
        </Form>
    );
};

export default CompetitionPaymentForm;

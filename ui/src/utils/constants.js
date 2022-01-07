export const ALERT_TIME = 3000;

export const PARENT_CONSENT_AGE = 18;

const urlBase = process.env.REACT_APP_URL_BASE;

const useLocal = () => ["development", "test"].some(env => env === process.env.NODE_ENV);

let authUrl;
if (useLocal()) {
    authUrl = "http://localhost:5000";
} else {
    authUrl = `https://auth.${urlBase}`;
}
export const AUTH_URL = authUrl;

let simsUrl;
if (useLocal()) {
    simsUrl = "http://localhost:5001";
} else {
    simsUrl = `https://sims.${urlBase}`;
}
export const SIMS_URL = simsUrl;

let compUrl;
if (useLocal()) {
    compUrl = "http://localhost:5002";
} else {
    compUrl = `https://competitions.${urlBase}`;
}
export const COMP_URL = compUrl;

let msgUrl;
if (useLocal()) {
    msgUrl = "http://localhost:5003";
} else {
    msgUrl = `https://messages.${urlBase}`;
}
export const MESSAGING_URL = msgUrl;

let resourcesUrl;
if (useLocal()) {
    resourcesUrl = "http://localhost:5004";
} else {
    resourcesUrl = `https://resources.${urlBase}`;
}
export const RESOURCES_URL = resourcesUrl;

let billingUrl;
if (useLocal()) {
    billingUrl = "http://localhost:5005";
} else {
    billingUrl = `https://billing.${urlBase}`;
}
export const BILLING_URL = billingUrl;

import axios from "axios";
import { AUTH_URL } from "../utils/constants";

const server = axios.create({
    baseURL: AUTH_URL,
    headers: {
        Accept: "application/json"
    }
});
export default server;

export class AuthService {
    constructor(baseURL) {
        if (!baseURL) {
            baseURL = AUTH_URL;
        }
        this.server = axios.create({
            baseURL,
            headers: {
                Accept: "application/json"
            }
        });
    }

    async createUser(username, email, password, registrationSource, competitionId) {
        let url = "/users";
        if (competitionId) {
            url += encodeURIComponent("?competition_id=" + competitionId);
        }
        const response = await this.server.post(url, { username, email, password, registrationSource });
        return response.data;
    }

    async submitAccountInfo(accountInfo, token) {
        const response = await this.server.post(
            "/users/account-info",
            accountInfo,
            { headers: { Authorization: token } }
        );
        return response.data;
    }
}

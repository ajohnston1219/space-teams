import { AuthService } from "../../../api/auth";
import { pactWith } from "jest-pact";
import { Matchers } from "@pact-foundation/pact";
import * as uuid from "uuid";

const { like } = Matchers;

pactWith(
    { consumer: "Dashboard", provider: "AuthService" },
    provider => {
        describe("Submit Account Info", () => {
            const TOKEN = "SECRET_TOKEN";
            const REQUEST_BODY = like({
                firstName: "Tester",
                lastName: "Person",
                address: "123 Sesame St",
                city: "Dallas",
                stateOrProvince: "TX",
                zipCode: "75201",
                country: "US",
                dateOfBirth: "2007-12-19",
                schoolOrOrganization: "Texas A&M University"
            });
            const EXPECTED_BODY = like({
                id: uuid.v4(),
                username: "tester-person",
                email: "tester@people.com",
                firstName: "Tester",
                lastName: "Person",
                address: "123 Sesame St",
                city: "Dallas",
                stateOrProvince: "TX",
                zipCode: "75201",
                country: "US",
                dateOfBirth: "2007-12-19",
                schoolOrOrganization: "Texas A&M University",
                desiredCompetitionId: uuid.v4()
            });

            const submitAccountInfoRequest = (token) => ({
                uponReceiving: "a request to submit account info",
                withRequest: {
                    method: "POST",
                    path: "/users/account-info",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    body: REQUEST_BODY
                }
            });

            const submitAccountInfoResponse = {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: EXPECTED_BODY
            };

            it("can submit a user's account info", async () => {
                // Arrange
                provider.addInteraction({
                    state: "i have a user who hasn't submitted their account info yet",
                    ...submitAccountInfoRequest(TOKEN),
                    willRespondWith: submitAccountInfoResponse
                });
                const accountInfo = {
                    firstName: "Tester",
                    lastName: "Person",
                    address: "123 Sesame St",
                    city: "Dallas",
                    stateOrProvince: "TX",
                    zipCode: "75201",
                    country: "US",
                    dateOfBirth: "2007-12-19",
                    schoolOrOrganization: "Texas A&M University"
                };
                const authService = new AuthService(provider.mockService.baseUrl);

                // Act
                const response = await authService.submitAccountInfo(accountInfo, TOKEN);

                // Assert
                expect(response.id).not.toBe(null);
            });

            it("cannot submit a user's account info without auth token", async () => {
                // Arrange
                provider.addInteraction({
                    state: "i don't get an auth token",
                    ...submitAccountInfoRequest(undefined),
                    willRespondWith: { status: 401 }
                });
                const accountInfo = {
                    firstName: "Tester",
                    lastName: "Person",
                    address: "123 Sesame St",
                    city: "Dallas",
                    stateOrProvince: "TX",
                    zipCode: "75201",
                    country: "US",
                    dateOfBirth: "2007-12-19",
                    schoolOrOrganization: "Texas A&M University"
                };
                const authService = new AuthService(provider.mockService.baseUrl);

                // Act
                let error = null;
                try {
                    await authService.submitAccountInfo(accountInfo, TOKEN);
                } catch (err) {
                    error = err;
                }

                // Assert
                expect(error).not.toBeNull();
            });
        });
    });

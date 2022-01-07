import { AuthService } from "../../../api/auth";
import { pactWith } from "jest-pact";
import { Matchers } from "@pact-foundation/pact";
import * as uuid from "uuid";

const { like } = Matchers;

pactWith(
    { consumer: "Dashboard", provider: "AuthService" },
    provider => {
        describe("Create User", () => {
            const REQUEST_BODY = like({
                username: "tester-person",
                email: "tester@people.com",
                password: "SuperSecret007!"
            });
            const EXPECTED_BODY = like({
                id: uuid.v4()
            });

            const createUserRequest = {
                uponReceiving: "a request to create a new user",
                withRequest: {
                    method: "POST",
                    path: "/users",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: REQUEST_BODY
                }
            };

            const createUserSuccessResponse = {
                status: 201,
                headers: {
                    "Content-Type": "application/json"
                },
                body: EXPECTED_BODY
            };

            beforeEach(() => {
                const interaction = {
                    state: "i do not already have a user with provided username and email",
                    ...createUserRequest,
                    willRespondWith: createUserSuccessResponse
                }
                provider.addInteraction(interaction);
            });

            it("can create a new user", async () => {
                // Arrange
                const username = "tester-person";
                const email = "tester@people.com";
                const password = "SuperSecret007!";
                const authService = new AuthService(provider.mockService.baseUrl);

                // Act
                const response = await authService.createUser(
                    username, email, password
                );

                // Assert
                expect(response.id).not.toBeNull();
            });
        });
    });

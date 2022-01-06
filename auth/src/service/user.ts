import UserRepository from "../repository/user";
import User, { UserFactory } from "../model/user";

export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
}

enum AuthenticationRequestType {
    USERNAME, EMAIL
}

export class AuthenticationRequest {
    public static ByUsername(username: string, password: string): AuthenticationRequest {
        return new AuthenticationRequest(username, password, AuthenticationRequestType.USERNAME);
    }

    public static ByEmail(email: string, password: string): AuthenticationRequest {
        return new AuthenticationRequest(email, password, AuthenticationRequestType.EMAIL);
    }

    private constructor(
        private readonly _usernameOrEmail: string,
        private readonly _password: string,
        private readonly _requestType: AuthenticationRequestType
    ) {}

    public get usernameOrEmail(): string { return this._usernameOrEmail; }
    public get password(): string { return this._password; }
    public get requestType(): AuthenticationRequestType { return this._requestType; }
}

export enum AuthenticationFailureReason {
    INVALID_PASSWORD,
    USER_NOT_FOUND
}

export class AuthenticationResult {
    public static Successful(): AuthenticationResult {
        return new AuthenticationResult(true, null, null);
    }

    public static InvalidPassword() {
        return new AuthenticationResult(
            false, "Invalid password", AuthenticationFailureReason.INVALID_PASSWORD
        );
    }

    public static UserNotFound(request: AuthenticationRequest) {
        let message;
        switch (request.requestType) {
            case AuthenticationRequestType.USERNAME:
                message = `User with username '${request.usernameOrEmail}' not found`;
            case AuthenticationRequestType.EMAIL:
                message = `User with email '${request.usernameOrEmail}' not found`;
        }
        return new AuthenticationResult(
            false, message, AuthenticationFailureReason.USER_NOT_FOUND
        );
    }

    public get reason(): AuthenticationFailureReason | null { return this._reason; }
    public get message(): string | null { return this._message; }
    public get successful(): boolean { return this._successful; }

    private constructor(
        private readonly _successful: boolean,
        private readonly _message: string | null,
        private readonly _reason: AuthenticationFailureReason | null
    ) {}
}

export default class UserService {
    constructor(private userRepository: UserRepository) {}

    public async createUser(request: CreateUserRequest): Promise<User> {
        // TODO(adam): Check for username/email conflicts
        // TODO(adam): Registration source
        const user = await UserFactory.createInitial(
            request.username, request.email, request.password
        );
        await this.userRepository.createUser(user);
        return user;
    }

    public async authenticateUser(request: AuthenticationRequest): Promise<AuthenticationResult> {
        let user;
        switch (request.requestType) {
            case AuthenticationRequestType.USERNAME:
                user = await this.userRepository.findUserByUsername(request.usernameOrEmail);
                break;
            case AuthenticationRequestType.EMAIL:
                user = await this.userRepository.findUserByEmail(request.usernameOrEmail);
                break;
        }
        if (!user) {
            return AuthenticationResult.UserNotFound(request);
        }
        const success = await user.checkPassword(request.password);
        if (!success) {
            return AuthenticationResult.InvalidPassword();
        }
        return AuthenticationResult.Successful();
    }

    public async getUserById(id: string): Promise<User | null> {
        return await this.userRepository.findUserById(id);
    }
}

import UserRepository from "../repository/user";
import User, { UserFactory } from "../model/user";

export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
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

    public async getUserById(id: string): Promise<User | null> {
        return await this.userRepository.findUserById(id);
    }
}

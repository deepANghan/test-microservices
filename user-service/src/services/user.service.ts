import { UserRepository } from "../repository/user.repository.js";

class UserService {

    userRepository: UserRepository

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(name: string, email: string) {
        return this.userRepository.create(name, email);
    }

    async getUser(id: string) {
        return this.userRepository.findById(id);
    }

}

export { UserService };
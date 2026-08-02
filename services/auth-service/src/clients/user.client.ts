import axios from "axios";
import { env } from "../config/env.js";

class UserClient {

    private userServiceUrl: string;

    constructor() {
        this.userServiceUrl = env.USER_SERVICE_URL;
    }

    async createUser(data: any) {

        await axios.post(
            this.userServiceUrl + "/api/user",
            data
        );
    }

}

export { UserClient };


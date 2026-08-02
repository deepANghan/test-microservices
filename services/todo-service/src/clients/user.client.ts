import { env } from "../config/env.js";

export class UserClient {

    private userServiceUrl: string;

    constructor() {
        this.userServiceUrl =
            env.USER_SERVICE_URL;
    }


    async getUser(userId: string) {

        const response = await fetch(
            `${this.userServiceUrl}/api/user/${userId}`
        );


        if (response.status === 404) {
            return null;
        }


        if (!response.ok) {
            throw new Error(
                "User service unavailable"
            );
        }


        const data = await response.json();

        return data.data.user;
    }
}
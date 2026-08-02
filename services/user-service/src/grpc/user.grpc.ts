import { UserService } from "../services/user.service.js";

const userService = new UserService();

export const userGrpcHandler = {

    async getUser(call: any, callback: any) {

        try {

            const user = await userService.getUser(
                call.request.userId
            );

            if (!user) {
                throw new Error("User not found");
            }

            callback(null, {
                id: call.request.userId,
                name: user.name,
                email: user.email
            });


        } catch (error) {

            callback(error);

        }
    }
};

import { UserService } from "../services/user.service.js";
import grpc from "@grpc/grpc-js";

const userService = new UserService();

export const userGrpcHandler = {

    async getUser(call: any, callback: any) {

        try {

            const user = await userService.getUser(
                call.request.userId
            );

            if (!user) {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: "User not found"
                });
                return;
            }

            callback(null, {
                userId: call.request.userId,
                name: user.name,
                email: user.email
            });


        } catch (error) {

            callback(error);

        }
    }
};

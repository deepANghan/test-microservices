import grpc, { Server } from "@grpc/grpc-js";
import { UserServiceService } from "@package/proto";
import { userGrpcHandler } from "./user.grpc.js";

async function startGrpcServer() {

    const server = new Server();

    server.addService(UserServiceService, userGrpcHandler);

    server.bindAsync(
        "0.0.0.0:50051",
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if (err) {
                console.log(err)
                return;
            }

            console.log(`user grpc service running on ${port}`);
        }
    );

}

export { startGrpcServer };
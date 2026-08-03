import grpc, { Server } from "@grpc/grpc-js";
import { TodoServiceService } from "@package/proto/todo";
import { TodoServiceHandler } from "./todo.grpc.js";
import { authInterceptor } from "./interceptors/authInterceptor.js";

async function startGrpcServer() {

    const server = new Server({
        interceptors: [
            authInterceptor
        ]
    });

    server.addService(TodoServiceService, TodoServiceHandler);

    server.bindAsync(
        "0.0.0.0:50052",
        grpc.ServerCredentials.createInsecure(),
        () => {
            server.start();
            console.log("Todo Service Grpc Server on 50052");
        }
    )
}

export { startGrpcServer };
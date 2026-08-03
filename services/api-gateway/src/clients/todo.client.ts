import { TodoServiceClient } from "@package/proto/todo";
import grpc, { Metadata } from "@grpc/grpc-js";

let todoClient: TodoServiceClient | null = null;

function getClient() {

    if (todoClient) {
        return todoClient;
    }

    todoClient = new TodoServiceClient(
        "localhost:50052",
        grpc.ChannelCredentials.createInsecure()
    );

    return todoClient;
}

async function getTodos(serviceToken: string, userId: string) {

    const metadata = new Metadata();

    metadata.add("x-service-token", serviceToken);
    metadata.add("x-user-Id", userId);

    return new Promise((res, rej) => {

        getClient().getTodos(
            {},
            metadata,
            (error, response) => {

                if (error) {
                    rej(error);
                    return;
                }

                res(response);
            }
        )
    })

}


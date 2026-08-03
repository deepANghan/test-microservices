import * as grpc from "@grpc/grpc-js";
import { UserServiceClient } from "@package/proto";

let client: UserServiceClient | null = null;

function getClient() {

    if (!client) {
        const credentials = grpc.credentials.createInsecure();

        console.log(credentials);

        console.log(
            "credentials valid:",
            credentials instanceof grpc.ChannelCredentials
        );

        client = new UserServiceClient(
            "localhost:50051",
            credentials
        );
    }

    return client;
}

export function getUser(id: string) {

    return new Promise((resolve, reject) => {
        getClient().getUser(
            {
                userId: id
            },
            (err, response) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(response);
            }
        );
    });
}
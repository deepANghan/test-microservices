import { TodoServiceClient } from "@package/proto/todo";
import grpc, { Metadata } from "@grpc/grpc-js";

let todoClient: TodoServiceClient | null = null;

function getTodoClient() {

    if (todoClient) {
        return todoClient;
    }

    todoClient = new TodoServiceClient(
        "localhost:50052",
        grpc.ChannelCredentials.createInsecure()
    );

    return todoClient;
}

async function getTodos(metadata: Metadata, userId: string) {


    return new Promise((res, rej) => {

        getTodoClient().getTodos(
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

async function getTodo(metadata: Metadata, data: any) {

    let todoId = data.todoId;

    if (!todoId) {
        throw new Error("Todo Id isn't present");
    }

    return new Promise((res, rej) => {
        getTodoClient().getTodo(
            { todoId: todoId },
            metadata,
            (err, response) => {

                if (err) {
                    console.log(err);
                    rej(err);
                }

                console.log(response);

                res(response);
            }
        );
    });
}

async function CreateTodo(serviceToken: string, data: any) {

    let title = data.title;

    const metadata = new Metadata();

    metadata.add("x-service-token", serviceToken);

    if (!title) {
        throw new Error("Title is not present");
    }

    return new Promise((res, rej) => {

        getTodoClient().createTodo(
            { title: title },
            metadata,
            (err, response) => {

                if (err) {
                    rej(err);
                }

                res(response);
            }
        );

    })
}

export { getTodoClient, getTodo, getTodos, CreateTodo };
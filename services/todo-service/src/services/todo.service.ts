import { UserClient } from "../clients/user.client.js";
import { getUser } from "../grpc/user.client.js";
import type { Todo } from "../models/todo.model.js";
import { TodoRepository } from "../repository/todo.repository.js";


class TodoService {

    private todoRepository: TodoRepository;
    private userClient: UserClient;

    constructor() {
        this.todoRepository = new TodoRepository();
        this.userClient = new UserClient();
    }

    async createTodo(
        title: string,
        userId: string
    ): Promise<Todo> {

        const user =
            await this.userClient.getUser(userId);


        if (!user) {
            throw new Error(
                "User does not exist"
            );
        }

        if (!title.trim()) {
            throw new Error("Title cannot be empty");
        }

        return await this.todoRepository.create(
            title,
            userId
        );
    }


    async getTodo(id: string) {

        return await this.todoRepository.findById(id);
    }


    async getUserTodos(userId: string) {

        console.log(await getUser(userId));

        return await this.todoRepository.findByUserId(userId);
    }


    async completeTodo(
        id: string,
        status: boolean
    ) {

        const todo =
            await this.todoRepository.updateStatus(
                id,
                status
            );


        if (!todo) {
            throw new Error("Todo not found");
        }


        return todo;
    }


    async deleteTodo(id: string) {

        const deleted =
            await this.todoRepository.delete(id);


        if (!deleted) {
            throw new Error("Todo not found");
        }


        return true;
    }
}


export { TodoService };
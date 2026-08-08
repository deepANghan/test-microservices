import { CreateTodo, getTodo, getTodoClient, getTodos } from "./clients/todo.client.js";
import { registry } from "./registry.js";

const routes = [
    {
        path: "/user",
        target: registry.USER_SERVICE_URL,
        protected: false,
        service: "user-service"
    },
    {
        path: "/todo",
        target: registry.TODO_SERVICE_URL,
        protected: true,
        service: "todo-service"
    },
    {
        path: "/auth",
        target: registry.AUTH_SERVICE_URL,
        protected: false,
        service: "auth-service"
    }
];

export const subRoutes = {
    TodoService: {
        client: getTodoClient,
        routes: [
            {
                method: "POST",
                path: "/todo",
                rpc: "CreateTodo"
            },
            {
                method: "GET",
                path: "/todo",
                rpc: "GetTodo"
            },
            {
                method: "GET",
                path: "/todo/user/:userId",
                rpc: "GetTodos"
            }
        ]
    }
};

export const routeToCallMap = {
    "GetTodo": getTodo,
    "GetTodos": getTodos,
    "CreateTodo": CreateTodo
}

export { routes };
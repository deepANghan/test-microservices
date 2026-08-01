import { registry } from "./registry.js";

const routes = [
    {
        path: "/user",
        target: registry.USER_SERVICE_URL
    },
    {
        path: "/todo",
        target: registry.TODO_SERVICE_URL
    },
    {
        path: "/auth",
        target: registry.AUTH_SERVICE_URL
    }
];

export { routes };
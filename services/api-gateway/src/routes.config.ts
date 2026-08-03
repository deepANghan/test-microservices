import { registry } from "./registry.js";

const routes = [
    {
        path: "/user",
        target: registry.USER_SERVICE_URL,
        protected: false
    },
    {
        path: "/todo",
        target: registry.TODO_SERVICE_URL,
        protected: true
    },
    {
        path: "/auth",
        target: registry.AUTH_SERVICE_URL,
        protected: false
    }
];

export { routes };
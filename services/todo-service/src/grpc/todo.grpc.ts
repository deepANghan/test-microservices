import type { TodoServiceServer } from "@package/proto/todo";
import grpc from "@grpc/grpc-js";
import { TodoService } from "../services/todo.service.js";
import { title } from "node:process";

const todoService = new TodoService();

export const TodoServiceHandler: TodoServiceServer = {

    async createTodo(call, callback) {

        try {

            const metadata = call.metadata;

            let userId = metadata.get("x-user-Id");

            const title = call.request.title;

            if (!title) {
                callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: "Todo Title is not present"
                })
                return;
            }

            const todo = await todoService.createTodo(title, userId as unknown as string);

            callback(null, {
                todoId: todo.id,
                status: todo.status
            });

        } catch (error: any) {

            callback({
                code: grpc.status.INTERNAL,
                message: error?.message
            })

        }

    },

    async getTodo(call, callback) {

        try {

            const metadata = call.metadata;

            let userId = metadata.get("x-user-Id");

            const todoId = call.request.todoId;

            if (!todoId) {
                callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: "Todo Id is not present"
                })
                return;
            }

            const todo = await todoService.getTodo(todoId);

            if (!todo) {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: "Todo is not present"
                })
                return;
            }

            callback(null, {
                todo: {
                    todoId: todo.id,
                    title: todo.title,
                    status: todo.status,
                    createdAt: todo.createdAt,
                    updatedAt: todo.updatedAt
                }
            });

        } catch (error: any) {

            callback({
                code: grpc.status.INTERNAL,
                message: error?.message
            })

        }

    },

    async getTodos(call, callback) {

        try {

            const metadata = call.metadata;

            let userId = metadata.get("x-user-Id")[0];

            const todos = await todoService.getUserTodos(userId as unknown as string);

            let responseTodos = todos.map((todo) => {
                return {
                    todoId: todo.id,
                    title: todo.title,
                    status: todo.status,
                    createdAt: todo.createdAt,
                    updatedAt: todo.updatedAt
                }
            });

            callback(null, {
                todos: responseTodos
            });

        } catch (error: any) {

            callback({
                code: grpc.status.INTERNAL,
                message: error?.message
            })

        }
    },

    async updateTodo(call, callback) {

        try {

            const metadata = call.metadata;

            let userId = metadata.get("x-user-Id");

            const todoId = call.request.todoId;
            const status = call.request.status;

            if (!todoId) {
                callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: "Todo Id is not present"
                })
                return;
            }

            // const todo = await todoService.getTodo(todoId);

            // if (!todo) {
            //     callback({
            //         code: grpc.status.NOT_FOUND,
            //         message: "Todo is not present"
            //     })
            //     return;
            // }

            // callback(null, {
            //     todo: {
            //         todoId: todo.id,
            //         title: todo.title,
            //         status: todo.status,
            //         createdAt: todo.createdAt,
            //         updatedAt: todo.updatedAt
            //     }
            // });

        } catch (error: any) {

            callback({
                code: grpc.status.INTERNAL,
                message: error?.message
            })

        }

    },

    async deleteTodo(call, callback) {

        try {

            const metadata = call.metadata;

            let userId = metadata.get("x-user-Id");

            const todoId = call.request.todoId;

            if (!todoId) {
                callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: "Todo Id is not present"
                })
                return;
            }

            await todoService.deleteTodo(todoId);

            callback(null, {
                success: true
            });

        } catch (error: any) {

            callback({
                code: grpc.status.INTERNAL,
                message: error?.message
            })

        }

    }



};
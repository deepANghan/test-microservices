import type { Request, Response } from "express";
import { TodoService } from "../services/todo.service.js";


class TodoController {

    private todoService: TodoService;


    constructor() {
        this.todoService = new TodoService();
    }


    create = async (req: Request, res: Response) => {

        const {
            title,
            userId
        } = req.body;


        const todo =
            await this.todoService.createTodo(
                title,
                userId
            );


        return res.status(201).json({
            success: true,
            data: todo
        });
    }


    get = async (req: Request, res: Response) => {

        const id = req.params.id;

        const todo =
            await this.todoService.getTodo(id as string);


        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }


        return res.json({
            success: true,
            data: todo
        });
    }


    getByUser = async (req: Request, res: Response) => {

        const todos =
            await this.todoService.getUserTodos(
                req.params.userId as string
            );


        return res.json({
            success: true,
            data: todos
        });
    }


    update = async (req: Request, res: Response) => {

        const {
            status
        } = req.body;


        const todo =
            await this.todoService.completeTodo(
                req.params.id as string,
                status
            );


        return res.json({
            success: true,
            data: todo
        });
    }


    remove = async (req: Request, res: Response) => {

        await this.todoService.deleteTodo(
            req.params.id as string
        );


        return res.status(204).send();
    }
}


export { TodoController };
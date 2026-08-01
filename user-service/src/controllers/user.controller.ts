
import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";

class UserController {

    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    create = async (req: Request, res: Response) => {

        const { userId, name, email } = req.body;

        if (!userId || !name || !email) {
            throw new Error("Field is empty");
        }

        const user = await this.userService.createUser(userId, name, email);

        return res.status(201).json({
            success: true,
            message: "user created successfully",
            data: {
                userId: user.id
            }
        });
    }

    get = async (req: Request, res: Response) => {

        const id = req.params.id;

        const user =
            await this.userService.getUser(id as string);


        if (!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "User not found"
                });
        }


        return res.status(200).json({
            success: true,
            data: {
                user
            }
        });

    }
}

export { UserController };
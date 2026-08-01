import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

class AuthController {

    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    register = async (req: Request, res: Response) => {

        try {

            const { name, email, password } = req.body;

            const result = await this.authService.register(name, email, password);

            return res.status(201).json({
                message: "User registered",
                user: result
            });


        } catch (error: any) {

            return res
                .status(400)
                .json({
                    message: error.message
                });

        }

    }

    login = async (req: Request, res: Response) => {

        try {

            const { email, password } = req.body;

            const result = await this.authService.login(email, password);

            return res
                .status(200)
                .json(result);

        } catch (error: any) {

            return res
                .status(401)
                .json({
                    message: error.message
                });

        }

    }


}


export { AuthController };
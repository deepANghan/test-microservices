import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const JWT_SECRET = env.JWT_SECRET;

export function generateToken(payload: object) {

    return jwt.sign(
        payload,
        JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

}
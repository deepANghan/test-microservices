import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function validateJWT(token: string) {

    try {

        const payload = jwt.verify(token, JWT_SECRET);

        return payload;

    } catch (error) {

        throw new Error(
            "Invalid token"
        );

    }

}
import jwt from "jsonwebtoken";
import fs from "fs";

const privateKey = fs.readFileSync(
    "./keys/private.pem",
    "utf8"
);

export function createServiceToken(
    serviceName: string,
) {

    return jwt.sign(
        {
            service: serviceName,
        },
        privateKey,
        {
            algorithm: "RS256",
            issuer: "internal-auth",
            expiresIn: "5m",
        }
    );
}
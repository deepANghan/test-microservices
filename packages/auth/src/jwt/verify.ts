import jwt from "jsonwebtoken";
import fs from "fs";


const publicKey = fs.readFileSync(
    "./keys/public.pem",
    "utf8"
);


export function verifyServiceToken(
    token: string,
) {

    const payload = jwt.verify(
        token,
        publicKey,
        {
            algorithms: ["RS256"],
            issuer: "internal-auth",
        }
    );

    return payload;
}
import "dotenv/config";

export const env = {
    PORT: Number(process.env.PORT),
    DATABASE_URL: process.env.DATABASE_URL!,
    USER_SERVICE_URL: process.env.USER_SERVICE_URL!
};
import "dotenv/config";

const env = {
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    PORT: Number(process.env.PORT),
    USER_SERVICE_URL: process.env.USER_SERVICE_URL!
};

export { env };
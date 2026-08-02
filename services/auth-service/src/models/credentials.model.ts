interface Credentials {
    userId: string;
    email: string;
    passwordHash: string;
    createdAt: Date
}

export type { Credentials };
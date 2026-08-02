interface Todo {
    id: string;
    title: string;
    status: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type { Todo };
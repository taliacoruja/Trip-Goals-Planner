export type Category = 'docs' | 'packing' | 'money' | 'health' | 'booking' | 'other';
export const STATUSES = ['todo', 'in_progress', 'done', 'skipped'] as const;
export type Status = (typeof STATUSES)[number];

export type Trip = {
    id: string;
    title: string;
    startDate?: string;
    endDate?: string;
    createdAt: number;
};

export type Goal = {
    id: string;
    tripId: string;
    title: string;
    category: Category;
    status: Status;
    endDate?: string;
    createdAt: number;
    order: number;
    dueDate?: string;
};

export type Substack = {
    id: string;
    goalId: string;
    title: string;
    done: boolean;
};

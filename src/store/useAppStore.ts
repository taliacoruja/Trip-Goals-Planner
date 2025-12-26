import { create } from 'zustand';
import type { Trip, Goal, Category, Status } from '../shared/types/domain';
import { createId } from '../shared/lib/id';

type AppState = {
    trips: Trip[];
    activeTripId: string | null;
    goals: Goal[];

    createTrip: (title: string) => string | null;
    setActiveTripId: (id: string) => void;

    createGoal: (payload: {
        tripId: string;
        title: string;
        category?: Category;
        status?: Status;
        dueDate?: string;
    }) => string | null;

    deleteGoal: (goalId: string) => void;
    updateGoal: (
        goalId: string,
        patch: Partial<Pick<Goal, 'title' | 'status' | 'category' | 'dueDate'>>
    ) => void;

    getActiveTrip: () => Trip | null;
    getGoalsByTrip: (tripId: string) => Goal[];
};

export const useAppStore = create<AppState>((set, get) => ({
    trips: [],
    activeTripId: null,
    goals: [],

    createTrip: (title) => {
        const safeTitle = title.trim();
        if (!safeTitle) return null;

        const id = createId('trip');
        const trip: Trip = { id, title: safeTitle, createdAt: Date.now() };

        set((s) => ({
            trips: [trip, ...s.trips],
            activeTripId: s.activeTripId ?? id,
        }));

        return id;
    },

    setActiveTripId: (id) => set({ activeTripId: id }),

    createGoal: ({ tripId, title, category = 'other', status = 'todo', dueDate }) => {
        const safeTitle = title.trim();
        if (!safeTitle) return null;

        const id = createId('goal');
        const current = get().goals.filter((g) => g.tripId === tripId);

        const goal: Goal = {
            id,
            tripId,
            title: safeTitle,
            category,
            status,
            dueDate,
            createdAt: Date.now(),
            order: current.length,
        };

        set((s) => ({ goals: [...s.goals, goal] }));
        return id;
    },

    deleteGoal: (goalId) =>
        set((s) => ({
            goals: s.goals.filter((g) => g.id !== goalId),
        })),

    updateGoal: (goalId, patch) =>
        set((s) => ({
            goals: s.goals.map((g) => (g.id === goalId ? { ...g, ...patch } : g)),
        })),

    getActiveTrip: () => {
        const { trips, activeTripId } = get();
        if (!activeTripId) return null;
        return trips.find((t) => t.id === activeTripId) ?? null;
    },

    getGoalsByTrip: (tripId) => {
        return get()
            .goals.filter((g) => g.tripId === tripId)
            .slice()
            .sort((a, b) => a.order - b.order);
    },
}));

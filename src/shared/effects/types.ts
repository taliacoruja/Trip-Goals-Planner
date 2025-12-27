export type EffectId = 'cat_hearts' | 'success_confetti' | 'warning_shake';

export type EffectPayloadMap = {
    cat_hearts: { intensity?: 'low' | 'medium' | 'high' };
    success_confetti: Record<string, never>;
    warning_shake: Record<string, never>;
};

export type EffectEvent = {
    [K in EffectId]: {
        id: K;
        createdAt: number;
        durationMs: number;
        payload: EffectPayloadMap[K];
    };
}[EffectId];

export type EffectsApi = {
    events: EffectEvent[];
    trigger: <T extends EffectId>(id: T, payload: EffectPayloadMap[T], durationMs?: number) => void;
    remove: (createdAt: number) => void;
};

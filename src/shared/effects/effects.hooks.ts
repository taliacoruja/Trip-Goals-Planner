import { useContext } from 'react';
import { EffectsContext } from './effects.context';

export function useEffects() {
    const ctx = useContext(EffectsContext);
    if (!ctx) throw new Error('useEffects must be used within <EffectsProvider />');
    return ctx;
}

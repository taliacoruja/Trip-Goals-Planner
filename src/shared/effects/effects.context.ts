import { createContext } from 'react';
import type { EffectsApi } from './types';

export const EffectsContext = createContext<EffectsApi | null>(null);

import React, { useCallback, useMemo, useState } from "react";
import { EffectsContext } from "./effects.context";
import type { EffectEvent, EffectId, EffectPayloadMap } from "./types";

function createEffectEvent<T extends EffectId>(
  id: T,
  payload: EffectPayloadMap[T],
  createdAt: number,
  durationMs: number
): Extract<EffectEvent, { id: T }> {
  return { id, payload, createdAt, durationMs } as Extract<EffectEvent, { id: T }>;
}

export function EffectsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EffectEvent[]>([]);

  const remove = useCallback((createdAt: number) => {
    setEvents((prev) => prev.filter((e) => e.createdAt !== createdAt));
  }, []);

  const trigger = useCallback(
    <T extends EffectId>(id: T, payload: EffectPayloadMap[T], durationMs = 2000) => {
      const createdAt = Date.now();
      const ev = createEffectEvent(id, payload, createdAt, durationMs);

      setEvents((prev) => [...prev, ev]);

      window.setTimeout(() => remove(createdAt), durationMs);
    },
    [remove]
  );

  const value = useMemo(() => ({ events, trigger, remove }), [events, trigger, remove]);

  return <EffectsContext.Provider value={value}>{children}</EffectsContext.Provider>;
}

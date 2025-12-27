import { useEffects } from "./effects.hooks";
import type { EffectEvent } from "./types";
import styles from "./EffectsOverlay.module.css";
import { CatHeartsEffect } from "./CatHeartsEffect";

function renderEffect(ev: EffectEvent) {
  switch (ev.id) {
    case "cat_hearts":
      return <CatHeartsEffect key={ev.createdAt} event={ev} />;
    default:
      return null;
  }
}

export function EffectsOverlay() {
  const { events } = useEffects();

  if (events.length === 0) return null;

  return (
    <div className={styles.root} aria-hidden="true">
      {events.map(renderEffect)}
    </div>
  );
}

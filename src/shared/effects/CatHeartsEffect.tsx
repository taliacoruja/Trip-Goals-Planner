import type { EffectEvent } from "./types";
import styles from "./CatHeartsEffect.module.css";
import { HeartsSvg } from "./svgs/HeartsSvg";
import { WinkCatSvg } from "./svgs/WinkCatSvg";

type CatHeartsEvent = Extract<EffectEvent, { id: "cat_hearts" }>;

export function CatHeartsEffect({ event }: { event: CatHeartsEvent }) {
  const intensity = event.payload.intensity ?? "medium";

  return (
    <div className={styles.stage} data-intensity={intensity}>
      <div className={styles.cat} role="presentation">
        <WinkCatSvg />
      </div>

      <div className={styles.heart} role="presentation">
        <HeartsSvg />
      </div>
    </div>
  );
}

import type { Trip } from "../../../shared/types/domain";
import { useAppStore } from "../../../store/useAppStore";
import { copy } from "../../../shared/cope/en";
import styles from "./TripsPanel.module.css";
import { InlineForm } from "../../../shared/InlineForm/InlineForm";

type Props = {
  trips: Trip[];
  activeTripId: string | null;
};

export function TripsPanel({ trips, activeTripId }: Props) {
  const createTrip = useAppStore((s) => s.createTrip);
  const setActiveTripId = useAppStore((s) => s.setActiveTripId);

  return (
    <aside className={styles.panel}>
      <div className={styles.head}>
        <h2 className={styles.title}>Trips</h2>
        <p className={styles.hint}>Choose your destiny (or at least a destination).</p>
      </div>

      <InlineForm
        label={copy.trips.create}
        placeholder="e.g. Valencia: tapas & survival mode"
        submitText="Add"
        onSubmit={(title) => createTrip(title)}
      />

      {trips.length === 0 ? (
        <div className={styles.empty}>
          <strong>No trips yet.</strong>
          <p>That’s either impressive self-control or a bug.</p>
        </div>
      ) : (
        <div className={styles.list} role="list">
          {trips.map((t) => {
            const isActive = t.id === activeTripId;
            return (
              <button
                key={t.id}
                type="button"
                className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
                onClick={() => setActiveTripId(t.id)}
                aria-pressed={isActive}
              >
                {t.title}
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}

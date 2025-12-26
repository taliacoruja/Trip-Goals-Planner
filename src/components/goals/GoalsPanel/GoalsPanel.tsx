import type { Goal, Trip } from "../../../shared/types/domain";
import { copy } from "../../../shared/cope/en";
import styles from "./GoalsPanel.module.css";
import { InlineForm } from "../../../shared/InlineForm/InlineForm";
import { useAppStore } from "../../../store/useAppStore";
import { GoalItem } from "../GoalItem/GoalItem";

type Props = {
  activeTrip: Trip | null;
  activeTripId: string | null;
  goals: Goal[];
};

export function GoalsPanel({ activeTrip, activeTripId, goals }: Props) {
  const createGoal = useAppStore((s) => s.createGoal);

  return (
    <section className={styles.panel} aria-label="Planner">
      <header className={styles.head}>
        <h2 className={styles.title}>
          Planner{" "}
          {activeTrip ? <span className={styles.subtitle}>- {activeTrip.title}</span> : null}
        </h2>
        <p className={styles.hint}>
          Small steps. Big dreams. Mild panic. All valid.
        </p>
      </header>

      {!activeTripId ? (
        <div className={styles.empty}>
          <strong>Pick a trip first.</strong>
          <p>Otherwise we’ll plan into the void. The void doesn’t pay for flights.</p>
        </div>
      ) : (
        <>
          <InlineForm
            label={copy.planner.addGoal}
            placeholder="e.g. Pack socks (optional, but recommended)"
            submitText="Add"
            onSubmit={(title) =>
              createGoal({
                tripId: activeTripId,
                title,
                category: "other",
              })
            }
          />

          {goals.length === 0 ? (
            <div className={styles.empty}>
              <strong>{copy.planner.emptyTitle}</strong>
              <p>{copy.planner.emptyText}</p>
            </div>
          ) : (
            <ul className={styles.list}>
              {goals.map((g) => (
                <GoalItem key={g.id} goal={g} />
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

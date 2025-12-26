import type { Goal, Status } from "../../../shared/types/domain";
import { useAppStore } from "../../../store/useAppStore";
import { copy } from "../../../shared/cope/en";
import styles from "./GoalItem.module.css";
import { StatusMenu } from "../StatusMenu/StatusMenu";

type Props = {
  goal: Goal;
};

export function GoalItem({ goal }: Props) {
  const deleteGoal = useAppStore((s) => s.deleteGoal);
  const updateGoal = useAppStore((s) => s.updateGoal);

  return (
    <li className={styles.item}>
      <div className={styles.main}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{goal.title}</span>
          <span className={styles.meta}>({goal.category})</span>
        </div>

        <StatusMenu
          value={goal.status as Status}
          onChange={(next) => updateGoal(goal.id, { status: next })}
          label="Status"
        />
      </div>

      <button className={styles.delete} type="button" onClick={() => deleteGoal(goal.id)}>
        {copy.actions.delete}
      </button>
    </li>
  );
}

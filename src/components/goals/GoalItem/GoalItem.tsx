import type { Goal, Status } from "../../../shared/types/domain";
import { useAppStore } from "../../../store/useAppStore";
import { copy } from "../../../shared/cope/en";
import styles from "./GoalItem.module.css";
import { StatusMenu } from "../StatusMenu/StatusMenu";
import { CategoryMenu } from "../CategoryMenu/CategoryMenu";
import { useEffects } from "../../../shared/effects/effects.hooks";

type Props = {
  goal: Goal;
};

export function GoalItem({ goal }: Props) {
  const deleteGoal = useAppStore((s) => s.deleteGoal);
  const updateGoal = useAppStore((s) => s.updateGoal);

   const { trigger } = useEffects();

  return (
    <li className={styles.item}>
      <div className={styles.main}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{goal.title}</span>
        </div>

        <div className={styles.menusRow}>
          <div className={styles.menuItem}>         
            <CategoryMenu
              value={goal.category}
              onChange={(next) => updateGoal(goal.id, { category: next })}
              label="Category"
            />
          </div>
          <div className={styles.menuItem}>
            <StatusMenu
              value={goal.status as Status}
              onChange={(next) => {
                updateGoal(goal.id, { status: next });

                if (next === "done" && goal.status !== "done") {
                  trigger("cat_hearts", { intensity: "medium" }, 2000);
                }
              }}
              label="Status"
            />
          </div>
        </div>
      </div>

      <button className={styles.delete} type="button" onClick={() => deleteGoal(goal.id)}>
        {copy.actions.delete}
      </button>
    </li>
  );
}

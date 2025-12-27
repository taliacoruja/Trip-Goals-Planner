import type { Status } from "../../../shared/types/domain";
import { Listbox, type ListboxOption } from "../../../shared/ui/Listbox/Listbox";
import styles from "./StatusMenu.module.css";

const STATUS_OPTIONS: ListboxOption<Status>[] = [
  { value: "todo", label: "To do", hint: "Still pretending we have time" },
  { value: "in_progress", label: "In progress", hint: "Look at you, productive" },
  { value: "done", label: "Done", hint: "Legend. Absolute legend." },
  { value: "skipped", label: "Skipped", hint: "We choose peace." },
];

type Props = {
  value: Status;
  onChange: (next: Status) => void;
  label?: string;
};

export function StatusMenu({ value, onChange, label = "Status" }: Props) {
  return (
    <Listbox
      value={value}
      options={STATUS_OPTIONS}
      onChange={onChange}
      label={label}
      getKey={(o) => o.value}
      renderButton={({ selected }) => (
        <span className={styles.value}>
          <span className={`${styles.dot} ${styles[`dot_${selected.value}`]}`} aria-hidden="true" />
          {selected.label}
        </span>
      )}
      renderOption={(o, { isSelected, isActive }) => (
        <>
          <span className={styles.optionMain}>
            <span className={`${styles.dot} ${styles[`dot_${o.value}`]}`} aria-hidden="true" />
            <span className={styles.optionLabel}>{o.label}</span>
            {isSelected ? <span className={styles.check} aria-hidden="true">✓</span> : null}
          </span>
          {o.hint ? <span className={styles.optionHint}>{o.hint}</span> : null}
          {isActive ? null : null}
        </>
      )}
    />
  );
}

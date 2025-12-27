import type { Category } from "../../../shared/types/domain";
import { Listbox } from "../../../shared/ui/Listbox/Listbox";
import styles from "./CategoryMenu.module.css";
import { CATEGORY_OPTIONS } from "../ui/CategoryMenu/categoryOptions";


type Props = {
  value: Category;
  onChange: (next: Category) => void;
  label?: string;
};

export function CategoryMenu({ value, onChange, label = "Category" }: Props) {
  return (
    <Listbox
      value={value}
      options={CATEGORY_OPTIONS}
      onChange={onChange}
      label={label}
      getKey={(o) => o.value}
      renderButton={({ selected }) => (
        <span className={styles.value}>
          <span className={`${styles.pill} ${styles[`pill_${selected.value}`]}`} aria-hidden="true" />
          {selected.label}
        </span>
      )}
      renderOption={(o, { isSelected }) => (
        <>
          <span className={styles.optionMain}>
            <span className={`${styles.pill} ${styles[`pill_${o.value}`]}`} aria-hidden="true" />
            <span className={styles.optionLabel}>{o.label}</span>
            {isSelected ? <span className={styles.check} aria-hidden="true">✓</span> : null}
          </span>
          {o.hint ? <span className={styles.optionHint}>{o.hint}</span> : null}
        </>
      )}
    />
  );
}

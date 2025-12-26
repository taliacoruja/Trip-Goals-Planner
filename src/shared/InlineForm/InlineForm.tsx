import { useId, useState } from "react";
import styles from "./InlineForm.module.css";

type Props = {
  label: string;
  placeholder?: string;
  submitText: string;
  onSubmit: (value: string) => void;
  initialValue?: string;
};

export function InlineForm({ label, placeholder, submitText, onSubmit, initialValue = "" }: Props) {
  const id = useId();
  const [value, setValue] = useState(initialValue);
  const trimmed = value.trim();
  const canSubmit = trimmed.length > 0;

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit(trimmed);
        setValue("");
      }}
    >
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <div className={styles.row}>
        <input
          id={id}
          className={styles.input}
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
        />
        <button className={styles.button} type="submit" disabled={!canSubmit}>
          {submitText}
        </button>
      </div>
    </form>
  );
}

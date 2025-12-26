import { useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "./StatusMenu.module.css";
import type { Status } from "../../../shared/types/domain";

const STATUS_OPTIONS: { value: Status; label: string; hint?: string }[] = [
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
  const uid = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedIndex = useMemo(() => {
    const idx = STATUS_OPTIONS.findIndex((o) => o.value === value);
    return idx >= 0 ? idx : 0;
  }, [value]);

  const selected = STATUS_OPTIONS[selectedIndex];

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(selectedIndex);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && !root.contains(e.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    requestAnimationFrame(() => {
      const list = listRef.current;
      const el = list?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
      el?.focus();
    });
  }, [isOpen, activeIndex]);

  const openMenu = () => {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  };

  const toggleMenu = () => {
    setIsOpen((v) => {
      const next = !v;
      if (next) setActiveIndex(selectedIndex);
      return next;
    });
  };

  const closeToButton = () => {
    setIsOpen(false);
    requestAnimationFrame(() => buttonRef.current?.focus());
  };

  const commit = (next: Status) => {
    onChange(next);
    closeToButton();
  };

  const onButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openMenu();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
      return;
    }
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeToButton();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, STATUS_OPTIONS.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }

    if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(STATUS_OPTIONS.length - 1);
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(STATUS_OPTIONS[activeIndex].value);
      return;
    }

    if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <span className={styles.label} id={`${uid}-label`}>
        {label}
      </span>

      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${uid}-label ${uid}-value`}
        onClick={toggleMenu}
        onKeyDown={onButtonKeyDown}
      >
        <span className={styles.value} id={`${uid}-value`}>
          <span className={`${styles.dot} ${styles[`dot_${selected.value}`]}`} aria-hidden="true" />
          {selected.label}
        </span>

        <span className={styles.chevron} aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen ? (
        <ul
          ref={listRef}
          className={styles.menu}
          role="listbox"
          aria-labelledby={`${uid}-label`}
          tabIndex={-1}
          onKeyDown={onListKeyDown}
        >
          {STATUS_OPTIONS.map((o, i) => {
            const isSelected = o.value === value;
            const isActive = i === activeIndex;

            return (
              <li key={o.value} role="option" aria-selected={isSelected} className={styles.optionWrap}>
                <button
                  type="button"
                  className={`${styles.option} ${isActive ? styles.optionActive : ""}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => commit(o.value)}
                  data-index={i}
                >
                  <span className={styles.optionMain}>
                    <span className={`${styles.dot} ${styles[`dot_${o.value}`]}`} aria-hidden="true" />
                    <span className={styles.optionLabel}>{o.label}</span>
                    {isSelected ? (
                      <span className={styles.check} aria-hidden="true">
                        ✓
                      </span>
                    ) : null}
                  </span>

                  {o.hint ? <span className={styles.optionHint}>{o.hint}</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

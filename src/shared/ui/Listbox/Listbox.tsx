import { useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "./Listbox.module.css";

export type ListboxOption<T> = {
  value: T;
  label: string;
  hint?: string;
};

type RenderButtonArgs<T> = {
  selected: ListboxOption<T>;
  isOpen: boolean;
};

type RenderOptionArgs = {
  isSelected: boolean;
  isActive: boolean;
};

type Props<T> = {
  value: T;
  options: ReadonlyArray<ListboxOption<T>>;
  onChange: (next: T) => void;

  label?: string;

  getKey: (opt: ListboxOption<T>) => string;

  isEqual?: (a: T, b: T) => boolean;

  renderButton?: (args: RenderButtonArgs<T>) => React.ReactNode;

  renderOption?: (opt: ListboxOption<T>, state: RenderOptionArgs) => React.ReactNode;

  className?: string;
};

export function Listbox<T>({
  value,
  options,
  onChange,
  label = "Select",
  getKey,
  isEqual = Object.is,
  renderButton,
  renderOption,
  className,
}: Props<T>) {
  const uid = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedIndex = useMemo(() => {
    const idx = options.findIndex((o) => isEqual(o.value, value));
    return idx >= 0 ? idx : 0;
  }, [options, value, isEqual]);

  const selected = options[selectedIndex] ?? options[0];

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(selectedIndex);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && !root.contains(e.target)) setIsOpen(false);
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

  const commit = (next: T) => {
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
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
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
      setActiveIndex(options.length - 1);
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const opt = options[activeIndex];
      if (opt) commit(opt.value);
      return;
    }

    if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  const defaultButton = (
    <span className={styles.value} id={`${uid}-value`}>
      {selected?.label ?? "—"}
    </span>
  );

  return (
    <div className={`${styles.root} ${className ?? ""}`} ref={rootRef}>
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
        {renderButton ? renderButton({ selected, isOpen }) : defaultButton}

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
          {options.map((o, i) => {
            const isSelected = isEqual(o.value, value);
            const isActive = i === activeIndex;

            return (
              <li key={getKey(o)} role="option" aria-selected={isSelected} className={styles.optionWrap}>
                <button
                  type="button"
                  className={`${styles.option} ${isActive ? styles.optionActive : ""}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => commit(o.value)}
                  data-index={i}
                >
                  {renderOption ? (
                    renderOption(o, { isSelected, isActive })
                  ) : (
                    <>
                      <span className={styles.optionMain}>
                        <span className={styles.optionLabel}>{o.label}</span>
                        {isSelected ? <span className={styles.check} aria-hidden="true">✓</span> : null}
                      </span>
                      {o.hint ? <span className={styles.optionHint}>{o.hint}</span> : null}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

import type { ReactNode } from "react";
import styles from "./AppShell.module.css";

type Props = {
  title: string;
  children: ReactNode;
};

export function AppShell({ title, children }: Props) {
  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.tagline}>
          Plan like a responsible adult. Or at least pretend convincingly.
        </p>
      </header>

      <section className={styles.content}>{children}</section>
    </main>
  );
}

import { useMemo } from "react";
import { useAppStore } from "./store/useAppStore";
import { copy } from "./shared/cope/en";
import styles from "./App.module.css";

import { AppShell } from "./components/layout/AppShell/AppShell";
import { TripsPanel } from "./components/trips/TripsPanel/TripsPanel";
import { GoalsPanel } from "./components/goals/GoalsPanel/GoalsPanel";

export default function App() {
  const trips = useAppStore((s) => s.trips);
  const activeTripId = useAppStore((s) => s.activeTripId);
  const goalsAll = useAppStore((s) => s.goals);

  const activeTrip = useMemo(() => {
    if (!activeTripId) return null;
    return trips.find((t) => t.id === activeTripId) ?? null;
  }, [trips, activeTripId]);

  const goals = useMemo(() => {
    if (!activeTripId) return [];
    return goalsAll
      .filter((g) => g.tripId === activeTripId)
      .slice()
      .sort((a, b) => a.order - b.order);
  }, [goalsAll, activeTripId]);

  return (
    <AppShell title={copy.appName}>
      <div className={styles.layout}>
        <TripsPanel trips={trips} activeTripId={activeTripId} />
        <GoalsPanel activeTrip={activeTrip} activeTripId={activeTripId} goals={goals} />
      </div>
    </AppShell>
  );
}

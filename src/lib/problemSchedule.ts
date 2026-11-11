export interface ScheduleState {
  startedAt: number;
  fastForwardHours: number;
  elapsedHours: number;
  intervalsCompleted: number;
  msUntilNextUnlock: number;
  formattedCountdown: string;
}

const LOCAL_STORAGE_KEY = 'mathquest_schedule_v2';
export const CADENCE_INTERVAL_HOURS = 5;
export const CADENCE_INTERVAL_MS = CADENCE_INTERVAL_HOURS * 60 * 60 * 1000;

export function getStoredSchedule(): { startedAt: number; fastForwardHours: number } {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.startedAt === 'number' && typeof parsed.fastForwardHours === 'number') {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read schedule storage:', e);
  }

  // Initialize schedule start
  const initial = {
    startedAt: Date.now(),
    fastForwardHours: 0,
  };
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
  } catch (e) {
    console.warn('Could not write schedule storage:', e);
  }
  return initial;
}

export function saveSchedule(startedAt: number, fastForwardHours: number) {
  try {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ startedAt, fastForwardHours })
    );
  } catch (e) {
    console.warn('Could not save schedule:', e);
  }
}

export function calculateScheduleState(): ScheduleState {
  const { startedAt, fastForwardHours } = getStoredSchedule();
  const now = Date.now();
  const rawElapsedMs = Math.max(0, now - startedAt);
  const totalEffectiveMs = rawElapsedMs + fastForwardHours * 3600 * 1000;
  const elapsedHours = totalEffectiveMs / (3600 * 1000);

  const intervalsCompleted = Math.floor(totalEffectiveMs / CADENCE_INTERVAL_MS);
  const currentCycleProgressMs = totalEffectiveMs % CADENCE_INTERVAL_MS;
  const msUntilNextUnlock = Math.max(0, CADENCE_INTERVAL_MS - currentCycleProgressMs);

  // Format hours:minutes:seconds
  const totalSeconds = Math.floor(msUntilNextUnlock / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const formattedCountdown = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  return {
    startedAt,
    fastForwardHours,
    elapsedHours,
    intervalsCompleted,
    msUntilNextUnlock,
    formattedCountdown,
  };
}

export function fastForwardSchedule(hours: number = CADENCE_INTERVAL_HOURS): ScheduleState {
  const current = getStoredSchedule();
  const updatedFastForward = current.fastForwardHours + hours;
  saveSchedule(current.startedAt, updatedFastForward);
  return calculateScheduleState();
}

export function resetSchedule(): ScheduleState {
  const fresh = {
    startedAt: Date.now(),
    fastForwardHours: 0,
  };
  saveSchedule(fresh.startedAt, fresh.fastForwardHours);
  return calculateScheduleState();
}

/**
 * Startup and performance metrics collector.
 *
 * Records:
 * - App cold start time (binary spawn → renderer ready)
 * - Editor init time      (renderer ready → IdaztianEditor reports ready)
 */

export interface StartupMetrics {
  appColdStartMs: number;
  backendReadyMs: number;   // kept for backward compat (equals appColdStartMs)
  editorInitMs: number;
  totalStartupMs: number;
  ts: number;
}

const T0 = Date.now();

let editorInitAt: number | null = null;
let reported = false;

export function recordEditorInit(): void {
  if (editorInitAt !== null) return;
  editorInitAt = Date.now();
  tryReport();
}

function tryReport(): void {
  if (reported) return;
  if (editorInitAt === null) return;

  reported = true;
  const metrics: StartupMetrics = {
    appColdStartMs: editorInitAt - T0,
    backendReadyMs: editorInitAt - T0,  // same as cold start since no backend process
    editorInitMs: editorInitAt - T0,
    totalStartupMs: editorInitAt - T0,
    ts: T0,
  };

  console.log(
    `[metrics] Cold start: ${metrics.appColdStartMs}ms | ` +
    `Editor init: ${metrics.editorInitMs}ms | ` +
    `Total: ${metrics.totalStartupMs}ms`,
  );
}

/** Return metrics if collected, null otherwise. */
export function getStartupMetrics(): StartupMetrics | null {
  if (!reported) return null;
  return {
    appColdStartMs: (editorInitAt ?? T0) - T0,
    backendReadyMs: (editorInitAt ?? T0) - T0,
    editorInitMs: (editorInitAt ?? T0) - T0,
    totalStartupMs: (editorInitAt ?? T0) - T0,
    ts: T0,
  };
}

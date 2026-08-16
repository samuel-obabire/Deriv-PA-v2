export const DAILY_SUMMARY = "DAILY_SUMMARY";
export const CREATE_DAILY_SUMMARY_JOBS = "create-daily-summary-jobs";
export const GENERATE_ORGANIZATION_SUMMARY = "generate-organization-summary";
export const DAILY_SUMMARY_SCHEDULER_ID = "daily-summary-scheduler";

export const LAGOS_TZ = "Africa/Lagos";
export const RECOVERY_WINDOW_DAYS = 7;

// Each nightly run regenerates yesterday's summary (daysAgo 1) plus a second
// pass one day later (daysAgo 2) — a safety recompute that picks up
// transactions still pending/processing at the first run's cutoff (e.g.
// stuck pending manual reconciliation) which have since resolved.
export const SUMMARY_DAYS_AGO = [1, 2] as const;

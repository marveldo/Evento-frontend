export const REFRESH_EARLY_MS = 60_000;

export function isDue(expiresAt: number) {
  return expiresAt - REFRESH_EARLY_MS <= Date.now();
}

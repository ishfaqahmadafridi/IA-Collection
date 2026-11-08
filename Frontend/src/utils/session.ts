// Stores register resets without importing one another and creating dependency cycles.
const resets = new Set<() => void>();
let version = 0;
export const sessionVersion = () => version;
export function registerSessionReset(reset: () => void) { resets.add(reset); }
export function clearSession() {
  version += 1;
  for (const key of ['access_token', 'refresh_token', 'user_name', 'user_email', 'username', 'profile_image']) {
    localStorage.removeItem(key);
  }
  resets.forEach(reset => reset());
  window.dispatchEvent(new Event('session-cleared'));
}

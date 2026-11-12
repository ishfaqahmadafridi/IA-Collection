import type { LiveTryOnSession } from '../../types/liveTryon';
export function releaseLiveSession(session: LiveTryOnSession): void {
  session.controller.abort();
  clearTimeout(session.startupTimer); clearTimeout(session.sessionTimer);
  try { session.detach?.(); session.connection?.disconnect(); }
  catch { /* Continue releasing camera tracks even if the SDK cannot close cleanly. */ }
  finally {
    session.local?.getTracks().forEach(track => track.stop());
    session.remote?.getTracks().forEach(track => track.stop());
    session.detach = undefined;
    session.connection = null; session.local = null; session.remote = null;
  }
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { liveTryOnService } from '../../services/liveTryOnService';
import { connectDecart, decartCameraConstraints } from '../../services/decartStream';
import { releaseLiveSession } from '../../utils/tryon/releaseLiveSession';
import { errorMessage } from '../../utils/errors';
import { LIVE_TRY_ON } from '../../constants/liveTryon';
import type { LiveTryOnConfig, LiveTryOnPhase, LiveTryOnSession } from '../../types/liveTryon';
export function useDecartTryOn(productId: number, userId: number | null) {
  const outputRef = useRef<HTMLVideoElement>(null);
  const sessionRef = useRef<LiveTryOnSession | null>(null);
  const [config, setConfig] = useState<LiveTryOnConfig | null>(null);
  const [configError, setConfigError] = useState('');
  const [phase, setPhase] = useState<LiveTryOnPhase>('idle');
  const [status, setStatus] = useState('Allow live video processing, then start your camera.');
  const [error, setError] = useState('');
  const dispose = useCallback(() => {
    const current = sessionRef.current; sessionRef.current = null;
    if (current) releaseLiveSession(current);
    if (outputRef.current) outputRef.current.srcObject = null;
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setConfig(null); setConfigError('');
    liveTryOnService.config(productId, controller.signal).then(value => { if (!controller.signal.aborted) setConfig(value); })
      .catch(() => { if (!controller.signal.aborted) setConfigError('Could not check live try-on availability. Close and reopen to retry.'); });
    return () => controller.abort();
  }, [productId]);
  useEffect(() => {
    setPhase('idle'); setError(''); setStatus('Allow live video processing, then start your camera.');
    const hide = () => { if (document.hidden && sessionRef.current) { dispose(); setPhase('stopped'); setStatus('Live try-on stopped while this tab was hidden.'); } };
    const leave = () => dispose();
    document.addEventListener('visibilitychange', hide); window.addEventListener('pagehide', leave);
    return () => { dispose(); document.removeEventListener('visibilitychange', hide); window.removeEventListener('pagehide', leave); };
  }, [dispose, productId, userId]);
  const stop = () => { dispose(); setPhase('stopped'); setStatus('Live try-on stopped. Your camera is off.'); };
  const start = async (consent: boolean) => {
    if (sessionRef.current || !config?.available || userId === null) return;
    if (!consent) { setError('Agree to live video processing before starting.'); return; }
    const session: LiveTryOnSession = { controller: new AbortController(), local: null, remote: null, connection: null };
    sessionRef.current = session; setError(''); setPhase('preparing'); setStatus('Preparing your selected garment…');
    const current = () => sessionRef.current === session && !session.controller.signal.aborted;
    const fail = (message: string) => { if (!current()) return; dispose(); setError(message); setPhase('error'); setStatus('Live try-on stopped. Your camera is off.'); };
    session.startupTimer = setTimeout(() => fail('The live connection timed out. Check your connection and retry.'), LIVE_TRY_ON.startupTimeout);
    session.sessionTimer = setTimeout(() => { if (current()) { stop(); setStatus('The session time limit was reached. Start again if you want another preview.'); } }, config.session_seconds * 1000);
    try {
      const garment = await liveTryOnService.garment(config.garment_image, session.controller.signal);
      const constraints = await decartCameraConstraints(config.model);
      if (!current()) return;
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access requires HTTPS or localhost and a supported browser.');
      setPhase('permission'); setStatus('Allow camera access in your browser. Microphone access is not needed.');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (!current()) { stream.getTracks().forEach(track => track.stop()); return; }
      session.local = stream;
      stream.getVideoTracks().forEach(track => track.addEventListener('ended', () => fail('The camera disconnected. Please restart live try-on.'), { once: true }));
      setPhase('connecting'); setStatus('Connecting your camera to the live clothing service…');
      const connection = await connectDecart(stream, config, garment,
        async () => {
          if (!current()) throw new DOMException('Cancelled', 'AbortError');
          const token = await liveTryOnService.token(productId, session.controller.signal);
          if (!current()) throw new DOMException('Cancelled', 'AbortError');
          return token.apiKey;
        },
        remote => {
          if (!current()) { remote.getTracks().forEach(track => track.stop()); return; }
          if (session.remote && session.remote !== remote) session.remote.getTracks().forEach(track => track.stop()); session.remote = remote;
          const output = outputRef.current;
          if (!output) { fail('The live preview could not be displayed. Please retry.'); return; }
          output.srcObject = remote;
          void output.play().then(() => {
            if (!current()) return;
            clearTimeout(session.startupTimer); setPhase('streaming'); setStatus('Live preview connected. Your selected garment is being applied automatically.');
          }).catch(() => fail('The live video could not play. Please restart the preview.'));
        },
        state => { if (current() && (state === 'disconnected' || state === 'reconnecting')) fail('The live connection was interrupted. Start again to reconnect.'); });
      if (!current()) { connection.disconnect(); return; }
      session.connection = connection;
      const onError = () => fail('The live clothing service reported a problem. Please retry later.');
      const onEnded = () => fail('The provider ended this preview. Check service availability and try again later.');
      connection.on('error', onError); connection.on('sessionEnded', onEnded);
      session.detach = () => { connection.off('error', onError); connection.off('sessionEnded', onEnded); };
    } catch (cause) {
      if (current()) fail(cause instanceof DOMException && cause.name === 'NotAllowedError'
        ? 'Camera permission was denied. Allow access in your browser and retry.'
        : errorMessage(cause));
    }
  };
  return { outputRef, config, configError, phase, status, error, start, stop,
    active: ['preparing', 'permission', 'connecting', 'streaming'].includes(phase) };
}

import { useEffect, useRef, useState } from 'react';
import { TRY_ON } from '../../constants/tryon';
import { loadGarment } from '../../utils/tryon/garment';
import { garmentPlacement, manualPlacement } from '../../utils/tryon/placement';
import { createGarmentMesh, deformGarmentMesh } from '../../utils/tryon/mesh';
import { drawGarmentMesh } from '../../utils/tryon/render';
import { trackingStatus } from '../../utils/tryon/status';
import { smoothPlacement } from '../../utils/tryon/smoothing';
import type { BodyPoint, GarmentKind, GarmentMesh, GarmentPlacement, TrackingReply, TryOnPhase } from '../../types/tryon';

export function useVirtualTryOn(image: string, kind: GarmentKind = 'top') {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('Camera is off.');
  const [error, setError] = useState('');
  const [phase, setPhase] = useState<TryOnPhase>('idle');
  const [aspectRatio, setAspectRatio] = useState('4 / 3');
  const [scale, setScale] = useState(1);
  const [manual, setManual] = useState(false);
  const [verticalOffset, setVerticalOffset] = useState(0);
  const adjustmentRef = useRef({ scale, manual, verticalOffset });
  useEffect(() => { adjustmentRef.current = { scale, manual, verticalOffset }; }, [scale, manual, verticalOffset]);
  useEffect(() => {
    if (!active) return;
    let cancelled = false, busy = false, ready = false, animation = 0, dirty = true;
    let lastFrame = 0, lastVideoTime = -1, lastPoseTime = 0;
    let points: BodyPoint[] = [];
    const preparation = new AbortController();
    let cameraFrame: ImageBitmap | null = null;
    let previousPlacement: GarmentPlacement | null = null;
    let lastAdjustment = adjustmentRef.current;
    let stream: MediaStream | undefined;
    let worker: Worker | undefined;
    let garment: HTMLCanvasElement;
    let mesh: GarmentMesh;
    let trackingTimer: ReturnType<typeof setTimeout> | undefined;
    let startupTimer: ReturnType<typeof setTimeout> | undefined;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const resizePreview = () => {
      if (!video || !canvas || !video.videoWidth || !video.videoHeight) return;
      previousPlacement = null; dirty = true;
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      setAspectRatio(`${video.videoWidth} / ${video.videoHeight}`);
    };
    const stopTracker = () => {
      worker?.terminate(); worker = undefined; ready = false; busy = false;
      clearTimeout(trackingTimer); trackingTimer = undefined;
      clearTimeout(startupTimer); startupTimer = undefined;
      points = []; previousPlacement = null;
      cameraFrame?.close(); cameraFrame = null;
    };
    const cleanup = () => {
      cancelled = true; preparation.abort(); stopTracker(); cancelAnimationFrame(animation);
      video?.removeEventListener('resize', resizePreview);
      stream?.getTracks().forEach(track => track.stop());
      if (video) video.srcObject = null;
      canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    };
    const fail = (message: string) => {
      if (cancelled) return;
      setError(message); setPhase('error'); setStatus('Camera stopped.'); setActive(false); cleanup();
    };
    const watchTracking = () => {
      clearTimeout(trackingTimer);
      trackingTimer = setTimeout(() => {
        trackingTimer = undefined;
        if (!adjustmentRef.current.manual) fail('Body tracking stopped responding. Choose manual placement and restart the camera, or retry automatic tracking.');
      }, TRY_ON.trackingTimeout);
    };
    const draw = () => {
      if (!canvas || cancelled) return;
      const context = canvas.getContext('2d');
      if (!context) { fail('The preview canvas is unavailable. Please restart the camera.'); return; }
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (!adjustmentRef.current.manual && cameraFrame) context.drawImage(cameraFrame, 0, 0, canvas.width, canvas.height);
      const adjustment = adjustmentRef.current;
      const target = adjustment.manual ? manualPlacement(canvas.width, canvas.height, kind) : garmentPlacement(points, canvas.width, canvas.height, kind);
      const now = performance.now();
      const placement = adjustment.manual ? target : smoothPlacement(previousPlacement, target, now - lastPoseTime);
      previousPlacement = placement; lastPoseTime = now;
      setStatus(trackingStatus(kind, adjustment.manual, placement));
      if (!placement) return;
      if (!adjustment.manual) {
        const targets = deformGarmentMesh(mesh, placement, points, canvas.width, canvas.height, kind).map(point => ({
          x: placement.x + (point.x - placement.x) * adjustment.scale,
          y: placement.y + (point.y - placement.y) * adjustment.scale + adjustment.verticalOffset * canvas.height,
        }));
        drawGarmentMesh(context, garment, mesh, targets);
        return;
      }
      const width = placement.width * adjustment.scale, height = placement.height * adjustment.scale;
      context.save(); context.translate(placement.x, placement.y + adjustment.verticalOffset * canvas.height); context.rotate(placement.angle);
      context.drawImage(garment, -width / 2, kind === 'top' ? -height * TRY_ON.collarOffsetRatio : 0, width, height); context.restore();
    };
    const startTracker = () => {
      if (typeof Worker === 'undefined' || typeof createImageBitmap === 'undefined') {
        fail('Automatic tracking is unsupported in this browser. Select manual placement and restart the camera.'); return;
      }
      setPhase('tracking'); setStatus('Loading body tracking. You can select manual placement while it loads.');
      startupTimer = setTimeout(() => fail('Body tracking setup timed out. Choose manual placement and restart the camera.'), TRY_ON.startupTimeout);
      const trackingWorker = new Worker(new URL('../../workers/pose.worker.ts', import.meta.url), { type: 'module' });
      worker = trackingWorker;
      trackingWorker.onerror = () => { if (worker === trackingWorker) fail('Body tracking failed to load. Choose manual placement and restart the camera.'); };
      trackingWorker.onmessage = (event: MessageEvent<TrackingReply>) => {
        const reply = event.data;
        if (cancelled || worker !== trackingWorker || adjustmentRef.current.manual) { if (reply.kind === 'pose') reply.frame?.close(); return; }
        if (reply.kind === 'error') { fail(`${reply.message} Manual placement can be used without body tracking.`); return; }
        if (reply.kind === 'ready') { ready = true; setPhase('ready'); clearTimeout(startupTimer); watchTracking(); return; }
        busy = false; points = reply.points; cameraFrame?.close(); cameraFrame = reply.frame ?? null; dirty = true; watchTracking();
      };
      trackingWorker.postMessage({ kind: 'init', model: new URL(TRY_ON.model, window.location.href).href });
    };
    const tick = async (time: number) => {
      if (cancelled || !video) return;
      animation = requestAnimationFrame(tick);
      try {
        const adjustment = adjustmentRef.current;
        if (adjustment !== lastAdjustment) {
          if (adjustment.manual !== lastAdjustment.manual) {
            stopTracker();
            canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
            if (adjustment.manual) setPhase('ready');
          }
          dirty = true; lastAdjustment = adjustment;
        }
        if (adjustment.manual) {
          if (dirty) { draw(); dirty = false; }
          return;
        }
        if (!worker) startTracker();
        if (cancelled) return;
        if (ready && dirty) { draw(); dirty = false; }
        if (!ready || busy || time - lastFrame < TRY_ON.frameInterval || video.readyState < 2 || video.currentTime === lastVideoTime) return;
        busy = true; lastFrame = time; lastVideoTime = video.currentTime;
        let frame: ImageBitmap | undefined;
        const frameWorker = worker;
        try {
          frame = await createImageBitmap(video);
          if (cancelled || adjustmentRef.current.manual || frameWorker !== worker) { frame.close(); if (frameWorker === worker) busy = false; return; }
          frameWorker?.postMessage({ kind: 'frame', frame, timestamp: time }, [frame]);
        } catch { frame?.close(); fail('Camera frames could not be read. Select manual placement and restart the camera.'); }
      } catch { fail('Preview processing failed. Please restart the camera.'); }
    };
    const start = async () => {
      try {
        setError(''); setPhase('preparing'); setStatus(`Preparing your ${kind === 'top' ? 'shirt' : 'pants'} preview…`);
        startupTimer = setTimeout(() => fail('Preview setup timed out. Check camera permission and retry.'), TRY_ON.startupTimeout);
        if (!navigator.mediaDevices?.getUserMedia) { fail('Camera requires HTTPS or localhost and a supported browser.'); return; }
        try { garment = await loadGarment(image, kind, preparation.signal); mesh = createGarmentMesh(garment.width, garment.height); }
        catch { fail('This product photo could not be isolated safely. A garment-only image or a clear full-body catalog photo is needed; the original model will not be pasted onto your camera.'); return; }
        if (cancelled) return;
        setPhase('permission'); setStatus('Allow camera access in your browser to continue.');
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
        if (cancelled) { stream.getTracks().forEach(track => track.stop()); return; }
        if (!video || !canvas) throw new Error('Camera preview is unavailable.');
        stream.getVideoTracks().forEach(track => track.addEventListener('ended', () => fail('Camera disconnected. Please restart the preview.'), { once: true }));
        video.srcObject = stream; await video.play();
        if (cancelled) return;
        clearTimeout(startupTimer); resizePreview(); video.addEventListener('resize', resizePreview);
        if (adjustmentRef.current.manual) { setPhase('ready'); draw(); dirty = false; }
        else startTracker();
        if (!cancelled) animation = requestAnimationFrame(tick);
      } catch (cause) {
        fail(cause instanceof DOMException && cause.name === 'NotAllowedError'
          ? 'Camera permission was denied. Allow camera access in your browser and retry.'
          : 'Could not prepare this preview. Check your camera and product image, then retry.');
      }
    };
    const stopWhenHidden = () => { if (document.hidden) { setActive(false); setPhase('idle'); setStatus('Camera stopped while this tab was hidden.'); cleanup(); } };
    document.addEventListener('visibilitychange', stopWhenHidden);
    void start();
    return () => { cleanup(); document.removeEventListener('visibilitychange', stopWhenHidden); };
  }, [active, image, kind]);
  const stop = () => { setActive(false); setPhase('idle'); setStatus('Camera is off.'); };
  const resetAdjustments = () => { setScale(1); setVerticalOffset(0); };
  return { videoRef, canvasRef, aspectRatio, active, phase, resetAdjustments, status, error, scale, setScale, manual, setManual, verticalOffset, setVerticalOffset, start: () => setActive(true), stop };
}

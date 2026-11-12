import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCamera, FiX } from 'react-icons/fi';
import Modal from '../layout/Modal';
import { useDecartTryOn } from '../../hooks/tryon/useDecartTryOn';
import { useAuthStore } from '../../stores/auth/authStore';
import { DECART_PRIVACY_URL } from '../../constants/liveTryon';
import type { LiveTryOnProps } from '../../types/components/tryon';
export default function VirtualTryOn({ product, onClose, onUseLocal }: LiveTryOnProps) {
  const user = useAuthStore(state => state.user);
  const signedIn = useAuthStore(state => state.isAuthenticated && state.initialized);
  const live = useDecartTryOn(product.id, user?.id ?? null);
  const [consent, setConsent] = useState(false);
  const streaming = live.phase === 'streaming';
  const blockedReason = live.configError ? 'Service availability could not be checked. Close and reopen this preview to retry.'
    : !live.config ? 'Checking live service availability…'
    : !live.config.available ? 'Live try-on is unavailable because the store has not enabled the video service. Signing in or checking consent will not enable it.'
    : !signedIn ? 'Sign in to continue, then agree to live video processing.'
    : !consent ? 'Check the agreement box to enable Start live try-on.' : null;
  const actionClass = 'flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-40';
  return <Modal title={`Live try-on: ${product.name}`} onClose={onClose} wide>
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-5 py-4">
      <div><h2 className="text-xl font-semibold">Live try-on</h2><p className="mt-1 text-sm text-neutral-600">Your selected garment, applied automatically as you move</p></div>
      <button type="button" onClick={onClose} className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2"><FiX aria-hidden="true" />Close</button>
    </header>
    <div className="grid md:grid-cols-[minmax(0,1fr)_19rem]">
      <section aria-label="Live clothing preview" className="min-w-0 space-y-4 bg-neutral-50 p-5">
        <div className="relative min-h-64 w-full min-w-0 overflow-hidden rounded-xl bg-neutral-950" style={{ aspectRatio: '16 / 9' }}>
          <video ref={live.outputRef} autoPlay muted playsInline aria-label="Processed live garment preview" className={`absolute inset-0 h-full w-full object-contain ${streaming ? '' : 'invisible'}`} />
          {!streaming && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white">
            <FiCamera aria-hidden="true" className="size-8 text-neutral-300" />
            <h3 className="text-lg font-medium">{live.active ? 'Connecting live preview…' : 'See the selected clothes on you'}</h3>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-300">{live.active ? 'Your selected product image is applied automatically before the preview starts.' : 'Allow camera access and face the screen. No shopper photo upload or Generate step is needed.'}</p>
          </div>}
          {streaming && <span className="absolute left-3 top-3 rounded-md bg-black/80 px-3 py-1.5 text-xs text-white">Live · Decart</span>}
        </div>
        <p role="status" aria-live="polite" className="text-sm leading-relaxed">{live.active ? live.status : blockedReason ?? live.status}</p>
        {live.error && <p role="alert" className="text-sm leading-relaxed text-red-800">{live.error}</p>}
        {!live.active && live.config?.available && !signedIn ? (
          <Link to="/signin" onClick={onClose} className={actionClass}>Sign in to try on</Link>
        ) : (
          <button type="button" onClick={() => live.active ? live.stop() : void live.start(consent)} aria-describedby="live-try-on-requirements" disabled={!live.active && Boolean(blockedReason)} className={actionClass}>
            <FiCamera aria-hidden="true" />{live.active ? streaming ? 'Stop live try-on' : 'Cancel connection' : !live.config ? 'Checking live service…' : !live.config.available ? 'Live try-on unavailable' : live.phase === 'error' ? 'Retry live try-on' : 'Start live try-on'}
          </button>
        )}
        <p id="live-try-on-requirements" className="text-xs leading-relaxed text-neutral-600">{live.active ? 'You can stop the camera at any time.' : 'Requires an enabled live service, sign-in, and agreement to video processing.'}</p>
        {!live.active && <div className="space-y-2 border-t border-neutral-200 pt-4">
          <button type="button" onClick={onUseLocal} className="min-h-11 w-full rounded-lg border border-neutral-400 px-4 py-3 text-sm font-medium hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-4">Back to free on-device preview</button>
          <p className="text-xs leading-relaxed text-neutral-600">Free overlay that stays on your device; original clothes remain visible.</p>
        </div>}
      </section>
      <aside className="min-w-0 space-y-5 border-t border-neutral-200 p-5 md:border-l md:border-t-0">
        <div className="flex items-center gap-3 border-b border-neutral-200 pb-4"><img src={product.image} alt="Selected garment" className="h-24 w-20 shrink-0 rounded-lg bg-neutral-100 object-contain" /><div className="min-w-0"><p className="text-xs text-neutral-500">Selected item</p><h3 className="mt-1 break-words text-sm font-medium">{product.name}</h3></div></div>
        {!live.config && !live.configError && <p className="text-sm text-neutral-600">Checking live service availability…</p>}
        {live.configError && <p role="alert" className="text-sm text-red-800">{live.configError}</p>}
        {live.config && !live.config.available && <p className="rounded-lg border border-neutral-300 bg-neutral-50 p-3 text-sm">The store owner needs to enable the live video service before this feature can be used.</p>}
        {!signedIn && <p className="text-sm"><Link to="/signin" onClick={onClose} className="underline underline-offset-4">Sign in</Link> to start a live try-on session.</p>}
        <label className="flex items-start gap-3 text-sm leading-relaxed"><input type="checkbox" checked={consent} disabled={live.active} onChange={event => setConsent(event.target.checked)} className="mt-1 size-4 shrink-0 accent-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4" /><span>I agree to send my live camera video and the selected garment image to Decart for live try-on.</span></label>
        <p className="text-xs leading-relaxed text-neutral-600">Microphone access is off. Stop, Close, or leave the tab to end the connection. Decart processes the video externally under its <a href={DECART_PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="underline">privacy policy</a>.</p>
        {live.config && <p className="text-xs text-neutral-600">Each preview lasts up to {live.config.session_seconds} seconds.</p>}
        <p className="border-t border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-600">This is a generated appearance preview, not a size or physical-fit measurement. Garment details and body appearance can differ.</p>
      </aside>
    </div>
  </Modal>;
}

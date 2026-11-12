import Modal from '../layout/Modal';
import TryOnControls from './TryOnControls';
import { useVirtualTryOn } from '../../hooks/tryon/useVirtualTryOn';
import { useLiveTryOnAvailable } from '../../hooks/tryon/useLiveTryOnAvailable';
import type { LocalTryOnProps } from '../../types/components/tryon';

export default function LocalTryOn({ product, kind, onClose, onUseLive }: LocalTryOnProps) {
  const preview = useVirtualTryOn(product.image, kind);
  const liveAvailable = useLiveTryOnAvailable(product.id);
  return <Modal title={`On-device preview: ${product.name}`} onClose={onClose} wide>
    <header className="flex items-center justify-between gap-4 border-b border-neutral-200 p-5">
      <h2 className="text-xl font-semibold">On-device camera preview</h2>
      <button type="button" onClick={onClose} className="min-h-11 shrink-0 rounded-lg px-3 underline focus-visible:outline-2 focus-visible:outline-offset-4">Close</button>
    </header>
    <div className="grid md:grid-cols-[minmax(0,1fr)_19rem]">
      <section aria-label="On-device clothing preview" className="min-w-0 space-y-4 bg-neutral-50 p-5">
        <p className="text-sm leading-relaxed">Free and private: your camera stays on this device. This is an overlay that shows how the garment looks on you. It does not remove your current clothes or measure your size.</p>
        <div className="relative min-h-64 w-full min-w-0 overflow-hidden rounded-xl bg-neutral-950" style={{ aspectRatio: preview.aspectRatio }}>
          <video ref={preview.videoRef} autoPlay muted playsInline aria-label="Local camera" className="absolute inset-0 h-full w-full -scale-x-100 object-contain" />
          <canvas ref={preview.canvasRef} aria-label="Selected garment overlay" className="absolute inset-0 h-full w-full -scale-x-100 object-contain" />
          {!preview.active && <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-white">Start the camera to preview {product.name}.</p>}
        </div>
        <p role="status" aria-live="polite" className="text-sm">{preview.status}</p>
        {preview.error && <p role="alert" className="text-sm text-red-800">{preview.error}</p>}
        <button type="button" onClick={preview.active ? preview.stop : preview.start} className="min-h-11 w-full rounded-lg bg-neutral-900 px-4 py-3 text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4">{preview.active ? 'Stop camera' : 'Start camera'}</button>
        {liveAvailable && !preview.active && <button type="button" onClick={onUseLive} className="min-h-11 w-full rounded-lg border border-neutral-400 px-4 py-3 text-sm font-medium hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-4">Try realistic live preview</button>}
      </section>
      <aside className="min-w-0 space-y-5 border-t border-neutral-200 p-5 md:border-l md:border-t-0">
        <div className="flex items-center gap-3"><img src={product.image} alt="Selected garment" className="h-24 w-20 shrink-0 rounded-lg object-contain" /><p className="min-w-0 break-words text-sm font-medium">{product.name}</p></div>
        <p className="text-sm text-neutral-600">For a shirt preview, use a single visible clothing layer. Face the camera with your shoulders and hips visible. If tracking cannot start, choose manual placement and restart.</p>
        <TryOnControls kind={kind} enabled={preview.phase === 'ready'} manual={preview.manual} scale={preview.scale} verticalOffset={preview.verticalOffset} onManualChange={preview.setManual} onScaleChange={preview.setScale} onVerticalOffsetChange={preview.setVerticalOffset} onReset={preview.resetAdjustments} />
      </aside>
    </div>
  </Modal>;
}

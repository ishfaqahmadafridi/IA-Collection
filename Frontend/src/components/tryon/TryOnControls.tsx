import { FiRotateCcw } from 'react-icons/fi';
import type { TryOnControlsProps } from '../../types/components/tryon';
export default function TryOnControls({ kind, enabled, manual, scale, verticalOffset, onManualChange, onScaleChange, onVerticalOffsetChange, onReset }: TryOnControlsProps) {
  const label = kind === 'top' ? 'Shirt' : 'Pants';
  return <section aria-label="Garment adjustments" className="space-y-5">
    <div>
      <h3 className="text-base font-semibold">Adjust your preview</h3>
      <p className="mt-1 text-sm text-neutral-600">Make small changes to line up your clothing.</p>
    </div>
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-300 p-3 text-sm">
      <input type="checkbox" checked={manual} onChange={event => onManualChange(event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4" />
      <span><span className="block font-medium">Place {label.toLowerCase()} manually</span><span className="mt-1 block text-neutral-600">Use this if automatic tracking is unavailable. Move yourself into the centered garment.</span></span>
    </label>
    <fieldset disabled={!enabled} className="space-y-5 disabled:opacity-50">
      <legend className="sr-only">Garment size and position</legend>
      <div>
        <div className="mb-2 flex justify-between gap-3 text-sm"><label htmlFor="tryon-scale" className="font-medium">{label} scale</label><span aria-hidden="true" className="tabular-nums text-neutral-600">{Math.round(scale * 100)}%</span></div>
        <input id="tryon-scale" type="range" min="0.7" max="1.4" step="0.05" value={scale} aria-valuetext={`${Math.round(scale * 100)} percent`} onChange={event => onScaleChange(Number(event.target.value))} className="h-6 w-full cursor-pointer accent-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4" />
        <div aria-hidden="true" className="flex justify-between text-xs text-neutral-500"><span>Smaller</span><span>Larger</span></div>
      </div>
      <div>
        <label htmlFor="tryon-position" className="mb-2 block text-sm font-medium">{label} vertical position</label>
        <input id="tryon-position" type="range" min="-0.3" max="0.3" step="0.01" value={verticalOffset} aria-valuetext={verticalOffset === 0 ? 'Centered' : `${Math.round(Math.abs(verticalOffset) * 100)} percent ${verticalOffset < 0 ? 'up' : 'down'}`} onChange={event => onVerticalOffsetChange(Number(event.target.value))} className="h-6 w-full cursor-pointer accent-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4" />
        <div aria-hidden="true" className="flex justify-between text-xs text-neutral-500"><span>Higher</span><span>Lower</span></div>
      </div>
      <button type="button" onClick={onReset} className="flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"><FiRotateCcw aria-hidden="true" />Reset adjustments</button>
    </fieldset>
    {!enabled && <p className="text-xs text-neutral-600">Size and position become available when the camera preview is ready.</p>}
  </section>;
}

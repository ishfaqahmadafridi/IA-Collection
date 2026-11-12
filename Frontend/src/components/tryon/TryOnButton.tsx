import { useState } from 'react';
import type { VirtualTryOnProps } from '../../types/components/tryon';
import { useAuthStore } from '../../stores/auth/authStore';
import LocalTryOn from './LocalTryOn';
import VirtualTryOn from './VirtualTryOn';
type Mode = 'local' | 'live' | null;
// The free on-device preview opens first; the paid live service is opt-in.
export default function TryOnButton({ product }: Pick<VirtualTryOnProps, 'product'>) {
  const userId = useAuthStore(state => state.user?.id);
  const [mode, setMode] = useState<Mode>(null);
  const kind = product.try_on_kind;
  if (!product.image || !kind) return null;
  const close = () => setMode(null);
  return <>
    <button type="button" onClick={() => setMode('local')} className="border border-current rounded px-4 py-3 focus-visible:outline-2">Try it on with your camera</button>
    {mode === 'local' && <LocalTryOn key={product.id} product={product} kind={kind} onClose={close} onUseLive={() => setMode('live')} />}
    {mode === 'live' && <VirtualTryOn key={`${product.id}:${userId ?? 'guest'}`} product={product} onClose={close} onUseLocal={() => setMode('local')} />}
  </>;
}

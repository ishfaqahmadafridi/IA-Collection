import type { GarmentKind } from '../tryon';
import type { ApiProduct } from '../api';
export interface VirtualTryOnProps { product: ApiProduct; onClose: () => void }
export interface LocalTryOnProps extends VirtualTryOnProps { kind: GarmentKind; onUseLive: () => void }
export interface LiveTryOnProps extends VirtualTryOnProps { onUseLocal: () => void }
export interface TryOnControlsProps {
  kind: GarmentKind;
  enabled: boolean;
  manual: boolean;
  scale: number;
  verticalOffset: number;
  onManualChange: (manual: boolean) => void;
  onScaleChange: (scale: number) => void;
  onVerticalOffsetChange: (offset: number) => void;
  onReset: () => void;
}

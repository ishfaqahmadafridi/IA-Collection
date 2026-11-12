import type { RealTimeClient } from '@decartai/sdk';
export interface LiveTryOnConfig {
  available: boolean;
  provider: string;
  model: 'lucy-vton-3.6';
  session_seconds: number;
  requires_sign_in: boolean;
  garment_image: string;
  prompt: string;
}
export interface LiveTryOnToken { apiKey: string; expiresAt: string }
export type LiveTryOnPhase = 'idle' | 'preparing' | 'permission' | 'connecting' | 'streaming' | 'stopped' | 'error';
export interface LiveTryOnSession {
  controller: AbortController;
  local: MediaStream | null;
  remote: MediaStream | null;
  connection: RealTimeClient | null;
  startupTimer?: ReturnType<typeof setTimeout>;
  sessionTimer?: ReturnType<typeof setTimeout>;
  detach?: () => void;
}

export interface BodyPoint { x: number; y: number; visibility?: number }
export type TrackingReply = { kind: 'ready' } | { kind: 'pose'; points: BodyPoint[]; frame?: ImageBitmap } | { kind: 'error'; message: string };
export type TrackingRequest = { kind: 'init'; model: string } | { kind: 'frame'; frame: ImageBitmap; timestamp: number };
export interface GarmentPlacement { x: number; y: number; width: number; height: number; angle: number; estimated: boolean }

export type TryOnPhase = 'idle' | 'preparing' | 'permission' | 'tracking' | 'ready' | 'error';
export type GarmentKind = 'top' | 'bottom';
export interface MeshPoint { x: number; y: number }
export interface GarmentMesh { vertices: MeshPoint[]; triangles: [number, number, number][]; width: number; height: number }

export interface ClothingMask { width: number; height: number; data: Uint8Array<ArrayBuffer> }
export interface GarmentExtraction { mask: ClothingMask; points: BodyPoint[] }
export interface GarmentExtractionRequest { frame: ImageBitmap; model: string; clothingModel: string }
export type GarmentExtractionReply = { kind: 'result'; result: GarmentExtraction } | { kind: 'error' };

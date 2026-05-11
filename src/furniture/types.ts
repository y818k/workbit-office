import type { GridPosition, GridSize } from '../game/grid';

export type FurnitureKind = 'desk' | 'chair' | 'plant' | 'rug';
export type FurnitureRotation = 0 | 90;

export type FurnitureItem = {
  id: string;
  kind: FurnitureKind;
  name: string;
  position: GridPosition;
  size: GridSize;
  rotation: FurnitureRotation;
};

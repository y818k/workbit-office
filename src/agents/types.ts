import type { GridPosition } from '../game/grid';

export const AGENT_STATES = ['idle', 'thinking', 'editing', 'testing', 'waiting', 'error'] as const;

export type AgentState = (typeof AGENT_STATES)[number];

export type Agent = {
  id: string;
  name: string;
  position: GridPosition;
  deskId: string;
  state: AgentState;
};

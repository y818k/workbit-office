import type { Agent } from './types';

export const dummyAgents: Agent[] = [
  {
    id: 'agent-01',
    name: 'Agent 01',
    position: { x: 3, y: 5 },
    deskId: 'desk-01',
    state: 'idle'
  },
  {
    id: 'agent-02',
    name: 'Agent 02',
    position: { x: 8, y: 5 },
    deskId: 'desk-02',
    state: 'thinking'
  }
];

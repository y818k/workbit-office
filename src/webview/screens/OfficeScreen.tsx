import type { CSSProperties } from 'react';
import type { Agent } from '../../agents/types';
import { GRID_COLUMNS, GRID_ROWS } from '../../game/grid';
import type { FurnitureItem } from '../../furniture/types';
import type { TranslationKey } from '../../localization/strings';

type OfficeScreenProps = {
  agents: Agent[];
  furniture: FurnitureItem[];
  t: (key: TranslationKey) => string;
};

export function OfficeScreen({ agents, furniture, t }: OfficeScreenProps) {
  const cells = Array.from({ length: GRID_COLUMNS * GRID_ROWS }, (_, index) => index);

  return (
    <section className="screen office-screen" aria-label="Office screen">
      <header className="screen-header">
        <div>
          <p className="eyebrow">{t('nav.office')}</p>
          <h2>{t('appName')}</h2>
        </div>
        <p>{t('office.subtitle')}</p>
      </header>

      <div className="office-board-wrap">
        <div
          className="office-board"
          style={{ '--grid-columns': GRID_COLUMNS, '--grid-rows': GRID_ROWS } as CSSProperties}
        >
          <div className="grid-layer" aria-hidden="true">
            {cells.map((cell) => <span className="grid-cell" key={cell} />)}
          </div>
          <div className="furniture-layer">
            {furniture.map((item) => (
              <div
                className={`furniture furniture-${item.kind}`}
                key={item.id}
                style={{
                  gridColumn: `${item.position.x + 1} / span ${item.size.width}`,
                  gridRow: `${item.position.y + 1} / span ${item.size.height}`
                }}
                title={item.name}
              >
                <span className="furniture-top" />
                <span className="furniture-label">Desk</span>
              </div>
            ))}
          </div>
          <div className="agent-layer">
            {agents.map((agent) => (
              <div
                className={`agent agent-${agent.state}`}
                key={agent.id}
                style={{ gridColumn: agent.position.x + 1, gridRow: agent.position.y + 1 }}
              >
                <div className="speech-bubble">{t(`agent.${agent.state}`)}</div>
                <div className="agent-sprite" aria-hidden="true">
                  <span className="agent-face" />
                </div>
                <strong>{agent.name}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

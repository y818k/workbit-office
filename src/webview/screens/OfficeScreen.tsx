import type { CSSProperties } from 'react';
import type { Agent } from '../../agents/types';
import { GRID_COLUMNS, GRID_ROWS } from '../../game/grid';
import type { FurnitureItem } from '../../furniture/types';
import type { TranslationKey } from '../../localization/strings';

const FLOOR_TILE_SRC = getAssetSrc('room/floor/floor_wood_01.png');
const WALL_TILE_SOURCES = [
  getAssetSrc('room/wall/wall_top_01.png'),
  getAssetSrc('room/wall/wall_middle_01.png'),
  getAssetSrc('room/wall/wall_bottom_01.png')
] as const;
const WORKDESK_SRC = getAssetSrc('furniture/workdesk/workdesk_wood_01.png');

function getAssetSrc(path: string): string {
  const assetBase = document.querySelector<HTMLMetaElement>('meta[name="workbit-assets-base"]')?.content;

  if (assetBase) {
    return `${assetBase.replace(/\/$/, '')}/${path}`;
  }

  return `assets/${path}`;
}

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
          <div className="floor-layer" aria-hidden="true">
            {cells.map((cell) => (
              <img className="floor-tile" key={cell} src={FLOOR_TILE_SRC} alt="" draggable={false} />
            ))}
          </div>
          <div className="wall-layer" aria-hidden="true">
            {WALL_TILE_SOURCES.map((src, rowIndex) => (
              <div className="wall-row" key={src} style={{ gridRow: rowIndex + 1 }}>
                {Array.from({ length: GRID_COLUMNS }, (_, columnIndex) => (
                  <img
                    className="wall-tile"
                    key={`${src}-${columnIndex}`}
                    src={src}
                    alt=""
                    draggable={false}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="grid-layer" aria-hidden="true">
            {cells.map((cell) => <span className="grid-cell" key={cell} />)}
          </div>
          <div className="agent-layer">
            {agents.map((agent) => (
              <div
                className={`agent agent-${agent.state}`}
                key={agent.id}
                style={{ gridColumn: agent.position.x + 1, gridRow: agent.position.y + 1 }}
              >
                <div className="agent-sprite" aria-hidden="true">
                  <span className="agent-face" />
                </div>
                <strong>{agent.name}</strong>
              </div>
            ))}
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
                <img className="furniture-image" src={WORKDESK_SRC} alt={item.name} draggable={false} />
              </div>
            ))}
          </div>
          <div className="speech-layer">
            {agents.map((agent) => (
              <div
                className="speech-anchor"
                key={`${agent.id}-speech`}
                style={{ gridColumn: agent.position.x + 1, gridRow: agent.position.y + 1 }}
              >
                <div className="speech-bubble">{t(`agent.${agent.state}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

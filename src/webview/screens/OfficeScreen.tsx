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
const CELL_SIZE_PX = 64;
const RUG_EXTRA_HEIGHT_PX = 32;
const BOOKSHELF_IMAGE_STYLE: CSSProperties = { width: '176px', height: '163px' };

type FixedDecorItem = {
  id: string;
  name: string;
  kind: 'rug' | 'bookshelf' | 'plant';
  src: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
};

const FIXED_DECOR: FixedDecorItem[] = [
  {
    id: 'rug-blue-01',
    name: 'Blue Rug',
    kind: 'rug',
    src: getAssetSrc('room/rugs/rug_blue_01.png'),
    position: { x: 2, y: 5 },
    size: { width: 8, height: 3 }
  },
  {
    id: 'bookshelf-wood-01',
    name: 'Wood Bookshelf',
    kind: 'bookshelf',
    src: getAssetSrc('furniture/shelves/bookshelf_wood_01.png'),
    position: { x: 0, y: 2 },
    size: { width: 3, height: 2 }
  },
  {
    id: 'plant-pot-01',
    name: 'Potted Plant',
    kind: 'plant',
    src: getAssetSrc('furniture/plants/plant_pot_01.png'),
    position: { x: 11, y: 7 },
    size: { width: 1, height: 2 }
  }
];

function getFixedDecorStyle(item: FixedDecorItem): CSSProperties {
  return {
    position: 'absolute',
    left: item.position.x * CELL_SIZE_PX,
    top: item.position.y * CELL_SIZE_PX,
    width: item.size.width * CELL_SIZE_PX,
    height: item.size.height * CELL_SIZE_PX + (item.kind === 'rug' ? RUG_EXTRA_HEIGHT_PX : 0),
    zIndex: item.kind === 'rug' ? 0 : 1
  };
}

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
          <div className="fixed-decor-layer" aria-hidden="true">
            {FIXED_DECOR.map((item) => (
              <div
                className={`fixed-decor fixed-decor-${item.kind}`}
                key={item.id}
                style={getFixedDecorStyle(item)}
              >
                <img
                  className="fixed-decor-image"
                  src={item.src}
                  alt=""
                  draggable={false}
                  style={item.kind === 'bookshelf' ? BOOKSHELF_IMAGE_STYLE : undefined}
                />
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

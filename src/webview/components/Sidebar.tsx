import type { TranslationKey } from '../../localization/strings';

export type ScreenId = 'office' | 'layout' | 'shop' | 'settings';

type NavItem = {
  id: ScreenId;
  labelKey: TranslationKey;
  icon: string;
};

const navItems: NavItem[] = [
  { id: 'office', labelKey: 'nav.office', icon: '▦' },
  { id: 'layout', labelKey: 'nav.layout', icon: '⌗' },
  { id: 'shop', labelKey: 'nav.shop', icon: '◈' },
  { id: 'settings', labelKey: 'nav.settings', icon: '⚙' }
];

type SidebarProps = {
  activeScreen: ScreenId;
  onScreenChange: (screen: ScreenId) => void;
  t: (key: TranslationKey) => string;
};

export function Sidebar({ activeScreen, onScreenChange, t }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Workbit Office navigation">
      <div className="brand">
        <div className="brand-mark">W</div>
        <div>
          <h1>{t('appName')}</h1>
          <p>v0.1</p>
        </div>
      </div>
      <nav className="nav-list">
        {navItems.map((item) => (
          <button
            className={`nav-button ${activeScreen === item.id ? 'is-active' : ''}`}
            key={item.id}
            onClick={() => onScreenChange(item.id)}
            type="button"
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{t(item.labelKey)}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

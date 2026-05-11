export type Language = 'en' | 'ja';

export type TranslationKey =
  | 'appName'
  | 'nav.office'
  | 'nav.layout'
  | 'nav.shop'
  | 'nav.settings'
  | 'status.officeLevel'
  | 'status.points'
  | 'status.activeAgents'
  | 'office.subtitle'
  | 'layout.title'
  | 'layout.description'
  | 'shop.title'
  | 'shop.description'
  | 'settings.title'
  | 'settings.language'
  | 'settings.description'
  | 'agent.idle'
  | 'agent.thinking'
  | 'agent.editing'
  | 'agent.testing'
  | 'agent.waiting'
  | 'agent.error';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    appName: 'Workbit Office',
    'nav.office': 'Office',
    'nav.layout': 'Layout',
    'nav.shop': 'Shop',
    'nav.settings': 'Settings',
    'status.officeLevel': 'Office Lv.1',
    'status.points': '0 pt',
    'status.activeAgents': 'Active Agents 2/2',
    'office.subtitle': 'A cozy pixel workspace for your coding agents.',
    'layout.title': 'Layout',
    'layout.description': 'Furniture placement tools will live here. Drag saving is intentionally not implemented in v0.1.',
    'shop.title': 'Shop',
    'shop.description': 'Future furniture and office upgrades will be previewed here.',
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.description': 'Choose the webview language. This v0.1 setting is kept in memory only.',
    'agent.idle': 'Idle',
    'agent.thinking': 'Thinking',
    'agent.editing': 'Editing',
    'agent.testing': 'Testing',
    'agent.waiting': 'Waiting',
    'agent.error': 'Needs help'
  },
  ja: {
    appName: 'Workbit Office',
    'nav.office': 'Office',
    'nav.layout': 'Layout',
    'nav.shop': 'Shop',
    'nav.settings': 'Settings',
    'status.officeLevel': 'Office Lv.1',
    'status.points': '0 pt',
    'status.activeAgents': 'Active Agents 2/2',
    'office.subtitle': 'AIエージェントのための、居心地のよいピクセルワークスペース。',
    'layout.title': 'Layout',
    'layout.description': '家具配置ツールはここに追加予定です。v0.1ではドラッグ保存は未実装です。',
    'shop.title': 'Shop',
    'shop.description': '将来の家具やオフィスアップグレードをここで表示します。',
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.description': 'Webviewの言語を選択します。v0.1ではメモリ上のみの切替です。',
    'agent.idle': '待機中',
    'agent.thinking': '思考中',
    'agent.editing': '編集中',
    'agent.testing': 'テスト中',
    'agent.waiting': '待機待ち',
    'agent.error': '確認必要'
  }
};

export function translate(language: Language, key: TranslationKey): string {
  return translations[language][key];
}

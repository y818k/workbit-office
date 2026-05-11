import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { assertOutputs, root, runInstalledTool } from './build-utils.mjs';

if (runInstalledTool('vite', ['build'], ['dist/webview/index.html'])) {
  process.exit(0);
}

const outDir = join(root, 'dist', 'webview');
const assetsDir = join(outDir, 'assets');
mkdirSync(assetsDir, { recursive: true });

const css = readFileSync(join(root, 'src', 'webview', 'styles', 'app.css'), 'utf8');
writeFileSync(join(assetsDir, 'style.css'), css);

const js = String.raw`
const AGENT_STATES = ['idle', 'thinking', 'editing', 'testing', 'waiting', 'error'];
const GRID_COLUMNS = 12;
const GRID_ROWS = 10;
const translations = {
  en: {
    appName: 'Workbit Office', officeSubtitle: 'A cozy pixel workspace for your coding agents.',
    layoutDescription: 'Furniture placement tools will live here. Drag saving is intentionally not implemented in v0.1.',
    shopDescription: 'Future furniture and office upgrades will be previewed here.',
    settingsDescription: 'Choose the webview language. This v0.1 setting is kept in memory only.',
    idle: 'Idle', thinking: 'Thinking', editing: 'Editing', testing: 'Testing', waiting: 'Waiting', error: 'Needs help'
  },
  ja: {
    appName: 'Workbit Office', officeSubtitle: 'AIエージェントのための、居心地のよいピクセルワークスペース。',
    layoutDescription: '家具配置ツールはここに追加予定です。v0.1ではドラッグ保存は未実装です。',
    shopDescription: '将来の家具やオフィスアップグレードをここで表示します。',
    settingsDescription: 'Webviewの言語を選択します。v0.1ではメモリ上のみの切替です。',
    idle: '待機中', thinking: '思考中', editing: '編集中', testing: 'テスト中', waiting: '待機待ち', error: '確認必要'
  }
};
let language = 'en';
let screen = 'office';
let agents = [
  { id: 'agent-01', name: 'Agent 01', position: { x: 3, y: 4 }, state: 'idle' },
  { id: 'agent-02', name: 'Agent 02', position: { x: 8, y: 4 }, state: 'thinking' }
];
const furniture = [
  { id: 'desk-01', position: { x: 2, y: 3 }, size: { width: 2, height: 1 } },
  { id: 'desk-02', position: { x: 7, y: 3 }, size: { width: 2, height: 1 } }
];
const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : undefined;
const root = document.getElementById('root');
const t = (key) => translations[language][key] ?? key;
function navButton(id, label, icon) {
  return '<button class="nav-button '+(screen===id?'is-active':'')+'" data-screen="'+id+'"><span class="nav-icon">'+icon+'</span><span>'+label+'</span></button>';
}
function shell(content) {
  root.innerHTML = '<div class="app-shell"><aside class="sidebar"><div class="brand"><div class="brand-mark">W</div><div><h1>'+t('appName')+'</h1><p>v0.1</p></div></div><nav class="nav-list">'+navButton('office','Office','▦')+navButton('layout','Layout','⌗')+navButton('shop','Shop','◈')+navButton('settings','Settings','⚙')+'</nav></aside><main class="main-panel">'+content+'<footer class="status-bar"><span>Office Lv.1</span><span>0 pt</span><span>Active Agents 2/2</span></footer></main></div>';
  document.querySelectorAll('[data-screen]').forEach((button) => button.addEventListener('click', () => { screen = button.dataset.screen; render(); }));
}
function renderOffice() {
  const cells = Array.from({ length: GRID_COLUMNS * GRID_ROWS }, () => '<span class="grid-cell"></span>').join('');
  const desks = furniture.map((item) => '<div class="furniture furniture-desk" style="grid-column:'+(item.position.x+1)+' / span '+item.size.width+';grid-row:'+(item.position.y+1)+' / span '+item.size.height+'"><span class="furniture-top"></span><span class="furniture-label">Desk</span></div>').join('');
  const agentNodes = agents.map((agent) => '<div class="agent agent-'+agent.state+'" style="grid-column:'+(agent.position.x+1)+';grid-row:'+(agent.position.y+1)+'"><div class="speech-bubble">'+t(agent.state)+'</div><div class="agent-sprite"><span class="agent-face"></span></div><strong>'+agent.name+'</strong></div>').join('');
  shell('<section class="screen office-screen"><header class="screen-header"><div><p class="eyebrow">Office</p><h2>'+t('appName')+'</h2></div><p>'+t('officeSubtitle')+'</p></header><div class="office-board-wrap"><div class="office-board" style="--grid-columns:'+GRID_COLUMNS+';--grid-rows:'+GRID_ROWS+'"><div class="grid-layer">'+cells+'</div><div class="furniture-layer">'+desks+'</div><div class="agent-layer">'+agentNodes+'</div></div></div></section>');
}
function renderUtility(title, description, extra = '') {
  shell('<section class="screen utility-screen"><p class="eyebrow">'+title+'</p><h2>'+title+'</h2><p>'+description+'</p>'+extra+'</section>');
}
function render() {
  if (screen === 'office') return renderOffice();
  if (screen === 'layout') return renderUtility('Layout', t('layoutDescription'), '<div class="card-grid"><article class="info-card"><span class="card-icon">▤</span><h3>Warm Oak Desk</h3><p>2 x 1 grid · 0°</p></article><article class="info-card"><span class="card-icon">▤</span><h3>Warm Oak Desk</h3><p>2 x 1 grid · 0°</p></article></div>');
  if (screen === 'shop') return renderUtility('Shop', t('shopDescription'), '<div class="card-grid"><article class="info-card shop-card"><span class="card-icon">◈</span><h3>Chair</h3><p>Coming soon</p></article><article class="info-card shop-card"><span class="card-icon">◈</span><h3>Plant</h3><p>Coming soon</p></article></div>');
  renderUtility('Settings', t('settingsDescription'), '<label class="field-label" for="language-select">Language</label><select id="language-select"><option value="en">English</option><option value="ja">日本語</option></select>');
  const select = document.getElementById('language-select');
  select.value = language;
  select.addEventListener('change', () => { language = select.value; vscode?.postMessage({ type: 'languageChanged', language }); render(); });
}
window.addEventListener('message', (event) => { if (event.data?.type === 'hydrate') { language = event.data.language; render(); } });
setInterval(() => { agents = agents.map((agent, index) => ({ ...agent, state: AGENT_STATES[(AGENT_STATES.indexOf(agent.state) + index + 1) % AGENT_STATES.length] })); if (screen === 'office') render(); }, 3200);
vscode?.postMessage({ type: 'ready' });
render();
`;
writeFileSync(join(assetsDir, 'main.js'), js);
writeFileSync(join(outDir, 'index.html'), '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Workbit Office</title><link rel="stylesheet" href="assets/style.css"></head><body><div id="root"></div><script src="assets/main.js"></script></body></html>');
assertOutputs(['dist/webview/index.html'], 'fallback webview build');
console.warn('generated a fallback static webview bundle. Install or fix Vite to enable the React + Vite production build.');

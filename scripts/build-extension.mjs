import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { assertOutputs, root, runInstalledTool } from './build-utils.mjs';

const extensionBuiltWithTsc = runInstalledTool('tsc', ['-p', 'tsconfig.extension.json'], ['dist/extension/extension.js']);

if (!extensionBuiltWithTsc) {
  writeFallbackExtensionBundle();
}

function writeFallbackExtensionBundle() {
  console.warn('[build:extension] Running fallback CommonJS extension build.');

  const outDir = join(root, 'dist', 'extension');
mkdirSync(outDir, { recursive: true });
const js = String.raw`
const fs = require('node:fs');
const path = require('node:path');
const vscode = require('vscode');
const VIEW_TYPE = 'workbitOffice.office';
function activate(context) {
  const disposable = vscode.commands.registerCommand('workbitOffice.open', () => {
    WorkbitOfficePanel.createOrShow(context.extensionUri);
  });
  context.subscriptions.push(disposable);
}
function deactivate() {}
class WorkbitOfficePanel {
  static currentPanel;
  constructor(panel, extensionUri) {
    this.panel = panel;
    this.extensionUri = extensionUri;
    this.panel.webview.html = this.getHtmlForWebview();
    this.panel.onDidDispose(() => this.dispose(), undefined);
    this.panel.webview.onDidReceiveMessage((message) => {
      if (message.type === 'ready') {
        this.panel.webview.postMessage({ type: 'hydrate', language: 'en' });
      }
    });
  }
  static createOrShow(extensionUri) {
    const column = vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;
    if (WorkbitOfficePanel.currentPanel) {
      WorkbitOfficePanel.currentPanel.panel.reveal(column);
      return;
    }
    const panel = vscode.window.createWebviewPanel(VIEW_TYPE, 'Workbit Office', column, {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist', 'webview')]
    });
    WorkbitOfficePanel.currentPanel = new WorkbitOfficePanel(panel, extensionUri);
  }
  dispose() { WorkbitOfficePanel.currentPanel = undefined; }
  getHtmlForWebview() {
    const webviewDistUri = vscode.Uri.joinPath(this.extensionUri, 'dist', 'webview');
    const indexPath = path.join(webviewDistUri.fsPath, 'index.html');
    if (!fs.existsSync(indexPath)) return '<!doctype html><html lang="en"><body><h1>Workbit Office</h1><p>Webview assets are missing. Run <code>npm run build</code> and reopen the command.</p></body></html>';
    const nonce = getNonce();
    const cspSource = this.panel.webview.cspSource;
    const webviewDistPath = webviewDistUri.fsPath;
    let html = fs.readFileSync(indexPath, 'utf8');
    html = html.replace(/(src|href)="(?!https?:|data:|#)([^"]+)"/g, (_match, attribute, resourcePath) => {
      const cleanPath = resourcePath.replace(/^\.\//, '');
      const resourceUri = vscode.Uri.file(path.join(webviewDistPath, cleanPath));
      return attribute + '="' + this.panel.webview.asWebviewUri(resourceUri) + '"';
    });
    html = html.replace(/<script /g, '<script nonce="' + nonce + '" ');
    html = html.replace('</head>', '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src ' + cspSource + ' data:; style-src ' + cspSource + ' \'unsafe-inline\'; script-src \'nonce-' + nonce + '\'; font-src ' + cspSource + ';"></head>');
    return html;
  }
}
function getNonce() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < 32; i += 1) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
module.exports = { activate, deactivate };
`;
writeFileSync(join(outDir, 'extension.js'), js);
assertOutputs(['dist/extension/extension.js'], 'fallback extension build');
console.warn('[build:extension] Generated fallback CommonJS extension bundle at dist/extension/extension.js. Install or fix TypeScript to enable the normal TypeScript build.');
}

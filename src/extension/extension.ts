import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import type { WebviewMessage } from '../shared/messages';

const VIEW_TYPE = 'workbitOffice.office';

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand('workbitOffice.open', () => {
    WorkbitOfficePanel.createOrShow(context.extensionUri);
  });

  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  // Nothing to clean up for v0.1.
}

class WorkbitOfficePanel {
  private static currentPanel: WorkbitOfficePanel | undefined;

  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel;
    this.extensionUri = extensionUri;

    this.panel.webview.html = this.getHtmlForWebview();
    this.panel.onDidDispose(() => this.dispose(), undefined);
    this.panel.webview.onDidReceiveMessage((message: WebviewMessage) => {
      if (message.type === 'ready') {
        this.panel.webview.postMessage({ type: 'hydrate', language: 'en' });
      }
    });
  }

  static createOrShow(extensionUri: vscode.Uri): void {
    const column = vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;

    if (WorkbitOfficePanel.currentPanel) {
      WorkbitOfficePanel.currentPanel.panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      VIEW_TYPE,
      'Workbit Office',
      column,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist', 'webview')]
      }
    );

    WorkbitOfficePanel.currentPanel = new WorkbitOfficePanel(panel, extensionUri);
  }

  private dispose(): void {
    WorkbitOfficePanel.currentPanel = undefined;
  }

  private getHtmlForWebview(): string {
    const webviewDistUri = vscode.Uri.joinPath(this.extensionUri, 'dist', 'webview');
    const indexPath = path.join(webviewDistUri.fsPath, 'index.html');

    if (!fs.existsSync(indexPath)) {
      return this.getMissingBuildHtml();
    }

    const nonce = getNonce();
    const cspSource = this.panel.webview.cspSource;
    const webviewDistPath = webviewDistUri.fsPath;

    let html = fs.readFileSync(indexPath, 'utf8');
    html = html.replace(
      /(src|href)="(?!https?:|data:|#)([^"]+)"/g,
      (_match, attribute: 'src' | 'href', resourcePath: string) => {
        const cleanPath = resourcePath.replace(/^\.\//, '');
        const resourceUri = vscode.Uri.file(path.join(webviewDistPath, cleanPath));
        return `${attribute}="${this.panel.webview.asWebviewUri(resourceUri)}"`;
      }
    );
    html = html.replace(/<script /g, `<script nonce="${nonce}" `);
    const webviewAssetsUri = this.panel.webview.asWebviewUri(vscode.Uri.joinPath(webviewDistUri, 'assets'));

    html = html.replace(
      '</head>',
      `<meta name="workbit-assets-base" content="${webviewAssetsUri}"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${cspSource} data:; style-src ${cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; font-src ${cspSource};"></head>`
    );

    return html;
  }

  private getMissingBuildHtml(): string {
    return `<!doctype html><html lang="en"><body><h1>Workbit Office</h1><p>Webview assets are missing. Run <code>npm run build</code> and reopen the command.</p></body></html>`;
  }
}

function getNonce(): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < 32; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

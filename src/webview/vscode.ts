type VsCodeApi = {
  postMessage(message: unknown): void;
};

declare const acquireVsCodeApi: (() => VsCodeApi) | undefined;

export const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : undefined;

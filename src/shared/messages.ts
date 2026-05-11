export type WebviewMessage =
  | { type: 'ready' }
  | { type: 'languageChanged'; language: 'en' | 'ja' };

export type ExtensionMessage =
  | { type: 'hydrate'; language: 'en' | 'ja' };

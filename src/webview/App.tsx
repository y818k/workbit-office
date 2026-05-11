import { useEffect, useMemo, useState } from 'react';
import { AGENT_STATES, type Agent } from '../agents/types';
import { dummyAgents } from '../agents/dummyAgents';
import { starterFurniture } from '../furniture/catalog';
import { translate, type Language, type TranslationKey } from '../localization/strings';
import type { ExtensionMessage } from '../shared/messages';
import { Sidebar, type ScreenId } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';
import { OfficeScreen } from './screens/OfficeScreen';
import { LayoutScreen } from './screens/LayoutScreen';
import { ShopScreen } from './screens/ShopScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { vscode } from './vscode';

export function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('office');
  const [language, setLanguage] = useState<Language>('en');
  const [agents, setAgents] = useState<Agent[]>(dummyAgents);

  const t = useMemo(() => (key: TranslationKey) => translate(language, key), [language]);

  useEffect(() => {
    vscode?.postMessage({ type: 'ready' });

    const listener = (event: MessageEvent<ExtensionMessage>) => {
      if (event.data.type === 'hydrate') {
        setLanguage(event.data.language);
      }
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setAgents((currentAgents) =>
        currentAgents.map((agent, index) => {
          const currentIndex = AGENT_STATES.indexOf(agent.state);
          const offset = index + 1;
          return {
            ...agent,
            state: AGENT_STATES[(currentIndex + offset) % AGENT_STATES.length]
          };
        })
      );
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    vscode?.postMessage({ type: 'languageChanged', language: nextLanguage });
  };

  return (
    <div className="app-shell">
      <Sidebar activeScreen={activeScreen} onScreenChange={setActiveScreen} t={t} />
      <main className="main-panel">
        {activeScreen === 'office' && <OfficeScreen agents={agents} furniture={starterFurniture} t={t} />}
        {activeScreen === 'layout' && <LayoutScreen furniture={starterFurniture} t={t} />}
        {activeScreen === 'shop' && <ShopScreen t={t} />}
        {activeScreen === 'settings' && (
          <SettingsScreen language={language} onLanguageChange={handleLanguageChange} t={t} />
        )}
        <StatusBar t={t} />
      </main>
    </div>
  );
}

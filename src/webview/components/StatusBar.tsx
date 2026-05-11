import type { TranslationKey } from '../../localization/strings';

type StatusBarProps = {
  t: (key: TranslationKey) => string;
};

export function StatusBar({ t }: StatusBarProps) {
  return (
    <footer className="status-bar">
      <span>{t('status.officeLevel')}</span>
      <span>{t('status.points')}</span>
      <span>{t('status.activeAgents')}</span>
    </footer>
  );
}

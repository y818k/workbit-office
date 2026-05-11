import type { Language, TranslationKey } from '../../localization/strings';

type SettingsScreenProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

export function SettingsScreen({ language, onLanguageChange, t }: SettingsScreenProps) {
  return (
    <section className="screen utility-screen settings-screen">
      <p className="eyebrow">{t('nav.settings')}</p>
      <h2>{t('settings.title')}</h2>
      <p>{t('settings.description')}</p>
      <label className="field-label" htmlFor="language-select">
        {t('settings.language')}
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(event) => onLanguageChange(event.target.value as Language)}
      >
        <option value="en">English</option>
        <option value="ja">日本語</option>
      </select>
    </section>
  );
}

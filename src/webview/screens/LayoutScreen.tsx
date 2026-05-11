import type { FurnitureItem } from '../../furniture/types';
import type { TranslationKey } from '../../localization/strings';

type LayoutScreenProps = {
  furniture: FurnitureItem[];
  t: (key: TranslationKey) => string;
};

export function LayoutScreen({ furniture, t }: LayoutScreenProps) {
  return (
    <section className="screen utility-screen">
      <p className="eyebrow">{t('nav.layout')}</p>
      <h2>{t('layout.title')}</h2>
      <p>{t('layout.description')}</p>
      <div className="card-grid">
        {furniture.map((item) => (
          <article className="info-card" key={item.id}>
            <span className="card-icon">▤</span>
            <h3>{item.name}</h3>
            <p>{item.size.width} x {item.size.height} grid · {item.rotation}°</p>
          </article>
        ))}
      </div>
    </section>
  );
}

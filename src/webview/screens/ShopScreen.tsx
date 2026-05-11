import type { TranslationKey } from '../../localization/strings';

type ShopScreenProps = {
  t: (key: TranslationKey) => string;
};

const previewItems = ['Chair', 'Plant', 'Lamp'];

export function ShopScreen({ t }: ShopScreenProps) {
  return (
    <section className="screen utility-screen">
      <p className="eyebrow">{t('nav.shop')}</p>
      <h2>{t('shop.title')}</h2>
      <p>{t('shop.description')}</p>
      <div className="card-grid">
        {previewItems.map((item) => (
          <article className="info-card shop-card" key={item}>
            <span className="card-icon">◈</span>
            <h3>{item}</h3>
            <p>Coming soon</p>
          </article>
        ))}
      </div>
    </section>
  );
}

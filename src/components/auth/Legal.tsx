import { Language } from '@/lib/types';
import { getTranslations } from 'next-intl/server';

export const Legal = async ({ locale }: { locale: Language }) => {
  const t = await getTranslations({ locale, namespace: 'legal' });

  const lastUpdated = '08-04-2026';

  const intellectualPropertyItems = t.raw('intellectualProperty.items') as string[];
  const liabilityItems = t.raw('liability.items') as string[];

  return (
    <main className="privacy-page">
      <h1>{t('title')}</h1>
      <p>
        {t('lastUpdated')} <time dateTime={lastUpdated}>{lastUpdated}</time>
      </p>

      <section className="privacy-section">
        <h2>{t('editor.title')}</h2>
        <p>{t('editor.intro')}</p>

        <div>
          <p>
            <strong>{t('editor.nameLabel')}</strong> {t('editor.name')}
          </p>
          <p>
            <strong>{t('editor.emailLabel')}</strong>{' '}
            <a className="public-link" href={`mailto:${t('editor.email')}`}>
              {t('editor.email')}
            </a>
          </p>
          <p>
            <strong>{t('editor.siteLabel')}</strong>{' '}
            <a className="public-link" href={t('editor.site')} target="_blank" rel="noreferrer">
              {t('editor.site')}
            </a>
          </p>
          <p>
            <strong>{t('editor.publisherLabel')}</strong> {t('editor.publisher')}
          </p>
        </div>
      </section>

      <section className="privacy-section">
        <h2>{t('hosting.title')}</h2>
        <p>{t('hosting.intro')}</p>

        <div>
          <p>
            <strong>{t('hosting.providerLabel')}</strong> {t('hosting.provider')}
          </p>
          <p>
            <strong>{t('hosting.addressLabel')}</strong> {t('hosting.address')}
          </p>
          <p>
            <strong>{t('hosting.siteLabel')}</strong>{' '}
            <a className="public-link" href={t('hosting.site')} target="_blank" rel="noreferrer">
              {t('hosting.site')}
            </a>
          </p>
        </div>

        <p>{t('hosting.note')}</p>
      </section>

      <section className="privacy-section">
        <h2>{t('intellectualProperty.title')}</h2>
        <p>{t('intellectualProperty.intro')}</p>
        <ul>
          {intellectualPropertyItems.map((item, idx) => (
            <li key={`ip-${idx}`}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="privacy-section">
        <h2>{t('liability.title')}</h2>
        <p>{t('liability.intro')}</p>
        <ul>
          {liabilityItems.map((item, idx) => (
            <li key={`liability-${idx}`}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="privacy-section">
        <h2>{t('personalData.title')}</h2>
        <p>{t('personalData.p1')}</p>
        <p>
          {t('personalData.contactLabel')}{' '}
          <a className="public-link" href={`mailto:${t('editor.email')}`}>
            {t('editor.email')}
          </a>
        </p>
      </section>
    </main>
  );
};

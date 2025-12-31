'use client';

import { useTranslations } from 'next-intl';

export const Privacy = () => {
  const t = useTranslations('privacy');

  const lastUpdated = '31-12-2025';

  // Lists via t.raw()
  const accountItems = t.raw('data.account.items') as string[];
  const appItems = t.raw('data.app.items') as string[];
  const purposes = t.raw('purposes.items') as string[];
  const legalBases = t.raw('legalBases.items') as string[];
  const visibilityItems = t.raw('visibility.items') as string[];
  const vendors = t.raw('vendors.items') as string[];
  const securityItems = t.raw('security.items') as string[];
  const rightsItems = t.raw('rights.items') as string[];

  return (
    <main className="privacy-page">
      <h1>{t('title')}</h1>
      <p>
        {t('lastUpdated')} <time dateTime={lastUpdated}>{lastUpdated}</time>
      </p>

      <section className="privacy-section">
        <h2>{t('controller.title')}</h2>
        <p>{t('controller.intro')}</p>

        <div>
          <p>
            <strong>{t('controller.responsibleLabel')}</strong> {t('controller.responsibleValue')}
          </p>
          <p>
            <strong>{t('controller.contactLabel')}</strong>{' '}
            <a className="public-link" href={`mailto:${t('controller.contactEmail')}`}>
              {t('controller.contactEmail')}
            </a>
          </p>
          <p>
            <strong>{t('controller.siteLabel')}</strong>{' '}
            <a
              className="public-link"
              href={t('controller.siteUrl')}
              target="_blank"
              rel="noreferrer"
            >
              {t('controller.siteUrl')}
            </a>
          </p>
        </div>

        <p>{t('controller.note')}</p>
      </section>

      <section className="privacy-section">
        <h2>{t('data.title')}</h2>
        <p>{t('data.intro')}</p>

        <h3>{t('data.account.title')}</h3>
        <ul>
          {accountItems.map((item, idx) => (
            <li key={`account-${idx}`}>{item}</li>
          ))}
        </ul>

        <h3>{t('data.app.title')}</h3>
        <p>{t('data.app.lead')}</p>
        <ul>
          {appItems.map((item, idx) => (
            <li key={`app-${idx}`}>{item}</li>
          ))}
        </ul>

        <p>{t('data.app.funNote')}</p>
        <p>{t('data.noHiddenCollection')}</p>
      </section>

      <section className="privacy-section">
        <h2>{t('purposes.title')}</h2>
        <p>{t('purposes.intro')}</p>
        <ul>
          {purposes.map((item, idx) => (
            <li key={`purpose-${idx}`}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="privacy-section">
        <h2>{t('legalBases.title')}</h2>
        <p>{t('legalBases.intro')}</p>
        <ul>
          {legalBases.map((item, idx) => (
            <li key={`legal-${idx}`}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="privacy-section">
        <h2>{t('visibility.title')}</h2>
        <ul>
          {visibilityItems.map((item, idx) => (
            <li key={`vis-${idx}`}>{item}</li>
          ))}
        </ul>

        <h3>{t('vendors.title')}</h3>
        <p>{t('vendors.intro')}</p>
        <ul>
          {vendors.map((item, idx) => (
            <li key={`vendor-${idx}`}>{item}</li>
          ))}
        </ul>
        <p>{t('vendors.note')}</p>
      </section>

      <section className="privacy-section">
        <h2>{t('cookies.title')}</h2>
        <p>{t('cookies.necessary')}</p>
        <p>{t('cookies.noMarketing')}</p>
        <p>{t('cookies.changeNote')}</p>
      </section>

      <section className="privacy-section">
        <h2>{t('security.title')}</h2>
        <p>{t('security.intro')}</p>
        <ul>
          {securityItems.map((item, idx) => (
            <li key={`sec-${idx}`}>{item}</li>
          ))}
        </ul>
        <p>{t('security.note')}</p>
      </section>

      <section className="privacy-section">
        <h2>{t('retention.title')}</h2>
        <p>{t('retention.p1')}</p>
        <p>{t('retention.p2')}</p>
      </section>

      <section className="privacy-section">
        <h2>{t('rights.title')}</h2>
        <p>{t('rights.intro')}</p>
        <ul>
          {rightsItems.map((item, idx) => (
            <li key={`right-${idx}`}>{item}</li>
          ))}
        </ul>
        <p>
          {t('rights.contactLabel')}{' '}
          <a className="public-link" href={`mailto:${t('controller.contactEmail')}`}>
            {t('controller.contactEmail')}
          </a>
        </p>
        <p>{t('rights.selfServiceNote')}</p>
      </section>

      <section className="privacy-section">
        <h2>{t('changes.title')}</h2>
        <p>{t('changes.p1')}</p>
      </section>
    </main>
  );
};

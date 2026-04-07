'use client';

import { useLocale, useTranslations } from 'next-intl';

export default function Discover() {
  const t = useTranslations();
  const lang = useLocale();

  return (
    <main className="discover-page">
      <div className="discover-overlay">
        <section className="discover-section discover-hero">
          <img className="discover-logo" src="/icons/aster-icon-192.png" alt="Aster icon" />
          <h2 className="discover-title">{t('discover.hero.title')}</h2>
          <p className="discover-subtitle">{t('discover.hero.subtitle')}</p>

          <div className="discover-actions">
            <a className="discover-button" href="/">
              {t('discover.hero.primaryAction')}
            </a>
          </div>
        </section>

        <section className="discover-section discover-text-block">
          <h2>{t('discover.problem.title')}</h2>
          <p>{t('discover.problem.paragraph1')}</p>
          <p>{t('discover.problem.paragraph2')}</p>
        </section>

        <section className="discover-section discover-text-block">
          <h2>{t('discover.solution.title')}</h2>
          <p>{t('discover.solution.paragraph1')}</p>
          <p>{t('discover.solution.paragraph2')}</p>
        </section>

        <section className="discover-section discover-features">
          <h2>{t('discover.features.title')}</h2>

          <div className="discover-feature-grid">
            <article className="discover-card">
              <h3>{t('discover.features.animals.title')}</h3>
              <p>{t('discover.features.animals.description')}</p>
            </article>

            <article className="discover-card">
              <h3>{t('discover.features.fosterLocations.title')}</h3>
              <p>{t('discover.features.fosterLocations.description')}</p>
            </article>

            <article className="discover-card">
              <h3>{t('discover.features.treasury.title')}</h3>
              <p>{t('discover.features.treasury.description')}</p>
            </article>

            <article className="discover-card">
              <h3>{t('discover.features.notifications.title')}</h3>
              <p>{t('discover.features.notifications.description')}</p>
            </article>
          </div>
        </section>

        <section id="screenshots" className="discover-section discover-screenshots">
          <h2>{t('discover.screenshots.title')}</h2>
          <div className="discover-screenshot-list">
            <figure className="discover-screenshot-card">
              <img
                src={`/screenshots/animal_${lang}.png`}
                alt={t('discover.screenshots.animalDetails.alt')}
                height={780}
              />
              <figcaption>{t('discover.screenshots.animalDetails.caption')}</figcaption>
            </figure>

            <figure className="discover-screenshot-card">
              <img
                src={`/screenshots/foster_${lang}.png`}
                alt={t('discover.screenshots.fosterLocations.alt')}
                height={780}
              />
              <figcaption>{t('discover.screenshots.fosterLocations.caption')}</figcaption>
            </figure>

            <figure className="discover-screenshot-card">
              <img
                src={`/screenshots/treasury_${lang}.png`}
                alt={t('discover.screenshots.treasury.alt')}
                height={780}
              />
              <figcaption>{t('discover.screenshots.treasury.caption')}</figcaption>
            </figure>

            <figure className="discover-screenshot-card">
              <img
                src={`/screenshots/notif_${lang}.png`}
                alt={t('discover.screenshots.notifications.alt')}
                height={780}
              />
              <figcaption>{t('discover.screenshots.notifications.caption')}</figcaption>
            </figure>
          </div>
        </section>

        <section className="discover-section discover-text-block">
          <h2>{t('discover.philosophy.title')}</h2>
          <p>{t('discover.philosophy.paragraph1')}</p>
          <p>{t('discover.philosophy.paragraph2')}</p>
        </section>

        <section className="discover-section discover-cta">
          <h2>{t('discover.cta.title')}</h2>
          <p>{t('discover.cta.paragraph1')}</p>

          <div className="discover-actions">
            <a className="discover-button" href="/">
              {t('discover.cta.primaryAction')}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

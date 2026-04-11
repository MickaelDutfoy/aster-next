import { Link } from '@/i18n/routing';
import { Language } from '@/lib/types';
import { getTranslations } from 'next-intl/server';

export default async function Discover({ locale }: { locale: Language }) {
  const t = await getTranslations({ locale, namespace: '' });

  return (
    <main className="discover-page">
      <div className="discover-overlay">
        <section className="discover-section discover-hero">
          <img className="discover-logo" src="/icons/aster-icon-192.png" alt="Aster icon" />
          <h2 className="discover-title">{t('discover.hero.title1')}</h2>
          <h2 className="discover-title">{t('discover.hero.title2')}</h2>
          <p className="discover-subtitle">{t('discover.hero.subtitle1')}</p>
          <p className="discover-subtitle">{t('discover.hero.subtitle2')}</p>

          <div className="discover-actions">
            <Link className="discover-button" href="/">
              {t('discover.hero.primaryAction')}
            </Link>
          </div>
        </section>

        <section className="discover-section discover-text-block">
          <h2>{t('discover.problem.title')}</h2>
          <p>{t('discover.problem.paragraph1')}</p>
          <p>{t('discover.problem.paragraph2')}</p>
          <p>{t('discover.problem.paragraph3')}</p>
        </section>

        <section className="discover-section discover-text-block">
          <h2>{t('discover.solution.title')}</h2>
          <p>{t('discover.solution.paragraph1')}</p>
          <p>{t('discover.solution.paragraph2')}</p>
          <p>{t('discover.solution.paragraph3')}</p>
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

        <section className="discover-section discover-screenshots">
          <h2>{t('discover.screenshots.title')}</h2>
          <div className="discover-screenshot-list">
            <figure className="discover-screenshot-card">
              <img
                src={`/screenshots/animal_${locale}.png`}
                alt={t('discover.screenshots.animalDetails.alt')}
                height={780}
              />
              <figcaption>{t('discover.screenshots.animalDetails.caption')}</figcaption>
            </figure>

            <figure className="discover-screenshot-card">
              <img
                src={`/screenshots/foster_${locale}.png`}
                alt={t('discover.screenshots.fosterLocations.alt')}
                height={780}
              />
              <figcaption>{t('discover.screenshots.fosterLocations.caption')}</figcaption>
            </figure>

            <figure className="discover-screenshot-card">
              <img
                src={`/screenshots/treasury_${locale}.png`}
                alt={t('discover.screenshots.treasury.alt')}
                height={780}
              />
              <figcaption>{t('discover.screenshots.treasury.caption')}</figcaption>
            </figure>

            <figure className="discover-screenshot-card">
              <img
                src={`/screenshots/notif_${locale}.png`}
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
          <p>{t('discover.philosophy.paragraph3')}</p>
        </section>

        <section className="discover-section discover-cta">
          <h2>{t('discover.cta.title')}</h2>
          <p>{t('discover.cta.paragraph1')}</p>

          <div className="discover-actions">
            <Link className="discover-button" href="/">
              {t('discover.cta.primaryAction')}
            </Link>
          </div>
        </section>
        <section className="discover-section discover-legal">
          <div className="links-line">
            <span>{t('discover.usefulLinks')} </span>
            <Link href="/legal">{t('legal.links.link')}</Link> •{' '}
            <Link href="/privacy">{t('privacy.links.linkCapped')}</Link>
          </div>
          <div className="links-line">
            <span>{t('legal.personalData.contactLabel')} </span>
            <Link href={`mailto:${t('legal.editor.email')}`} target="_blank">
              {t('legal.editor.email')}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

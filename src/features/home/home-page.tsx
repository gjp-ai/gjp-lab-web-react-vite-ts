import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { i18n } from '@/shared/i18n/i18n';
import { buildToolVersions, type TechnologyId, technologies } from './technologies';

const applicationStack = [{ technology: 'react' }, { technology: 'router' }] as const;
const interfaceStack = [
  { technology: 'shadcn' },
  { technology: 'base' },
  { technology: 'tailwind' },
  { technology: 'lucide' },
] as const;
const workspace = [
  { technology: 'node' },
  { technology: 'pnpm' },
  { technology: 'biome' },
  { technology: 'husky' },
  { technology: 'lintStaged' },
] as const;

function BrandIcon({ technology }: { readonly technology: TechnologyId }) {
  const brand = technologies[technology];
  const [failed, setFailed] = useState(false);
  return (
    <span className="stack-brand-icon" aria-hidden="true">
      {'logo' in brand && !failed ? (
        <img
          src={brand.logo}
          alt=""
          width="36"
          height="36"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{'emoji' in brand ? brand.emoji : brand.name.slice(0, 2)}</span>
      )}
    </span>
  );
}

function Technology({
  technology,
  name,
  role,
}: {
  readonly technology: TechnologyId;
  readonly name?: string;
  readonly role?: string | undefined;
}) {
  const brand = technologies[technology];
  const version = 'version' in brand ? brand.version : undefined;
  const { t } = useTranslation('home', { i18n });
  return (
    <li>
      <a className="stack-technology" href={brand.href} target="_blank" rel="noopener noreferrer">
        <BrandIcon technology={technology} />
        <span className="stack-technology-copy">
          <span>{name ?? brand.name}</span>
          <small className="stack-version">{version ?? t('localSource')}</small>
          <small className="stack-technology-description">
            {role ?? t(`technologyDescriptions.${technology}`)}
          </small>
        </span>
        <span className="sr-only">{t('opensNewTab')}</span>
      </a>
    </li>
  );
}

export default function HomePage() {
  const { t } = useTranslation('home', { i18n });
  return (
    <section className="stack-home" aria-labelledby="stack-home-title">
      <header className="stack-home-heading">
        <p className="eyebrow" lang="en">
          GJP LAB / FOUNDATION
        </p>
        <h1 id="stack-home-title">{t('title')}</h1>
        <p className="stack-home-intro">{t('intro')}</p>
      </header>

      <figure className="stack-layers" aria-labelledby="stack-caption">
        <figcaption id="stack-caption" className="sr-only">
          {t('description')}
        </figcaption>

        <section className="stack-layer" aria-labelledby="application-title">
          <h2 id="application-title" className="stack-layer-label">
            <span aria-hidden="true">01</span> {t('application')}
          </h2>
          <ul className="stack-application">
            {applicationStack.map((technology) => (
              <Technology key={technology.technology} {...technology} />
            ))}
          </ul>
        </section>

        <section className="stack-layer" aria-labelledby="interface-title">
          <h2 id="interface-title" className="stack-layer-label">
            <span aria-hidden="true">02</span> {t('interface')}
          </h2>
          <ul className="stack-interface">
            {interfaceStack.map((technology) => (
              <Technology key={technology.technology} {...technology} />
            ))}
          </ul>
        </section>

        <section className="stack-layer" aria-labelledby="data-title">
          <h2 id="data-title" className="stack-layer-label">
            <span aria-hidden="true">03</span> {t('data')}
          </h2>
          <ul className="stack-data">
            <Technology technology="react" name="React State" role={t('clientState')} />
            <Technology technology="zustand" />
            <Technology technology="query" />
            <Technology technology="ky" />
            <Technology technology="i18next" />
            <Technology technology="reactI18next" />
          </ul>
        </section>

        <section className="stack-layer" aria-labelledby="build-title">
          <h2 id="build-title" className="stack-layer-label">
            <span aria-hidden="true">04</span> {t('build')}
          </h2>
          <ol className="stack-build" aria-label={t('pipeline')}>
            <Technology technology="typescript" />
            <li className="stack-build-engine">
              <ArrowRight className="stack-flow-arrow" aria-hidden="true" />
              <div className="stack-vite">
                <a
                  className="stack-vite-link"
                  href={technologies.vite.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BrandIcon technology="vite" />
                  <span className="stack-technology-copy">
                    <strong>Vite</strong>
                    <small className="stack-version">{technologies.vite.version}</small>
                    <small className="stack-technology-description">{t('buildEngine')}</small>
                  </span>
                  <span className="sr-only">{t('opensNewTab')}</span>
                </a>
                <div className="stack-vite-tools">
                  <a
                    className="stack-build-tool"
                    href="https://oxc.rs"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={t('bundled', { version: buildToolVersions.rolldown })}
                  >
                    <span>Oxc</span>
                    <small className="stack-version">{t('bundledLabel')}</small>
                    <span className="sr-only">
                      {t('bundled', { version: buildToolVersions.rolldown })}
                    </span>
                    <small>{t('transform')}</small>
                    <span className="sr-only">{t('opensNewTab')}</span>
                  </a>
                  <ArrowRight className="stack-tool-arrow" aria-hidden="true" />
                  <a
                    className="stack-build-tool"
                    href="https://rolldown.rs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Rolldown</span>
                    <small className="stack-version">{buildToolVersions.rolldown}</small>
                    <small>{t('bundle')}</small>
                    <span className="sr-only">{t('opensNewTab')}</span>
                  </a>
                </div>
                <span className="sr-only">Oxc transforms source; Rolldown bundles it.</span>
              </div>
            </li>
            <li className="stack-build-output">
              <ArrowRight className="stack-flow-arrow" aria-hidden="true" />
              <div className="stack-output-card">
                <strong>{t('assets')}</strong>
                <ul className="stack-output-formats" aria-label={t('assetFormats')}>
                  <li>HTML</li>
                  <li>CSS</li>
                  <li>JS</li>
                </ul>
                <small className="sr-only">
                  {t('webStandards')} · {t('browserOutput')}
                </small>
              </div>
            </li>
          </ol>
        </section>

        <section className="stack-layer" aria-labelledby="workspace-title">
          <h2 id="workspace-title" className="stack-layer-label">
            <span aria-hidden="true">05</span> {t('workspace')}
          </h2>
          <ul className="stack-workspace">
            {workspace.map((technology) => (
              <Technology key={technology.technology} {...technology} />
            ))}
          </ul>
        </section>

        <section className="stack-layer" aria-labelledby="testing-title">
          <h2 id="testing-title" className="stack-layer-label">
            <span aria-hidden="true">06</span> {t('testing')}
          </h2>
          <ul className="stack-testing">
            <Technology technology="jest" role={t('testingAndCoverage')} />
            <Technology technology="testingLibrary" role={t('componentTesting')} />
            <Technology technology="msw" role={t('mocking')} />
          </ul>
        </section>
      </figure>
    </section>
  );
}

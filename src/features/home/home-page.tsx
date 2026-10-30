import {
  ArrowRight,
  Atom,
  ChartNoAxesColumn,
  CheckCheck,
  Component,
  Database,
  Feather,
  FileCode2,
  FlaskConical,
  GitBranch,
  Globe,
  Languages,
  Layers3,
  type LucideIcon,
  Navigation,
  Network,
  Package,
  Store,
  Terminal,
  TestTubeDiagonal,
  Wind,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { i18n } from '@/shared/i18n/i18n';

const applicationStack = [
  { name: 'React', version: '19', icon: Atom },
  { name: 'TanStack Router', version: '1', icon: Navigation },
] as const;

const interfaceStack = [
  { name: 'shadcn/ui', icon: Component },
  { name: 'Base UI', version: '1', icon: Layers3 },
  { name: 'Tailwind CSS', version: '4', icon: Wind },
  { name: 'Lucide React', version: '1', icon: Feather },
] as const;

const workspace = [
  { name: 'Node.js', version: '24+', icon: Terminal },
  { name: 'pnpm', version: '12+', icon: Package },
  { name: 'Biome', version: '2', icon: CheckCheck },
  { name: 'Husky', version: '9', icon: GitBranch },
  { name: 'lint-staged', version: '17', icon: CheckCheck },
] as const;

function Technology({
  name,
  version,
  icon: Icon,
}: {
  readonly name: string;
  readonly version?: string;
  readonly icon: LucideIcon;
}) {
  return (
    <li className="stack-technology">
      <Icon aria-hidden="true" />
      <span>{name}</span>
      {version && <small className="stack-version">{version}</small>}
    </li>
  );
}

export default function HomePage() {
  const { t } = useTranslation('home', { i18n });
  return (
    <section className="stack-home" aria-labelledby="stack-home-title">
      <header className="stack-home-heading">
        <div className="stack-heading-top">
          <p className="eyebrow" lang="en">
            GJP LAB / FOUNDATION
          </p>
          <label className="stack-language">
            <Languages aria-hidden="true" />
            <select
              aria-label={t('language')}
              value={i18n.resolvedLanguage ?? 'en'}
              onChange={(event) => {
                void i18n.changeLanguage(event.currentTarget.value);
              }}
            >
              <option value="en" lang="en">
                English
              </option>
              <option value="zh" lang="zh">
                中文
              </option>
            </select>
          </label>
        </div>
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
              <Technology key={technology.name} {...technology} />
            ))}
          </ul>
        </section>

        <section className="stack-layer" aria-labelledby="interface-title">
          <h2 id="interface-title" className="stack-layer-label">
            <span aria-hidden="true">02</span> {t('interface')}
          </h2>
          <ul className="stack-interface">
            {interfaceStack.map((technology) => (
              <Technology key={technology.name} {...technology} />
            ))}
          </ul>
        </section>

        <section className="stack-layer" aria-labelledby="data-title">
          <h2 id="data-title" className="stack-layer-label">
            <span aria-hidden="true">03</span> {t('data')}
          </h2>
          <ul className="stack-testing">
            <li>
              <span className="stack-test-role">{t('clientState')}</span>
              <ul className="stack-workspace">
                <Technology name="React State" icon={Atom} />
                <Technology name="Zustand" version="5" icon={Store} />
              </ul>
            </li>
            <li>
              <span className="stack-test-role">{t('serverState')}</span>
              <ul className="stack-workspace">
                <Technology name="TanStack Query" version="5" icon={Database} />
              </ul>
            </li>
            <li>
              <span className="stack-test-role">{t('http')}</span>
              <ul className="stack-workspace">
                <Technology name="Ky" version="2" icon={Network} />
              </ul>
            </li>
            <li>
              <span className="stack-test-role">{t('internationalization')}</span>
              <ul className="stack-workspace">
                <Technology name="i18next" version="26" icon={Globe} />
                <Technology name="react-i18next" version="17" icon={Languages} />
              </ul>
            </li>
          </ul>
        </section>

        <section className="stack-layer" aria-labelledby="build-title">
          <h2 id="build-title" className="stack-layer-label">
            <span aria-hidden="true">04</span> {t('build')}
          </h2>
          <ol className="stack-build" aria-label={t('pipeline')}>
            <li className="stack-build-source">
              <FileCode2 aria-hidden="true" />
              <span>TypeScript</span>
              <small className="stack-version">7</small>
            </li>
            <li className="stack-build-engine">
              <ArrowRight className="stack-flow-arrow" aria-hidden="true" />
              <div className="stack-vite">
                <div>
                  <Zap aria-hidden="true" />
                  <strong>Vite</strong>
                  <small className="stack-version">8</small>
                </div>
                <p>
                  <span>Oxc</span>
                  <ArrowRight aria-hidden="true" />
                  <span>Rolldown</span>
                </p>
                <span className="sr-only">Oxc transforms source; Rolldown bundles it.</span>
              </div>
            </li>
            <li className="stack-build-output">
              <ArrowRight className="stack-flow-arrow" aria-hidden="true" />
              <span>
                {t('assets')}
                <small>HTML · CSS · JS</small>
              </span>
            </li>
          </ol>
        </section>

        <section className="stack-layer" aria-labelledby="workspace-title">
          <h2 id="workspace-title" className="stack-layer-label">
            <span aria-hidden="true">05</span> {t('workspace')}
          </h2>
          <ul className="stack-workspace">
            {workspace.map((technology) => (
              <Technology key={technology.name} {...technology} />
            ))}
          </ul>
        </section>

        <section className="stack-layer" aria-labelledby="testing-title">
          <h2 id="testing-title" className="stack-layer-label">
            <span aria-hidden="true">06</span> {t('testing')}
          </h2>
          <ul className="stack-testing">
            <li>
              <span className="stack-test-role">{t('unitTesting')}</span>
              <span className="stack-technology">
                <FlaskConical aria-hidden="true" />
                Jest<small className="stack-version">30</small>
              </span>
            </li>
            <li>
              <span className="stack-test-role">{t('componentTesting')}</span>
              <span className="stack-technology">
                <TestTubeDiagonal aria-hidden="true" />
                React Testing Library<small className="stack-version">16</small>
              </span>
            </li>
            <li>
              <span className="stack-test-role">{t('coverage')}</span>
              <span className="stack-technology">
                <ChartNoAxesColumn aria-hidden="true" />
                Jest
              </span>
            </li>
            <li>
              <span className="stack-test-role">{t('mocking')}</span>
              <span className="stack-technology">
                <Network aria-hidden="true" />
                MSW<small className="stack-version">3</small>
              </span>
            </li>
          </ul>
        </section>
      </figure>
    </section>
  );
}

import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

export const i18n = createInstance();

export const i18nReady = i18n.use(initReactI18next).init({
  initAsync: false,
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['en', 'zh'],
  defaultNS: 'home',
  resources: {
    en: {
      home: {
        title: 'The stack, at a glance.',
        intro: 'One architecture. Six clear layers.',
        language: 'Language',
        application: 'Application',
        interface: 'Interface',
        data: 'State & data',
        build: 'Build',
        workspace: 'Workspace',
        testing: 'Testing',
        clientState: 'Client state',
        serverState: 'Server state',
        http: 'HTTP client',
        internationalization: 'Internationalization',
        unitTesting: 'Unit testing',
        componentTesting: 'Component testing',
        coverage: 'Code coverage',
        mocking: 'API mocking',
        pipeline: 'Build pipeline, from typed source to static assets',
        assets: 'Static assets',
        description:
          'React and TanStack Router form the application. The interface uses shadcn/ui, Base UI, Tailwind CSS, and Lucide React. React State and Zustand own client state; TanStack Query owns server state; Ky handles HTTP. i18next and react-i18next provide translations. Vite uses Oxc and Rolldown to produce static assets. Node.js, pnpm, Biome, Husky, and lint-staged support development. Jest, React Testing Library, and MSW support testing.',
      },
    },
    zh: {
      home: {
        title: '技术架构，一目了然。',
        intro: '一个架构，六个清晰层次。',
        language: '语言',
        application: '应用',
        interface: '界面',
        data: '状态与数据',
        build: '构建',
        workspace: '开发工具',
        testing: '测试',
        clientState: '客户端状态',
        serverState: '服务端状态',
        http: 'HTTP 客户端',
        internationalization: '国际化',
        unitTesting: '单元测试',
        componentTesting: '组件测试',
        coverage: '代码覆盖率',
        mocking: 'API 模拟',
        pipeline: '从类型化源码到静态资源的构建流程',
        assets: '静态资源',
        description:
          'React 和 TanStack Router 构成应用。界面使用 shadcn/ui、Base UI、Tailwind CSS 和 Lucide React。React State 与 Zustand 管理客户端状态，TanStack Query 管理服务端状态，Ky 处理 HTTP。i18next 和 react-i18next 提供翻译。Vite 使用 Oxc 和 Rolldown 生成静态资源。Node.js、pnpm、Biome、Husky 和 lint-staged 支持开发。Jest、React Testing Library 与 MSW 支持测试。',
      },
    },
  },
  interpolation: { escapeValue: false },
});

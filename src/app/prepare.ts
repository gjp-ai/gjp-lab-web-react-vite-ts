import { i18nReady } from '@/shared/i18n/i18n';

export async function prepareApplication(
  enableMocks = import.meta.env.VITE_API_MOCKING === 'true',
) {
  await i18nReady;
  if (import.meta.env.DEV && enableMocks) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    });
  }
}

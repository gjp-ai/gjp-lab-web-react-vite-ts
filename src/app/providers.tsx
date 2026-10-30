import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { AppearanceProvider } from '@/features/appearance/components/appearance-provider';
import { i18n } from '@/shared/i18n/i18n';
import { queryClient } from './query-client';

export function AppProviders({ children }: { readonly children: ReactNode }) {
  useEffect(() => {
    function synchronizeLanguage() {
      document.documentElement.lang = i18n.resolvedLanguage ?? 'en';
      document.documentElement.dir = i18n.dir();
    }
    synchronizeLanguage();
    i18n.on('languageChanged', synchronizeLanguage);
    return () => {
      i18n.off('languageChanged', synchronizeLanguage);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <AppearanceProvider>{children}</AppearanceProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

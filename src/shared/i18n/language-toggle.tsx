import { Tooltip } from '@base-ui/react/tooltip';
import { CaseUpper, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';
import { i18n } from './i18n';

export function LanguageToggle() {
  const { t } = useTranslation('home', { i18n });
  const chinese = i18n.resolvedLanguage === 'zh';
  const Icon = chinese ? Languages : CaseUpper;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        render={
          <Button
            type="button"
            variant="ghost"
            className="appearance-trigger"
            lang={chinese ? 'zh' : 'en'}
            aria-label={t('language')}
            title={t('switchLanguage')}
            onClick={() => {
              void i18n.changeLanguage(chinese ? 'en' : 'zh');
            }}
          >
            <Icon aria-hidden="true" />
          </Button>
        }
      />
      <Tooltip.Portal>
        <Tooltip.Positioner side="right" sideOffset={12} className="menu-tooltip-positioner">
          <Tooltip.Popup lang={chinese ? 'zh' : 'en'} className="menu-tooltip">
            {t('switchLanguage')}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

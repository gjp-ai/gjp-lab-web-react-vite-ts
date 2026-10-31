import { AppearanceSettings } from '@/features/appearance/components/appearance-settings';
import { ModeToggle } from '@/features/appearance/components/mode-toggle';
import { LanguageToggle } from '@/shared/i18n/language-toggle';

export function MenuSettings() {
  return (
    <div className="menu-settings">
      <LanguageToggle />
      <ModeToggle />
      <AppearanceSettings compact />
    </div>
  );
}

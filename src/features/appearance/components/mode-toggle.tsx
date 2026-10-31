import { Tooltip } from '@base-ui/react/tooltip';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useAppearance } from './appearance-provider';

export function ModeToggle() {
  const { appearance, update } = useAppearance();
  const dark = appearance.mode === 'dark';
  const Icon = dark ? Moon : Sun;
  const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        render={
          <Button
            type="button"
            variant="ghost"
            className="appearance-trigger"
            aria-label="Dark mode"
            aria-pressed={dark}
            title={label}
            onClick={() => update({ ...appearance, mode: dark ? 'light' : 'dark' })}
          >
            <Icon aria-hidden="true" />
          </Button>
        }
      />
      <Tooltip.Portal>
        <Tooltip.Positioner side="right" sideOffset={12} className="menu-tooltip-positioner">
          <Tooltip.Popup lang="en" className="menu-tooltip">
            {label}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

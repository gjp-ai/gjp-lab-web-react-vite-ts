import { Dialog } from '@base-ui/react/dialog';
import { Tooltip } from '@base-ui/react/tooltip';
import { Monitor, Moon, Palette, Sun, X } from 'lucide-react';
import { useId, useRef } from 'react';
import { accents, type Mode } from '@/features/appearance/model/appearance';
import { Button } from '../../../shared/ui/button';
import { useAppearance } from './appearance-provider';

const modes = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
] satisfies { id: Mode; label: string; icon: typeof Sun }[];

export function AppearanceSettings({ compact = false }: { readonly compact?: boolean }) {
  const { appearance, update } = useAppearance();
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <Dialog.Root>
      <Tooltip.Root>
        <Tooltip.Trigger
          disabled={!compact}
          render={
            <Dialog.Trigger
              render={
                <Button
                  ref={triggerRef}
                  type="button"
                  variant="ghost"
                  className="appearance-trigger"
                  aria-label="Appearance"
                >
                  <Palette aria-hidden="true" />
                  {!compact && <span>Appearance</span>}
                </Button>
              }
            />
          }
        />
        <Tooltip.Portal>
          <Tooltip.Positioner side="right" sideOffset={12} className="menu-tooltip-positioner">
            <Tooltip.Popup className="menu-tooltip">Appearance</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Dialog.Portal>
        <Dialog.Backdrop className="drawer-backdrop" />
        <Dialog.Popup
          lang="en"
          className="appearance-dialog"
          finalFocus={() => {
            if (triggerRef.current?.getClientRects().length) return triggerRef.current;
            return (
              Array.from(
                document.querySelectorAll<HTMLButtonElement>('button[aria-label="Appearance"]'),
              ).find((element) => element.getClientRects().length > 0) ?? false
            );
          }}
        >
          <div className="appearance-heading">
            <Dialog.Title>Appearance</Dialog.Title>
            <Dialog.Close
              render={
                <Button
                  type="button"
                  variant="ghost"
                  className="sidebar-toggle"
                  aria-label="Close appearance"
                >
                  <X aria-hidden="true" />
                </Button>
              }
            />
          </div>
          <Dialog.Description className="appearance-description">
            Make this space yours. Changes apply immediately.
          </Dialog.Description>
          <fieldset className="appearance-fieldset">
            <legend>Mode</legend>
            <div className="mode-options">
              {modes.map(({ id: mode, label, icon: Icon }) => (
                <label className="appearance-option" key={mode}>
                  <input
                    type="radio"
                    name={`${id}-mode`}
                    value={mode}
                    checked={appearance.mode === mode}
                    onChange={() => update({ ...appearance, mode })}
                  />
                  <Icon aria-hidden="true" className="size-4" />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="appearance-fieldset">
            <legend>Accent color</legend>
            <div className="accent-options">
              {accents.map((accent) => (
                <label className="appearance-option" key={accent}>
                  <input
                    type="radio"
                    name={`${id}-accent`}
                    value={accent}
                    checked={appearance.accent === accent}
                    onChange={() => update({ ...appearance, accent })}
                  />
                  <span className="accent-swatch" data-accent={accent} aria-hidden="true" />
                  <span className="capitalize">{accent}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="appearance-footer">
            <Button
              type="button"
              variant="outline"
              className="appearance-reset"
              onClick={() => update({ mode: 'system', accent: 'mint' })}
            >
              Reset appearance
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

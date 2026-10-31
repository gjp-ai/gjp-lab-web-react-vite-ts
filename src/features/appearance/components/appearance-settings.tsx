import { Dialog } from '@base-ui/react/dialog';
import { Tooltip } from '@base-ui/react/tooltip';
import { Palette, X } from 'lucide-react';
import { useId, useRef } from 'react';
import { accents } from '@/features/appearance/model/appearance';
import { Button } from '../../../shared/ui/button';
import { useAppearance } from './appearance-provider';

export function AppearanceSettings({ compact = false }: { readonly compact?: boolean }) {
  const { appearance, update } = useAppearance();
  const label = 'Accent color';
  const tooltip = `Accent color: ${appearance.accent}`;
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
                  aria-label={label}
                >
                  <Palette aria-hidden="true" className="text-primary" />
                  {!compact && <span>{label}</span>}
                </Button>
              }
            />
          }
        />
        <Tooltip.Portal>
          <Tooltip.Positioner side="right" sideOffset={12} className="menu-tooltip-positioner">
            <Tooltip.Popup lang="en" className="menu-tooltip">
              {tooltip}
            </Tooltip.Popup>
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
                document.querySelectorAll<HTMLButtonElement>(`button[aria-label="${label}"]`),
              ).find((element) => element.getClientRects().length > 0) ?? false
            );
          }}
        >
          <div className="appearance-heading">
            <Dialog.Title>{label}</Dialog.Title>
            <Dialog.Close
              render={
                <Button
                  type="button"
                  variant="ghost"
                  className="sidebar-toggle"
                  aria-label="Close accent color"
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
              onClick={() => update({ ...appearance, accent: 'mint' })}
            >
              Reset accent color
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

import {
  accents,
  appearanceKey,
  parseAppearance,
} from '../src/features/appearance/model/appearance.ts';

export function appearanceHeadScript() {
  return `(()=>{let raw=null;try{raw=localStorage.getItem(${JSON.stringify(appearanceKey)})}catch{}
const pref=(${parseAppearance.toString()})(raw,${JSON.stringify(accents)});
const mode=pref.mode;
const root=document.documentElement;root.dataset.mode=mode;root.dataset.accent=pref.accent;
root.style.colorScheme=mode;})();`;
}

import {
  accents,
  appearanceKey,
  parseAppearance,
  resolveMode,
} from '../src/features/appearance/model/appearance.ts';

export function appearanceHeadScript() {
  return `(()=>{let raw=null;try{raw=localStorage.getItem(${JSON.stringify(appearanceKey)})}catch{}
const pref=(${parseAppearance.toString()})(raw,${JSON.stringify(accents)});
let systemDark=false;try{systemDark=matchMedia('(prefers-color-scheme: dark)').matches}catch{}
const mode=(${resolveMode.toString()})(pref.mode,systemDark);
const root=document.documentElement;root.dataset.mode=mode;root.dataset.accent=pref.accent;
root.style.colorScheme=mode;})();`;
}

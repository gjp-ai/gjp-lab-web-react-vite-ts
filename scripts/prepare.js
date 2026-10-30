import { execFileSync } from 'node:child_process';

async function prepare() {
  if (process.env.HUSKY === '0' || process.env.CI || process.env.NODE_ENV === 'production') return;
  try {
    execFileSync('git', ['rev-parse', '--git-dir'], { stdio: 'ignore' });
  } catch {
    console.info('Git hooks will be installed when this project is in a Git checkout.');
    return;
  }
  const { default: husky } = await import('husky');
  const message = husky();
  if (message) console.info(message);
}

await prepare();

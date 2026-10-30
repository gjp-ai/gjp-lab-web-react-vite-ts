import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Match the application's configured hosting base without loading Vite's ESM plugins in Jest.
const base = readFileSync(new URL('../../vite.config.ts', import.meta.url), 'utf8').match(
  /base:\s*'([^']+)'/,
)?.[1];
if (!base) throw new Error('The Jest transform could not read the Vite base.');

export default function viteBaseTransform({ types }) {
  return {
    visitor: {
      MetaProperty(path, state) {
        const env = path.parentPath;
        const value = env.parentPath;
        if (env.isMemberExpression() && env.node.property.name === 'url') {
          env.replaceWith(types.stringLiteral(pathToFileURL(state.file.opts.filename).href));
          return;
        }
        if (
          env.isMemberExpression() &&
          env.node.property.name === 'env' &&
          value.isMemberExpression()
        ) {
          const name = value.node.property.name;
          const values = { BASE_URL: base, DEV: true, VITE_API_MOCKING: 'false' };
          if (!(name in values))
            throw path.buildCodeFrameError(`Unsupported Vite environment value: ${name}`);
          value.replaceWith(types.valueToNode(values[name]));
        } else {
          throw path.buildCodeFrameError('Jest supports explicit import.meta.env properties here.');
        }
      },
    },
  };
}

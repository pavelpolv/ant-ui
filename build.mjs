import fs from 'node:fs';
import path from 'node:path';
import * as esbuild from 'esbuild';
import { sassPlugin, postcssModules } from 'esbuild-sass-plugin';
import { copy } from 'esbuild-plugin-copy';
import cssnanoPlugin from 'cssnano';

// `antd` бандлится в библиотеку. Локаль резолвим явно в ESM-сборку (`es/`),
// чтобы не тянуть CJS-шим `antd/locale/ru_RU.js` → `lib/`, и гарантированно
// инлайним её в бандл вместе с `@rc-component/*`.
const bundleAntdLocale = {
  name: 'bundle-antd-locale',
  setup(build) {
    build.onResolve({ filter: /^antd\/locale\/ru_RU$/ }, () => ({
      path: path.resolve(import.meta.dirname, 'node_modules/antd/es/locale/ru_RU.js'),
      external: false,
    }));
  },
};

const result = await esbuild.build({
  entryPoints: ['./src/components/index.ts'],
  outdir: 'dist',
  outbase: 'src',
  bundle: true,
  sourcemap: false,
  minify: true,
  target: ['es2020', 'chrome100', 'firefox100'],
  tsconfig: './tsconfig.build.json',
  plugins: [
    bundleAntdLocale,
    copy({
      resolveFrom: 'cwd',
      assets: { from: ['./src/style/**/*'], to: ['./dist/style'] },
    }),
    sassPlugin({
      transform: postcssModules(
        {},
        [cssnanoPlugin({ preset: 'default' })],
      ),
      type: 'style',
      loadPaths: [path.resolve(import.meta.dirname, 'src/style')],
    }),
  ],
  loader: { '.js': 'jsx', '.tsx': 'tsx' },
  jsx: 'automatic',
  format: 'esm',
  external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
  metafile: true,
});

fs.writeFileSync('dist/meta.json', JSON.stringify(result.metafile));

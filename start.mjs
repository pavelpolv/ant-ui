import path from 'node:path';
import * as esbuild from 'esbuild';
import { sassPlugin, postcssModules } from 'esbuild-sass-plugin';
import { copy } from 'esbuild-plugin-copy';
import cssnanoPlugin from 'cssnano';

const context = await esbuild.context({
  entryPoints: ['./src/components/index.ts'],
  outdir: 'dist',
  outbase: 'src',
  bundle: true,
  sourcemap: false,
  minify: false,
  target: ['es2020', 'chrome100', 'firefox100'],
  tsconfig: './tsconfig.build.json',
  plugins: [
    copy({
      resolveFrom: 'cwd',
      assets: {
        from: ['./src/style/**/*'],
        to: ['./dist/style'],
      },
    }),
    sassPlugin({
      transform: postcssModules(
        {},
        [
          cssnanoPlugin({
            preset: 'default',
          }),
        ],
      ),
      type: 'style',
      loadPaths: [path.resolve(import.meta.dirname, 'src/style')],
    }),
  ],
  loader: {
    '.js': 'jsx',
    '.tsx': 'tsx',
  },
  jsx: 'automatic',
  format: 'esm',
  external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
});

await context
  .serve({
    servedir: 'dist',
    port: 3022,
    host: 'localhost',
    cors: { origin: '*' },
  })
  .then(({ host, port }) => {
    console.log(`Running at http://${host}:${port}`);
  })
  .catch((err) => {
    console.log('error ==>', err);
    process.exit(1);
  });

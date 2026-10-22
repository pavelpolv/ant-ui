import path from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  staticDirs: ['../public'],
  addons: ['msw-storybook-addon'],
  framework: { name: '@storybook/react-vite', options: {} },
  viteFinal: async (viteConfig) => {
    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: { ...viteConfig.resolve?.alias, '@': path.resolve('src') },
    };
    viteConfig.css = {
      ...viteConfig.css,
      preprocessorOptions: {
        scss: {
          loadPaths: [
            path.resolve('src/style'),
          ],
        },
      },
    };
    return viteConfig;
  },
};

export default config;

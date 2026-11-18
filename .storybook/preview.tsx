import { useState } from 'react';
import type { Preview } from '@storybook/react-vite';
import { mswLoader } from 'msw-storybook-addon/csf3';
import { defaultHandlers } from '@/mocks/handlers';
import { QueryClient, UiProvider } from '@/components';

const preview: Preview = {
  loaders: [mswLoader()],
  beforeEach({ msw }) {
    msw.use(...defaultHandlers);
  },
  decorators: [
    (Story) => {
      const [queryClient] = useState(
        () => new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } }),
      );
      return (
        <UiProvider queryClient={queryClient}>
          <Story />
        </UiProvider>
      );
    },
  ],
};

export default preview;

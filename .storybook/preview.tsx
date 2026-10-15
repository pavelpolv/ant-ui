import { useState } from 'react';
import type { Preview } from '@storybook/react-vite';
import { mswLoader } from 'msw-storybook-addon/csf3';
import { defaultHandlers } from '../src/mocks/handlers';
import { QueryClient, QueryClientProvider, UiProvider, createModalManager } from '../src/components';

const modals = createModalManager();

const preview: Preview = {
  loaders: [mswLoader()],
  beforeEach({ msw }) {
    msw.use(...defaultHandlers);
  },
  decorators: [
    (Story) => {
      // новый клиент на каждую историю, чтобы кеш не переходил между ними
      const [queryClient] = useState(
        () => new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } }),
      );
      return (
        <QueryClientProvider client={queryClient}>
          <UiProvider>
            <modals.Provider>
              <Story />
            </modals.Provider>
          </UiProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;

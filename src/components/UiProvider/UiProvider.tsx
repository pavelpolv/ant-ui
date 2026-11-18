import { useState, type ReactNode } from 'react';
import { App, ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createModalManager, type ModalManager } from '../modals/createModalManager';

export interface UiProviderProps {
  children?: ReactNode;
  /** Свой QueryClient (например, с общими defaultOptions). По умолчанию создаётся новый на микрофронт. */
  queryClient?: QueryClient;
  /** Свой менеджер модалок — нужен, чтобы открывать модалки вне React. */
  modals?: ModalManager;
}

export const UiProvider = ({ children, queryClient, modals }: UiProviderProps) => {
  const [client] = useState(() => queryClient ?? new QueryClient());
  const [modalManager] = useState(() => modals ?? createModalManager());
  return (
    <ConfigProvider locale={ruRU}>
      <App component={false}>
        <QueryClientProvider client={client}>
          <modalManager.Provider>{children}</modalManager.Provider>
        </QueryClientProvider>
      </App>
    </ConfigProvider>
  );
};

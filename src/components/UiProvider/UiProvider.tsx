import type { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';

export interface UiProviderProps {
  children?: ReactNode;
}

export const UiProvider = ({ children }: UiProviderProps) => (
  <ConfigProvider locale={ruRU}>{children}</ConfigProvider>
);

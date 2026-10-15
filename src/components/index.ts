export * from './Button';
export * from './UiProvider';
export * from './modals';

// Реэкспорт, чтобы у ant-ui и микрофронтов была одна копия react-query (общий контекст QueryClient).
// Микрофронты импортируют react-query только отсюда: import { useQuery } from 'ant-ui'.
export * from '@tanstack/react-query';

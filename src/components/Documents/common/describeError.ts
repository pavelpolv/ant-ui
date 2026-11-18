import { isAxiosError } from 'axios';

// TODO: формат ответа бэкенда с ошибкой не описан — текст берётся из message
export const describeError = (error: Error): string => {
  if (!isAxiosError<{ message?: string }>(error) || !error.response) return error.message;
  const { status, data } = error.response;
  return `${data?.message || error.message}. Код ошибки: ${status}`;
};

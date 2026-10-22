import { useMutation } from '@tanstack/react-query';
import type { FileInfo } from './types';

export const useDownloadFile = (file: FileInfo, download: (file: FileInfo) => Promise<void>) =>
  useMutation({ mutationFn: () => download(file) });

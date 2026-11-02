export type FileStatus = 'idle' | 'invalid' | 'uploading' | 'done' | 'error';

export interface SelectedFile {
  uid: string;
  file: File;
  status: FileStatus;
  error?: string;
}

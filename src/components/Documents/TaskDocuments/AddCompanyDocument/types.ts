export type FileStatus = 'idle' | 'uploading' | 'done' | 'error';

export interface SelectedFile {
  uid: string;
  file: File;
  status: FileStatus;
  error?: string;
}

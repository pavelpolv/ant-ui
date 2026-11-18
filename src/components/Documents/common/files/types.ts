export type FileStatus = 'idle' | 'invalid' | 'uploading' | 'done' | 'deleting' | 'error';

export interface SelectedFile {
  uid: string;
  file: File;
  status: FileStatus;
  fileId?: string;
  error?: string;
}

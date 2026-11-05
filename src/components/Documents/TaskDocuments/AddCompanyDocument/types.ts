import type { DocTypesDictItem } from '../api';

export type PresetDocType = Pick<DocTypesDictItem, 'id' | 'shortName'>;

export type FileStatus = 'idle' | 'invalid' | 'uploading' | 'done' | 'error';

export interface SelectedFile {
  uid: string;
  file: File;
  status: FileStatus;
  error?: string;
}

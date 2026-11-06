// TODO: значения предположительные — сверить с бэкендом
export const ALLOWED_FILE_EXTENSIONS = [
  'pdf',
  'doc',
  'docx',
  'rtf',
  'xls',
  'xlsx',
  'csv',
];
export const MAX_FILE_SIZE_MB = 50;

const BYTES_IN_MB = 1024 * 1024;

export const getFileExtension = (name: string): string =>
  name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';

export const validateFile = (file: File): string | undefined => {
  if (!ALLOWED_FILE_EXTENSIONS.includes(getFileExtension(file.name))) {
    return `недопустимый формат. Разрешены: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`;
  }
  if (file.size > MAX_FILE_SIZE_MB * BYTES_IN_MB) return `размер больше ${MAX_FILE_SIZE_MB} МБ`;
  return undefined;
};

import dayjs, { type Dayjs } from 'dayjs';
import type { DocumentFields, VersionData } from '../types';

// TODO: формат дат в запросе new-version не описан — отправляется YYYY-MM-DD
const DATE_FORMAT = 'YYYY-MM-DD';

export const dateValueProps = (value: string) => ({ value: value ? dayjs(value) : null });

export const normalizeDate = (value: Dayjs | null) => (value ? value.format(DATE_FORMAT) : '');

export const selectValueProps = (value: string) => ({ value: value || undefined });

export const normalizeSelect = (value?: string) => value ?? '';

export const pickFields = (versionData: VersionData): DocumentFields => ({
  docName: versionData.docName,
  docNumber: versionData.docNumber,
  docDate: versionData.docDate,
  validityPeriod: versionData.validityPeriod,
  initiatorChannel: versionData.initiatorChannel,
  assuranceLevel: versionData.assuranceLevel,
  provisionForm: versionData.provisionForm,
  signType: versionData.signType,
  submittingOriginalDeadline: versionData.submittingOriginalDeadline,
  storageLocation: versionData.storageLocation,
  usingCopy: versionData.usingCopy,
  suspensiveProvision: versionData.suspensiveProvision,
  comment: versionData.comment,
});

export const changedFields = (base: DocumentFields, values: DocumentFields): Partial<DocumentFields> =>
  Object.fromEntries(
    (Object.keys(base) as (keyof DocumentFields)[])
      .filter((key) => values[key] !== base[key])
      .map((key) => [key, values[key]]),
  );

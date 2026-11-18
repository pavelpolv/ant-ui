import type { DictList, DocTypeDict } from '@/components/Documents/common/types';
import type { DocTypesDictItem } from '@/components/Documents/TaskDocuments/api';
import { DOC_TYPES } from './orderDocuments';

const list = (items: [string, string][]): DictList => ({ List: items.map(([code, value]) => ({ code, value })) });

// TODO: в ответе бэкенда коды signType и initiatorChannel пустые — подставлены свои
const SIGN_TYPE = list([['EMBEDDED', 'Встроенная'], ['DETACHED', 'Открепленная'], ['ABSENT', 'Отсутствует']]);

const ASSURANCE_LEVEL = list([
  ['ORIGINAL', 'Оригинал'],
  ['COPY_NOTARY', 'Копия, заверенная нотариусом'],
  ['COPY_AUTHOR', 'Копия, заверенная клиентом'],
  ['COPY_CLEAN', 'Незаверенная копия'],
]);

const baseDict = (id: string, name: string): DocTypeDict => ({
  id,
  codeEkd: '',
  shortName: name,
  fullName: name,
  multipleInList: false,
  client: true,
  docSelectionByDetails: false,
  signType: SIGN_TYPE,
  period: list([
    ['currentYear', 'Текущий год'],
    ['currentYear-1', 'Прошлый год'],
    ['currentYear-2', '2 года назад'],
    ['currentYear-3', '3 года назад'],
  ]),
  validityPeriod: null,
  initiatorChannel: list([['BANK', 'Банк'], ['OFFICE', 'Офис'], ['DBO', 'ДБО'], ['EMAIL', 'Эл.почта']]),
  // TODO: в ответе бэкенда для формы предоставления только ORIGINAL — PAPER и ELECTRONIC придуманы
  provisionForm: list([['PAPER', 'Бумажная'], ['ELECTRONIC', 'Электронная']]),
  assuranceLevel: ASSURANCE_LEVEL,
  usingCopy: false,
  submittingOriginalDeadline: null,
  primaryDocument: false,
  taxMonitoringDoc: false,
  archive: false,
  createAt: '2026-05-05T16:23:20.455317+03:00[Europe/Moscow]',
  createBy: 'Pokidaev',
  updateAt: null,
  updateBy: null,
});

const DICTS: Record<string, DocTypeDict> = {
  [DOC_TYPES.charter]: {
    ...baseDict(DOC_TYPES.charter, 'Устав'),
    codeEkd: '443',
    provisionForm: list([['ORIGINAL', 'Оригинал']]),
  },
  [DOC_TYPES.balance]: {
    ...baseDict(DOC_TYPES.balance, 'Бухгалтерский баланс (Ф1)'),
    assuranceLevel: { List: ASSURANCE_LEVEL.List.filter(({ code }) => code !== 'COPY_NOTARY') },
    provisionForm: list([['ELECTRONIC', 'Электронная']]),
  },
};

export const docTypeDict = (docType: string): DocTypeDict => DICTS[docType] ?? baseDict(docType, '');

export const docTypesDict: DocTypesDictItem[] = [
  { id: DOC_TYPES.charter, codeEkd: '443', shortName: 'Устав', fullName: 'Устав', multipleInList: false, client: true },
  {
    id: DOC_TYPES.balance,
    codeEkd: '9',
    shortName: 'Бухгалтерский баланс (Ф1)',
    fullName: 'Бухгалтерский баланс (Ф1)',
    multipleInList: false,
    client: true,
  },
  {
    id: DOC_TYPES.managementReport,
    codeEkd: '8',
    shortName: 'Консолидированная управленческая отчетность и расшифровки к ней',
    fullName: 'Консолид. управленческая отчетность',
    multipleInList: true,
    client: true,
  },
  {
    id: DOC_TYPES.decisionDraft,
    codeEkd: '652',
    shortName: 'Проект решения',
    fullName: 'Проект решения',
    multipleInList: false,
    client: false,
  },
  {
    id: DOC_TYPES.creditOrder,
    codeEkd: '1091',
    shortName: 'Распоряжение на учет (Кредитный договор)',
    fullName: 'Распоряжение на учет (Кредитный договор)',
    multipleInList: false,
    client: false,
  },
];

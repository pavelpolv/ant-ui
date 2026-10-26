import type {
  DocFile,
  DocStructureResponse,
  DocumentData,
  DocumentsDataResponse,
  OrderResponse,
  VersionData,
} from '@/components/Documents/OrderDocuments/api';

export const ORDER_ID = 'VYjXuo6HUEwS1e8lR0n9t';

export const order: OrderResponse = {
  error_code: 0,
  error: null,
  order: {
    orderId: ORDER_ID,
    orderNumber: '3-14429',
    orderType: 'setting-limit',
    orderStatus: null,
    title: 'Заявка №3-14429',
    closedDate: null,
    createdDateTime: null,
  },
};

const DOC_TYPES = {
  charter: '1d820258-416c-4eb1-8e80-b92cdb102b6f',
  balance: '6a5189fb-694a-434b-b123-e6272462184c',
  managementReport: '48896d8d-0878-435b-b0df-20e63d0b56fd',
  decisionDraft: '0f2466e3-14e9-4cc8-8a94-f428461f1183',
  creditOrder: 'c395a0fe-524b-4e12-a226-cddc2700b721',
};

const FINANCIAL_FOLDER = 'b5961fbd-cc7d-4ddf-b5f7-c4fe90fcd258';
const KOD_FOLDER = 'ff124e9f-1f1e-43ca-b3ff-e744f5596462';

export const docStructure: DocStructureResponse = [
  {
    id: 'e142a166-ef56-42f8-98fc-d58f50056910',
    strLevel: 1,
    strName: 'Документы для установления Лимита на контрагента',
    strParent: null,
    strSort: 3,
    docTypeInfo: [{ docType: DOC_TYPES.decisionDraft, docTypeName: 'Проект решения', docInStrSort: 1 }],
  },
  {
    id: '337aeace-d772-4a54-998d-43f0edd9532e',
    strLevel: 2,
    strName: 'Документы основания для КОД',
    strParent: KOD_FOLDER,
    strSort: 1,
    docTypeInfo: [{ docType: DOC_TYPES.creditOrder, docTypeName: 'Распоряжение на учет (Кредитный договор)', docInStrSort: 1 }],
  },
  {
    id: KOD_FOLDER,
    strLevel: 1,
    strName: 'Документы для КОД',
    strParent: null,
    strSort: 4,
    docTypeInfo: [],
  },
  {
    id: FINANCIAL_FOLDER,
    strLevel: 1,
    strName: 'Финансовые документы',
    strParent: null,
    strSort: 2,
    docTypeInfo: [],
  },
  {
    id: '92d360c2-b4a4-45bf-b70a-3836cea1bc5b',
    strLevel: 1,
    strName: 'Юридические документы',
    strParent: null,
    strSort: 1,
    docTypeInfo: [{ docType: DOC_TYPES.charter, docTypeName: 'Устав', docInStrSort: 1 }],
  },
  {
    id: 'cbc35bb3-a751-48f3-9e89-ca739733752d',
    strLevel: 2,
    strName: 'Дополнительные документы',
    strParent: FINANCIAL_FOLDER,
    strSort: 2,
    docTypeInfo: [
      { docType: DOC_TYPES.managementReport, docTypeName: 'Консолидированная управленческая отчетность и расшифровки к ней', docInStrSort: 1 },
    ],
  },
  {
    id: '291520ad-cab7-478a-9ad9-b46f1cb0541a',
    strLevel: 2,
    strName: 'Отчетность РСБУ / МСФО',
    strParent: FINANCIAL_FOLDER,
    strSort: 1,
    docTypeInfo: [{ docType: DOC_TYPES.balance, docTypeName: 'Бухгалтерский баланс (Ф1)', docInStrSort: 1 }],
  },
];

const audit = (at: string, by: string) => ({ nkpCreatedBy: by, nkpCreateAt: at, nkpUpdateBy: by, nkpUpdateAt: at });

const file = (id: string, fileName: string, at: string, by: string): DocFile => ({
  nkpFileId: id,
  fileName,
  format: fileName.split('.').pop() ?? '',
  size: 102400,
  elarId: `elar-${id}`,
  ...audit(at, by),
});

const doc = (
  id: string,
  docType: string,
  number: string,
  name: string,
  at: string,
  by: string,
  version: number,
  files: DocFile[],
  extra: Partial<VersionData> = {},
): DocumentData => ({
  nkpDocumentId: id,
  ekdBaseDocId: `ekd-base-${id}`,
  docType,
  docPeriod: '',
  productId: 'product-1',
  ...audit(at, by),
  versionData: {
    ekdDocId: `ekd-${id}`,
    nkpDocId: id,
    newVersion: false,
    version,
    statusCode: 'ACTIVE',
    statusName: 'Действующий',
    docName: name,
    docDate: at,
    docNumber: number,
    signType: 'ELECTRONIC_SIGNATURE',
    validityPeriod: '',
    initiatorChannel: '',
    provisionForm: 'ELECTRONIC',
    assuranceLevel: 'ORIGINAL',
    usingCopy: false,
    submittingOriginalDeadline: '',
    suspensiveProvision: false,
    comment: '',
    storageLocation: '',
    expertiseData: { expertiseType: '', expertiseResolution: '', expertiseComment: '', expert: '', expertBoss: '' },
    ...audit(at, by),
    files,
    ...extra,
  },
});

export const documentsData: DocumentsDataResponse = {
  docLists: [
    {
      counterparty: { counterpartyCode: 'cp-3', counterpartyName: 'Без документов', counterpartyType: 'LEGAL_ENTITY', counterpartyPart: 'Guarantor' },
      documentData: [],
    },
    {
      counterparty: { counterpartyCode: 'cp-2', counterpartyName: 'ООО Ромашка-Строй', counterpartyType: 'LEGAL_ENTITY', counterpartyPart: 'Borrower' },
      documentData: [
        doc('doc-2', DOC_TYPES.balance, 'Ф1-2024', 'Бухгалтерский баланс за 2024 год', '2025-02-13T10:00:00Z', 'Иванов Сергей Григорьевич', 2, [
          file('f-2', 'Бухгалтерский баланс ООО Ромашка-Строй за 2024 год с отметкой ИФНС.pdf', '2025-02-13T10:00:00Z', 'Иванов Сергей Григорьевич'),
          file('f-3', 'Квитанция о приеме налоговой декларации в электронном виде.pdf', '2025-02-27T10:00:00Z', 'Иванов Сергей Григорьевич'),
        ]),
        doc('doc-3', DOC_TYPES.creditOrder, '002-211918', 'Распоряжение на учет № 002-211918', '2025-06-02T10:00:00Z', 'Петров Никита Дмитриевич', 4, [
          file('f-4', 'Распоряжение 002-211918 от 02.06.2025.pdf', '2025-06-02T10:00:00Z', 'Петров Никита Дмитриевич'),
          file('f-5', 'Кредитный договор КД_002-211796 от 11.02.2025.pdf', '2025-02-11T10:00:00Z', 'Петров Никита Дмитриевич'),
          file('f-6', 'Не требуется.docx', '2025-02-13T10:00:00Z', 'Сидорова Виктория Юрьевна'),
          file(
            'f-7',
            'Приложение 1 к кредитному договору № КД_002-211796 от 11.02.2025 ООО Ромашка-Строй (финальная редакция, подписанная сторонами).pdf',
            '2025-02-14T10:00:00Z',
            'Сидорова Виктория Юрьевна',
          ),
        ], { assuranceLevel: 'NOTARIAL_COPY', provisionForm: 'PAPER', signType: 'HANDWRITTEN' }),
        doc('doc-4', DOC_TYPES.decisionDraft, '15', 'Проект решения № 15 об установлении лимита', '2025-07-01T10:00:00Z', 'Петров Никита Дмитриевич', 1, [], {
          statusCode: 'ON_REVIEW',
          statusName: 'На проверке',
          assuranceLevel: 'CLIENT_CERTIFIED_COPY',
        }),
      ],
    },
    {
      counterparty: { counterpartyCode: 'cp-1', counterpartyName: 'ГК Ромашка', counterpartyType: 'HOLDING', counterpartyPart: '' },
      documentData: [
        doc('doc-1', DOC_TYPES.charter, '1', 'Устав ГК Ромашка (редакция 2025)', '2025-11-01T10:00:00Z', 'Иванов Сергей Григорьевич', 1, [
          file('f-1', 'Устав.pdf', '2025-11-01T10:00:00Z', 'Иванов Сергей Григорьевич'),
        ]),
      ],
    },
  ],
};

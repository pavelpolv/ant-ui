# OrderDocuments (документы заявки) — API бэкенда

Скриншоты исходных описаний лежат в [api/](api/).

## 0. Заявка

```
GET /credit-doc/order/{orderId}
```

`orderId` приходит в компонент через props. Из ответа нужны `order.orderType` и `order.orderId` — из них собирается `entityId` (см. «Параметры»).

```ts
interface OrderResponse {
  error_code: number;      // 0 — успех
  error: string | null;    // текст ошибки, если error_code ≠ 0
  order: {
    orderId: string;       // VYjXuo6HUEwS1e8lR0n9t
    orderNumber: string;   // 3-14429
    orderType: string;     // setting-limit
    orderStatus: string | null;
    title: string;         // Заявка №3-14429
    closedDate: string | null;
    createdDateTime: string | null;
    principal: { … };      // не используется
    tasks: [ … ];          // не используется
  };
}
```

Если `error_code ≠ 0`, это ошибка загрузки (даже при HTTP 200), текст — из `error`.

## 1. Структура каталогов

Источник: [api/01-catalogs.png](api/01-catalogs.png). Пример реального ответа: [api/04-doc-structure-response.png](api/04-doc-structure-response.png)

> **Расхождения реального ответа с описанием:**
> - поле типа документа в `docTypeInfo` называется `docType`, а не `docTypeId` (в коде — `docType`);
> - `strLevel` начинается с 1, а не с 0 (в сборке дерева не используется);

```
GET /credit-doc/doc-structure
```

Общий для OrderDocuments и TaskDocuments: запрос и хук `useDocStructure` — в `common/`.

```ts
interface DocStructureItem {
  id: string;
  strLevel: number;
  strName: string;
  strParent: string | null;
  strSort: number;
  docTypeInfo: DocTypeInfo[];
}

interface DocTypeInfo {
  docType: string;
  docTypeName: string;
  docInStrSort: number;
}

type DocStructureResponse = DocStructureItem[];
```

## 2. Данные документов

Источник: [api/02-documents.png](api/02-documents.png)

```
GET /credit-doc/documents-data/{entityId}
```

```ts
interface DocumentsDataResponse {
  docLists: DocList[];
}

interface DocList {
  counterparty: Counterparty;
  documentData: DocumentData[];
}

interface Counterparty {
  counterparty: string;
  counterpartyCode: string;
  counterpartyName: string;
  counterpartyType: string;
  counterpartyPart: string;
}

interface DocumentData {
  nkpDocumentId: string;
  ekdBaseDocId: string;
  docType: string;
  docPeriod: string;
  productId: string;
  nkpCreatedBy: string;
  nkpCreateAt: string;
  nkpUpdateBy: string;
  nkpUpdateAt: string;
  versionData: VersionData;
}

interface VersionData {
  ekdDocId: string;
  nkpDocId: string;
  newVersion: boolean;
  version: number;
  statusCode: string;
  statusName: string;
  docName: string;
  docDate: string;
  docNumber: string;
  signType: string;
  validityPeriod: string;
  initiatorChannel: string;
  provisionForm: string;
  assuranceLevel: string;
  usingCopy: boolean;
  submittingOriginalDeadline: string;
  suspensiveProvision: boolean;
  comment: string;
  storageLocation: string;
  expertiseData: ExpertiseData;
  nkpCreatedBy: string;
  nkpCreateAt: string;
  nkpUpdateBy: string;
  nkpUpdateAt: string;
  files: DocFile[];
}

interface ExpertiseData {
  expertiseType: string;
  expertiseResolution: string;
  expertiseComment: string;
  expert: string;
  expertBoss: string;
}

interface DocFile {
  nkpFileId: string;
  fileName: string;
  format: string;
  size: number;
  elarId: string;
  nkpCreatedBy: string;
  nkpCreateAt: string;
  nkpUpdateBy: string;
  nkpUpdateAt: string;
}
```

## 3. Справочник типа документа

```
GET /credit-doc/docTypeDict/{docType}
```

`docType` — из `/doc-structure` (`docTypeInfo[].docType`, он же `DocumentData.docType`). Запрос — на каждый тип документа,
ответ кешируется на время жизни страницы. Общий для OrderDocuments и TaskDocuments.

```ts
interface DictItem {
  code: string;
  value: string;           // подпись
}

interface DictList {
  List: DictItem[];
}

interface DocTypeDict {
  id: string;              // 1d820258-416c-4eb1-8e80-b92cdb102b6f
  codeEkd: string;         // 443
  shortName: string;       // Устав
  fullName: string;
  multipleInList: boolean;
  client: boolean;
  docSelectionByDetails: boolean;
  signType: DictList | null;
  period: DictList | null;
  validityPeriod: DictList | null;   // в ответе бэкенда null, тип не известен
  initiatorChannel: DictList | null;
  provisionForm: DictList | null;
  assuranceLevel: DictList | null;
  usingCopy: boolean;
  submittingOriginalDeadline: string | null;
  primaryDocument: boolean;
  taxMonitoringDoc: boolean;
  archive: boolean;
  createAt: string;        // 2026-05-05T16:23:20.455317+03:00[Europe/Moscow]
  createBy: string;
  updateAt: string | null;
  updateBy: string | null;
}
```

- Используются `assuranceLevel`, `provisionForm`, `signType`: `code` — значение в `versionData`, `value` — подпись.
- Иконки — свои, по `code` (`common/fields.tsx`).
- [ ] В ответе бэкенда у `signType` и части `initiatorChannel` пустые `code` — в моке и иконках подставлены свои
  (`EMBEDDED`, `DETACHED`, `ABSENT`).
- [ ] У `provisionForm` в ответе бэкенда только `ORIGINAL` — коды `PAPER` и `ELECTRONIC` придуманы.

## Связи между ручками

- Корневого узла нет.
- `/documents-data` возвращает компании (`counterparty`), привязанные к ним документы (`documentData`) и привязанные к документам файлы (`versionData.files`).
- `/doc-structure` — словарь, стандартный набор папок. По нему строится структура каталогов **для каждой компании**.
- Документ попадает в папку по связи `DocTypeInfo.docType` → `DocumentData.docType`.

## Сборка дерева

Источник: [api/03-columns.png](api/03-columns.png)

```
<counterpartyName>                             ← компания (элемент docLists), верхний уровень, плоский список
└─ <strName>                                   ← папка из /doc-structure (по strParent), подпапки — вложенными строками
   └─ <docTypeName>                            ← тип документа (docTypeInfo), группа
      └─ <versionData.docName>                 ← документ (DocumentData.docType === DocTypeInfo.docType), файлы внутри строки
```

- **Компании** идут плоским списком, без вложенности. Подпись: `counterpartyName`.
- **Сортировка компаний**: сначала `counterpartyType = HOLDING`, затем `counterpartyPart = Borrower`, далее по алфавиту (`counterpartyName`).
- **Папки** выводятся вложенными строками по `strParent`, как в `/doc-structure`, без схлопывания цепочек.
- **Сортировка**: папки внутри родителя — по `strSort`, типы документов внутри папки — по `docInStrSort`, документы — в порядке ответа. В папке сначала типы документов, потом подпапки.
- **Тип документа** — группа. Если у компании несколько `DocumentData` с одним `docType`, они выводятся внутри одной группы.
- **Документ**: одна строка на документ. В колонке «Документ» выводится `versionData.docName` — ссылкой (без жирного, курсива и подчёркивания) и версия `v.{versionData.version}` меткой. Клик по названию открывает форму «Документ» в режиме только для чтения (п. 9.3 ТЗ).
- **Файлы** (`versionData.files`) выводятся списком внутри строки документа, в колонке «Файлы».
- **Строки компаний, папок и типов документов** — заголовки групп на всю ширину таблицы, без пустых ячеек.
- **Пустые папки и типы документов** (без документов внутри) скрываются.

## Колонки

| Колонка | Ширина | Источник |
|---|---|---|
| Документ | остаток | см. «Сборка дерева» |
| Файлы | 300 | `files[].fileName`; под именем — `files[].nkpCreateAt · files[].nkpCreatedBy` |
| Статус | 130 | `versionData.statusName`, цветная метка по `versionData.statusCode` |
| Вид заверения / Форма предоставления | 240 | `versionData.assuranceLevel` и `versionData.provisionForm` (коды) — друг под другом, в шапке тоже в две строки |
| Способ подписания | 200 | `versionData.signType` (коды → подписи и иконки, см. requirements.md) |

- Ширины колонок фиксированы (`tableLayout="fixed"`), подобраны так, чтобы самые длинные значения с иконкой помещались в одну строку. Настройки — в `fields.tsx`.
- Если таблица уже 1200px, появляется горизонтальная прокрутка.
- Если данных нет или есть только часть, выводится то, что нашлось (пустые ячейки или пустое дерево).

## Параметры

- В компонент через props приходит `orderId`. `entityId` для `/documents-data/{entityId}` собирается как `{order.orderType}~{order.orderId}` из ответа `GET /credit-doc/order/{orderId}`, например `setting-limit~VYjXuo6HUEwS1e8lR0n9t`.
- Сначала запрашивается заявка, затем `/documents-data`. `/doc-structure` запрашивается параллельно с заявкой. Ошибка любой из трёх ручек — экран ошибки.

## Форматы

- Даты (`files[].nkpCreateAt`) выводятся как `DD.MM.YYYY`. С бэкенда ожидается ISO-строка, форматирование на клиенте.
- `nkpCreatedBy` пока выводится как есть. Не известно, ФИО это или логин.

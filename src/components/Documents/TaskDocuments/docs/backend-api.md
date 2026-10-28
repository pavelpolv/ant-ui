# TaskDocuments — API бэкенда

Структура каталогов (`GET /credit-doc/doc-structure`) и сборка дерева — как в [OrderDocuments](../../OrderDocuments/docs/backend-api.md).
Заявка (`GET /credit-doc/order/{orderId}`) не запрашивается. Код компонента от OrderDocuments не зависит. Общие с OrderDocuments
типы, запросы и хуки (`/doc-structure`, `/credit-doc/docTypeDict`) — в `common/`; сборка дерева и колонки — свои копии
в `TaskDocuments/`.

## Данные документов

```
POST /credit-doc/taskList/{entityId}
```

Вместо `GET /credit-doc/documents-data/{entityId}`. Ответ — как у `/documents-data` (`docLists`), плюс поле
`versionData.docInEntityId: string` (используется для исключения вида документа).

- [ ] Откуда берётся `entityId` и параметры тела запроса — не описано. Сейчас в URL подставляется `taskId` из props, тело `{}`.

## Варианты полей

`GET /credit-doc/docTypeDict/{docType}` — как в [OrderDocuments](../../OrderDocuments/docs/backend-api.md#3-справочник-типа-документа).

## Сохранение поля

```
POST /credit-doc/new-version/{documentId}
```

```ts
interface NewVersionRequest {
  versionData: {
    id: string;              // versionData.nkpDocId
    assuranceLevel?: string; // одно изменённое поле
    provisionForm?: string;
    signType?: string;
  };
}
```

- `documentId` — `DocumentData.nkpDocumentId`.
- После успешного сохранения перезапрашивается `POST /credit-doc/taskList`.
- [ ] Ручка описана не до конца: сверить, что такое `documentId` и `id`, и что приходит в ответе. Сейчас ответ не используется. Мок поднимает версию документа на 1.

## Исключение вида документа

```
DELETE /credit-doc/document-in-entity/{docInEntityId}
```

- По ТЗ `docInEntityId` = `docList.id` из `GET /docList/{entityId}`. Этой ручки нет, поэтому берутся уникальные
  `versionData.docInEntityId` документов этого вида, и на каждый уходит свой `DELETE`.
- После успешного удаления перезапрашивается `POST /credit-doc/taskList`.
- [ ] Сверить источник `docInEntityId` и ответ ручки. Сейчас ответ не используется, мок отвечает `204` и убирает документы.

## Добавление документа к компании

### Виды документов

```
GET /credit-doc/docTypesDict?archive=false
```

```ts
interface DocTypesDictItem {
  id: string;             // docTypeId для new-document-to-list
  codeEkd: string;        // подпись и поиск
  shortName: string;      // подпись и поиск
  fullName: string;       // поиск, тултип опции
  multipleInList: boolean; // не используется
  client: boolean;        // не используется (условие шагов 3–4 ТЗ)
}
```

### Создание документа

```
POST /credit-doc/new-document-to-list
```

```ts
interface NewDocumentToListRequest {
  entityId: string;          // taskId из props
  counterparty: string;      // Counterparty строки компании
  counterpartyCode: string;
  counterpartyName: string;
  counterpartyType: string;
  counterpartyPart: string;
  docTypeId: string;         // id выбранного вида
}
```

- `counterpartyCrmId` из ТЗ не отправляется — в `Counterparty` его нет.
- Ответ — `{ docVersionId: string }`, `201`.
- [ ] Сверить ответ и префикс `/credit-doc`. Мок добавляет документ со статусом «Новый» в `/taskList`.

### Загрузка файла

```
POST /credit-doc/file/{docVersionId}
Content-Type: multipart/form-data; file=<binary>
```

- Отдельный запрос на каждый файл, параллельно. Ответ не используется.
- После всех загрузок (успешных или нет) перезапрашивается `POST /credit-doc/taskList`.
- [ ] Сверить префикс `/credit-doc` и ответ (`fileID`). Мок добавляет файл в документ.

## Колонки

| Колонка | Ширина | Источник | Сохранение |
|---|---|---|---|
| Документ | остаток | как в OrderDocuments | — |
| Файлы | 300 | как в OrderDocuments | — |
| Статус | 130 | `versionData.statusName` | — |
| Вид заверения | 280 | `versionData.assuranceLevel` | `{ id, assuranceLevel }` |
| Форма предоставления | 170 | `versionData.provisionForm` | `{ id, provisionForm }` |
| Способ подписания | 200 | `versionData.signType` | `{ id, signType }` |

Горизонтальная прокрутка — если таблица уже 1450px.

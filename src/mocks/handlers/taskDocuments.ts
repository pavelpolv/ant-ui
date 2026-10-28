import { delay, http, HttpResponse } from 'msw';
import type { DocumentsDataResponse } from '@/components/Documents/common/types';
import type { NewDocumentToListRequest, NewVersionRequest } from '@/components/Documents/TaskDocuments/api';
import { docTypesDict } from '../data/docTypeDict';
import { doc, documentsData, file as docFile } from '../data/orderDocuments';

const TASK_LIST_URL = '/credit-doc/taskList/:taskId';
const NEW_VERSION_URL = '/credit-doc/new-version/:documentId';
const DELETE_DOC_IN_ENTITY_URL = '/credit-doc/document-in-entity/:docInEntityId';
const DOC_TYPES_DICT_URL = '/credit-doc/docTypesDict';
const NEW_DOCUMENT_URL = '/credit-doc/new-document-to-list';
const UPLOAD_FILE_URL = '/credit-doc/file/:versionId';
const CURRENT_USER = 'Текущий пользователь';

export const TASK_ID = 'task-1';

const initialTaskList = (): DocumentsDataResponse => ({
  docLists: documentsData.docLists.map(({ counterparty, documentData }) => ({
    counterparty: { ...counterparty },
    documentData: documentData.map((document) => ({
      ...document,
      versionData: {
        ...document.versionData,
        docInEntityId: `${TASK_ID}~${document.nkpDocumentId}`,
      },
    })),
  })),
});

let taskList = initialTaskList();
let documentSeq = 0;
let fileSeq = 0;
const uploadAttempts = new Map<string, number>();

export const resetTaskList = () => {
  taskList = initialTaskList();
  documentSeq = 0;
  fileSeq = 0;
  uploadAttempts.clear();
};

const serverError = () => HttpResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });

const readUploadedFile = async (request: Request): Promise<File | null> => {
  const file = (await request.formData()).get('file');
  return file instanceof File ? file : null;
};

const saveUploadedFile = (versionId: string, file: File) => {
  const document = taskList.docLists
    .flatMap((list) => list.documentData)
    .find((item) => item.versionData.nkpDocId === versionId);
  if (!document) return HttpResponse.json({ message: 'Версия документа не найдена' }, { status: 404 });
  const fileId = `new-file-${++fileSeq}`;
  const at = new Date().toISOString();
  document.versionData.files.push({ ...docFile(fileId, file.name, at, CURRENT_USER), size: file.size });
  return HttpResponse.json({ fileId });
};

export const taskDocumentsHandlers = {
  taskList: http.post(TASK_LIST_URL, async () => {
    await delay(500);
    return HttpResponse.json(taskList);
  }),
  // TODO: ответ ручки сохранения не описан — мок возвращает пустой объект и поднимает версию
  newVersion: http.post<{ documentId: string }, NewVersionRequest>(NEW_VERSION_URL, async ({ params, request }) => {
    await delay(400);
    const { versionData } = await request.json();
    const { id, ...fields } = versionData;
    const document = taskList.docLists
      .flatMap((list) => list.documentData)
      .find((item) => item.nkpDocumentId === params.documentId && item.versionData.nkpDocId === id);
    if (!document) return HttpResponse.json({ message: 'Документ не найден' }, { status: 404 });
    Object.assign(document.versionData, fields, { version: document.versionData.version + 1 });
    return HttpResponse.json({});
  }),
  deleteDocInEntity: http.delete<{ docInEntityId: string }>(DELETE_DOC_IN_ENTITY_URL, async ({ params }) => {
    await delay(400);
    const found = taskList.docLists.some(({ documentData }) =>
      documentData.some((document) => document.versionData.docInEntityId === params.docInEntityId));
    if (!found) return HttpResponse.json({ message: 'Документ не найден' }, { status: 404 });
    taskList.docLists.forEach((list) => {
      list.documentData = list.documentData.filter(
        (document) => document.versionData.docInEntityId !== params.docInEntityId,
      );
    });
    return new HttpResponse(null, { status: 204 });
  }),
  docTypesDict: http.get(DOC_TYPES_DICT_URL, async () => {
    await delay(600);
    return HttpResponse.json(docTypesDict);
  }),
  // TODO: ответ POST /new-document-to-list не описан — мок возвращает docVersionId
  newDocumentToList: http.post<never, NewDocumentToListRequest>(NEW_DOCUMENT_URL, async ({ request }) => {
    await delay(500);
    const { counterpartyCode, docTypeId } = await request.json();
    const list = taskList.docLists.find(({ counterparty }) => counterparty.counterpartyCode === counterpartyCode);
    const docType = docTypesDict.find(({ id }) => id === docTypeId);
    if (!list || !docType) return HttpResponse.json({ message: 'Контрагент или вид документа не найден' }, { status: 404 });
    const id = `new-doc-${++documentSeq}`;
    const at = new Date().toISOString();
    list.documentData.push(doc(id, docTypeId, '', docType.shortName, at, CURRENT_USER, 1, [], {
      docInEntityId: `${TASK_ID}~${id}`,
      statusCode: 'NewDoc',
      statusName: 'Новый',
    }));
    return HttpResponse.json({ docVersionId: id }, { status: 201 });
  }),
  uploadFile: http.post<{ versionId: string }>(UPLOAD_FILE_URL, async ({ params, request }) => {
    await delay(700);
    const file = await readUploadedFile(request);
    if (!file) return HttpResponse.json({ message: 'Файл не передан' }, { status: 400 });
    return saveUploadedFile(params.versionId, file);
  }),

  taskListEmpty: http.post(TASK_LIST_URL, () => HttpResponse.json({ docLists: [] })),
  taskListError: http.post(TASK_LIST_URL, () =>
    HttpResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 }),
  ),
  taskListLoading: http.post(TASK_LIST_URL, async () => {
    await delay('infinite');
  }),
  newVersionError: http.post(NEW_VERSION_URL, async () => {
    await delay(400);
    return HttpResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }),
  deleteDocInEntityError: http.delete(DELETE_DOC_IN_ENTITY_URL, async () => {
    await delay(400);
    return HttpResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }),
  docTypesDictError: http.get(DOC_TYPES_DICT_URL, async () => {
    await delay(600);
    return serverError();
  }),
  newDocumentToListError: http.post(NEW_DOCUMENT_URL, async () => {
    await delay(500);
    return serverError();
  }),
  uploadFilePartialError: http.post<{ versionId: string }>(UPLOAD_FILE_URL, async ({ params, request }) => {
    await delay(700);
    const file = await readUploadedFile(request);
    if (!file) return HttpResponse.json({ message: 'Файл не передан' }, { status: 400 });
    const attempt = (uploadAttempts.get(file.name) ?? 0) + 1;
    uploadAttempts.set(file.name, attempt);
    const order = [...uploadAttempts.keys()].indexOf(file.name);
    if (attempt === 1 && order % 2 === 1) return serverError();
    return saveUploadedFile(params.versionId, file);
  }),
};

export const taskDocumentsDefaultHandlers = [
  taskDocumentsHandlers.taskList,
  taskDocumentsHandlers.newVersion,
  taskDocumentsHandlers.deleteDocInEntity,
  taskDocumentsHandlers.docTypesDict,
  taskDocumentsHandlers.newDocumentToList,
  taskDocumentsHandlers.uploadFile,
];

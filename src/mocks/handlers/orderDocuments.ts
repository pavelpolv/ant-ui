import { delay, http, HttpResponse } from 'msw';
import { docStructure, documentsData, order } from '../data/orderDocuments';

const ORDER_URL = '/order/:orderId';
const DOC_STRUCTURE_URL = '/doc-structure';
const DOCUMENTS_DATA_URL = '/documents-data/:entityId';
const DOWNLOAD_FILE_URL = '/elar-file/:nkpFileId';

export const orderDocumentsHandlers = {
  order: http.get(ORDER_URL, async () => {
    await delay(200);
    return HttpResponse.json(order);
  }),
  structure: http.get(DOC_STRUCTURE_URL, async () => {
    await delay(300);
    return HttpResponse.json(docStructure);
  }),
  documents: http.get(DOCUMENTS_DATA_URL, async () => {
    await delay(500);
    return HttpResponse.json(documentsData);
  }),
  download: http.get(DOWNLOAD_FILE_URL, ({ params }) =>
    new HttpResponse(`Мок файла ${params.nkpFileId}`, { headers: { 'Content-Type': 'application/octet-stream' } }),
  ),

  orderError: http.get(ORDER_URL, () => HttpResponse.json({ error_code: 1, error: 'Заявка не найдена', order: null })),
  documentsEmpty: http.get(DOCUMENTS_DATA_URL, () => HttpResponse.json({ docLists: [] })),
  documentsError: http.get(DOCUMENTS_DATA_URL, () =>
    HttpResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 }),
  ),
  documentsLoading: http.get(DOCUMENTS_DATA_URL, async () => {
    await delay('infinite');
  }),
  downloadError: http.get(DOWNLOAD_FILE_URL, () => new HttpResponse(null, { status: 404 })),
};

export const orderDocumentsDefaultHandlers = [
  orderDocumentsHandlers.order,
  orderDocumentsHandlers.structure,
  orderDocumentsHandlers.documents,
  orderDocumentsHandlers.download,
];

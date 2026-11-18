import { delay, http, HttpResponse } from 'msw';
import { docTypeDict } from '../data/docTypeDict';

const DOC_TYPE_DICT_URL = '/credit-doc/docTypeDict/:docType';

export const docTypeDictHandlers = {
  docTypeDict: http.get<{ docType: string }>(DOC_TYPE_DICT_URL, async ({ params }) => {
    await delay(4300);
    return HttpResponse.json(docTypeDict(params.docType));
  }),

  docTypeDictError: http.get(DOC_TYPE_DICT_URL, () =>
    HttpResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 }),
  ),
};

export const docTypeDictDefaultHandlers = [docTypeDictHandlers.docTypeDict];

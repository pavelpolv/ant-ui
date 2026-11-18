import { delay, http, HttpResponse } from 'msw';
import { users } from '../data/users';

export const USERS_URL = '/api/users';

export const usersHandlers = {
  success: http.get(USERS_URL, async () => {
    await delay(500);
    return HttpResponse.json(users);
  }),
  empty: http.get(USERS_URL, () => HttpResponse.json([])),
  error: http.get(USERS_URL, () => HttpResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 })),
  loading: http.get(USERS_URL, async () => {
    await delay('infinite');
  }),
};

# ant-ui

Библиотека компонентов для микрофронтов. Подключается в браузере через **import map** как один общий модуль на все микрофронты.

Внутри:
- **antd** — зашит в бандл, наружу не торчит. Микрофронты используют только компоненты ant-ui.
- **@tanstack/react-query** — зашит в бандл и **реэкспортируется** из `ant-ui`.
- **Менеджер модалок** — свой, с API в стиле nice-modal, но изолированный по микрофронтам.

## Скрипты

| Команда | Что делает |
|---|---|
| `npm start` | dev-сервер esbuild на `http://localhost:3022` (отдаёт `dist`) |
| `npm run build` | сборка в `dist` (минифицированный ESM + типы в `dist/types`) |
| `npm run storybook` | Storybook на `http://localhost:6010` |
| `npm run build-storybook` | статическая сборка Storybook |
| `npm run typecheck` | проверка типов |
| `npm run lint` | проверка ESLint (стиль — [docs/code-style.md](docs/code-style.md)) |
| `npm run lint:fix` | ESLint с автоисправлением |

## Подключение в микрофронте

### 1. Import map

Внешние зависимости бандла — только `react`, `react-dom`, `react-dom/client`, `react/jsx-runtime`. Все они и сама `ant-ui` должны быть в import map, иначе модуль не загрузится:

```html
<script type="importmap">
{
  "imports": {
    "react": "https://cdn.example.com/react.js",
    "react/jsx-runtime": "https://cdn.example.com/react-jsx-runtime.js",
    "react-dom": "https://cdn.example.com/react-dom.js",
    "react-dom/client": "https://cdn.example.com/react-dom-client.js",
    "ant-ui": "https://cdn.example.com/ant-ui/components/index.js"
  }
}
</script>
```

Локально `ant-ui` отдаётся `npm start` по адресу `http://localhost:3022/components/index.js`.

### 2. Сборка микрофронта

В бандлере микрофронта `ant-ui` и React — **external** (их подставит import map):

```js
external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'ant-ui'],
```

### 3. Корень микрофронта

```tsx
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider, UiProvider, createModalManager } from 'ant-ui';

export const modals = createModalManager(); // свой экземпляр на микрофронт
const queryClient = new QueryClient(); // свой кеш на микрофронт

createRoot(el).render(
  <QueryClientProvider client={queryClient}>
    <UiProvider>
      <modals.Provider>
        <App />
      </modals.Provider>
    </UiProvider>
  </QueryClientProvider>,
);
```

- `UiProvider` — тема, локаль (ru) и уведомления (`App` из antd) компонентов.
- `modals.Provider` — рендерит модалки этого микрофронта внутри его дерева, поэтому в модалках доступны его `QueryClient`, роутер и прочие контексты.

## Правила

1. **react-query импортировать только из `ant-ui`**: `import { useQuery } from 'ant-ui'`.
   Прямой `import '@tanstack/react-query'` даст вторую копию модуля, и хуки ant-ui не увидят ваш `QueryClientProvider` (ошибка *No QueryClient set*).
2. **antd в микрофронтах не использовать.** Нужен компонент — он добавляется в ant-ui.
3. **`ant-ui` никогда не зашивать в бандл** — ни в микрофронт, ни в промежуточную библиотеку. Иначе появится вторая копия antd, react-query и модалок.

Для контроля удобно правило eslint:

```js
'no-restricted-imports': ['error', {
  paths: [
    { name: 'antd', message: 'Используйте компоненты из ant-ui' },
    { name: '@tanstack/react-query', message: 'Импортируйте из ant-ui' },
  ],
  patterns: [{ group: ['antd/*'], message: 'Используйте компоненты из ant-ui' }],
}],
```

## Промежуточные библиотеки

Схема работает, если ant-ui используется в другой библиотеке, а та — в микрофронте:

```
import map: react, ant-ui  ──►  один экземпляр
        ▲
lib-B (external: react, ant-ui)
        ▲
микрофронт (external: react, ant-ui)
```

Для lib-B:
- `ant-ui` — в `peerDependencies` (диапазоном, например `^1.0.0`) и в `external`;
- React-зависимости — в `external`;
- модалки открывать через `useModals()` (берёт менеджер того микрофронта, где отрендерен компонент), свой `createModalManager()` не создавать;
- `QueryClient` брать через `useQueryClient()`, свой не создавать.

В import map одна версия ant-ui на всех — изменения ломающие API только с мажорной версией.

## Модалки

```tsx
import { Modal, useModal, useModals } from 'ant-ui';

const ConfirmModal = ({ text }: { text: string }) => {
  const modal = useModal<boolean>();
  return (
    <Modal
      title="Подтверждение"
      onOk={() => {
        modal.resolve(true);
        modal.hide();
      }}
    >
      {text}
    </Modal>
  );
};

// в компоненте
const modals = useModals();
const ok = await modals.show(ConfirmModal, { text: 'Удалить запись?' });

// вне React — через экземпляр микрофронта
modals.show(ConfirmModal, { text: '...' });
```

- `Modal` и `Drawer` из ant-ui внутри модалки, открытой через `show()`, сами управляют открытием, закрытием и удалением из дерева.
- Если модалку закрыли без `resolve`, промис `show()` завершается значением `undefined`.
- Повторный `show()` того же компонента переоткрывает его с новыми props.

## Моки запросов (MSW)

В Storybook запросы мокаются через [MSW](https://mswjs.io) и `msw-storybook-addon`. В сборку библиотеки моки не попадают.

```
public/mockServiceWorker.js   # service worker MSW (генерируется: npx msw init public)
src/mocks/data/               # фикстуры
src/mocks/handlers/           # хендлеры по сценариям: success / empty / error / loading
src/mocks/handlers/index.ts   # defaultHandlers — подключены для всех историй
src/examples/                 # пример компонента с useQuery и его истории
```

Хендлеры по умолчанию подключаются в `.storybook/preview.tsx`. Чтобы история использовала другой сценарий, подключите его в `beforeEach`:

```ts
export const ServerError: Story = {
  beforeEach({ msw }) {
    msw.use(usersHandlers.error);
  },
};
```

Для каждой истории создаётся новый `QueryClient` с `retry: false`, поэтому кеш не переходит между историями, а ошибка показывается сразу.

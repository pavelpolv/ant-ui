import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ComponentProps,
  type ComponentType,
  type ReactNode,
} from 'react';

type AnyComponent = ComponentType<any>;

type ShowArgs<C extends AnyComponent> = {} extends ComponentProps<C>
  ? [props?: ComponentProps<C>]
  : [props: ComponentProps<C>];

interface ModalEntry {
  id: number;
  component: AnyComponent;
  props: object;
  visible: boolean;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

export interface ModalHandler<R = unknown> {
  /** Модалка открыта (false — идёт анимация закрытия). */
  visible: boolean;
  /** Закрыть с анимацией; после неё нужно вызвать remove (это делают Modal/Drawer). */
  hide: () => void;
  /** Удалить модалку из дерева (незавершённый промис show() получит undefined). */
  remove: () => void;
  /** Завершить промис show() значением. */
  resolve: (value: R) => void;
  /** Завершить промис show() ошибкой. */
  reject: (reason?: unknown) => void;
}

export interface ModalManager {
  /** Открыть модалку. Повторный show того же компонента обновляет props и переоткрывает её. */
  show<C extends AnyComponent, R = unknown>(component: C, ...args: ShowArgs<C>): Promise<R>;
  hide(component: AnyComponent): void;
  remove(component: AnyComponent): void;
  /** Ставится один раз в корень своего React-дерева (микрофронта). */
  Provider: ComponentType<{ children?: ReactNode }>;
}

const ManagerContext = createContext<ModalManager | null>(null);
const ModalContext = createContext<ModalHandler | null>(null);

/**
 * Создаёт изолированный менеджер модалок.
 * Состояние хранится в замыкании, поэтому у каждого микрофронта свой экземпляр,
 * хотя сама библиотека общая (подключена через import map).
 */
export function createModalManager(): ModalManager {
  let entries: ModalEntry[] = [];
  let seq = 0;
  const listeners = new Set<() => void>();

  const setEntries = (next: ModalEntry[]) => {
    entries = next;
    listeners.forEach((listener) => listener());
  };
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const getSnapshot = () => entries;

  const update = (component: AnyComponent, patch: Partial<ModalEntry>) =>
    setEntries(entries.map((entry) => (entry.component === component ? { ...entry, ...patch } : entry)));

  const manager: ModalManager = {
    show(component, ...args) {
      return new Promise((resolve, reject) => {
        const entry: ModalEntry = {
          id: ++seq,
          component,
          props: args[0] ?? {},
          visible: true,
          resolve: resolve as (value: unknown) => void,
          reject,
        };
        const exists = entries.some((e) => e.component === component);
        setEntries(exists ? entries.map((e) => (e.component === component ? entry : e)) : [...entries, entry]);
      });
    },
    hide(component) {
      update(component, { visible: false });
    },
    remove(component) {
      // если модалку закрыли без resolve/reject, промис show() завершается undefined
      entries.find((entry) => entry.component === component)?.resolve(undefined);
      setEntries(entries.filter((entry) => entry.component !== component));
    },
    Provider({ children }) {
      const list = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
      return (
        <ManagerContext.Provider value={manager}>
          {children}
          {list.map(({ id, component: Component, props, visible, resolve, reject }) => (
            <ModalContext.Provider
              key={id}
              value={{
                visible,
                hide: () => manager.hide(Component),
                remove: () => manager.remove(Component),
                resolve,
                reject,
              }}
            >
              <Component {...props} />
            </ModalContext.Provider>
          ))}
        </ManagerContext.Provider>
      );
    },
  };

  return manager;
}

/** Менеджер ближайшего Provider — для компонентов, которые не знают, в каком микрофронте живут. */
export function useModals(): ModalManager {
  const manager = useContext(ManagerContext);
  if (!manager) {
    throw new Error('useModals: не найден Provider. Оберните дерево в modals.Provider из createModalManager().');
  }
  return manager;
}

/** Управление текущей модалкой изнутри её компонента. */
export function useModal<R = unknown>(): ModalHandler<R> {
  const modal = useContext(ModalContext);
  if (!modal) {
    throw new Error('useModal: компонент открыт не через show().');
  }
  return modal as ModalHandler<R>;
}

/** То же, что useModal, но без ошибки вне show() — для Modal/Drawer, которые можно рендерить и вручную. */
export function useOptionalModal(): ModalHandler | null {
  return useContext(ModalContext);
}

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ComponentProps,
  type ComponentType,
  type ReactNode,
} from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
  visible: boolean;
  hide: () => void;
  remove: () => void;
  resolve: (value: R) => void;
  reject: (reason?: unknown) => void;
}

export interface ModalManager {
  show<C extends AnyComponent, R = unknown>(component: C, ...args: ShowArgs<C>): Promise<R>;
  hide(component: AnyComponent): void;
  remove(component: AnyComponent): void;
  Provider: ComponentType<{ children?: ReactNode }>;
}

const ManagerContext = createContext<ModalManager | null>(null);
const ModalContext = createContext<ModalHandler | null>(null);

export const createModalManager = (): ModalManager => {
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
};

export const useModals = (): ModalManager => {
  const manager = useContext(ManagerContext);
  if (!manager) {
    throw new Error('useModals: не найден Provider. Оберните дерево в modals.Provider из createModalManager().');
  }
  return manager;
};

export const useModal = <R = unknown,>(): ModalHandler<R> => {
  const modal = useContext(ModalContext);
  if (!modal) {
    throw new Error('useModal: компонент открыт не через show().');
  }
  return modal as ModalHandler<R>;
};

export const useOptionalModal = (): ModalHandler | null => useContext(ModalContext);

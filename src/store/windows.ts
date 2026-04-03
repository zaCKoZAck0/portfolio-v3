import { create } from "zustand";

// ─── Window State Types ────────────────────────────────────────────────────────

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized?: boolean;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  /** Extensible metadata bag for per-window custom state */
  meta: Record<string, unknown>;
}

// ─── Store Shape ───────────────────────────────────────────────────────────────

interface WindowsStore {
  windows: Record<string, WindowState>;
  nextZIndex: number;

  // Lifecycle
  openWindow: (id: string, defaults?: Partial<WindowState>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;

  // Spatial
  updatePosition: (id: string, pos: WindowPosition) => void;
  updateSize: (id: string, size: WindowSize) => void;
  focusWindow: (id: string) => void;

  // Generic patch for extensibility
  patchWindow: (id: string, patch: Partial<WindowState>) => void;
}

// ─── Default values ────────────────────────────────────────────────────────────

const DEFAULT_SIZE: WindowSize = { width: 640, height: 420 };
const DEFAULT_POSITION: WindowPosition = { x: 180, y: 80 };

const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 1024;

const makeTitle = (id: string) => id.charAt(0).toUpperCase() + id.slice(1);

// ─── Store ─────────────────────────────────────────────────────────────────────

export const useWindowsStore = create<WindowsStore>((set) => ({
  windows: {
    files: {
      id: "files",
      title: "Files",
      isOpen: true,
      isMinimized: false,
      isMaximized: isSmallScreen,
      position: { x: 200, y: 40 },
      size: { width: 720, height: 460 },
      zIndex: 1,
      meta: {},
    },
    code: {
      id: "code",
      title: "Code",
      isOpen: true,
      isMinimized: false,
      isMaximized: isSmallScreen,
      position: { x: 100, y: 10 },
      size: { width: 1100, height: 640 },
      zIndex: 2,
      meta: {},
    },
    browser: {
      id: "browser",
      title: "Browser",
      isOpen: false,
      isMinimized: false,
      isMaximized: isSmallScreen,
      position: { x: 150, y: 30 },
      size: { width: 960, height: 600 },
      zIndex: 0,
      meta: {},
    },
  },
  nextZIndex: 3,

  openWindow: (id, defaults) =>
    set((state) => {
      const existing = state.windows[id];
      if (existing?.isOpen && !existing.isMinimized) {
        // Already open — just focus it
        return {
          windows: {
            ...state.windows,
            [id]: { ...existing, zIndex: state.nextZIndex },
          },
          nextZIndex: state.nextZIndex + 1,
        };
      }
      return {
        windows: {
          ...state.windows,
          [id]: {
            id,
            title: makeTitle(id),
            position: existing?.position ??
              defaults?.position ?? { ...DEFAULT_POSITION },
            size: existing?.size ?? defaults?.size ?? { ...DEFAULT_SIZE },
            meta: existing?.meta ?? defaults?.meta ?? {},
            ...defaults,
            isOpen: true,
            isMinimized: false,
            isMaximized: existing?.isMaximized ?? false,
            zIndex: state.nextZIndex,
          } as WindowState,
        },
        nextZIndex: state.nextZIndex + 1,
      };
    }),

  closeWindow: (id) =>
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;
      return {
        windows: {
          ...state.windows,
          [id]: { ...win, isOpen: false, isMinimized: false },
        },
      };
    }),

  minimizeWindow: (id) =>
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;
      return {
        windows: {
          ...state.windows,
          [id]: { ...win, isMinimized: true },
        },
      };
    }),

  toggleMaximize: (id) =>
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;
      return {
        windows: {
          ...state.windows,
          [id]: {
            ...win,
            isMaximized: !win.isMaximized,
            zIndex: state.nextZIndex,
          },
        },
        nextZIndex: state.nextZIndex + 1,
      };
    }),

  updatePosition: (id, pos) =>
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;
      return {
        windows: {
          ...state.windows,
          [id]: { ...win, position: pos },
        },
      };
    }),

  updateSize: (id, size) =>
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;
      return {
        windows: {
          ...state.windows,
          [id]: { ...win, size },
        },
      };
    }),

  focusWindow: (id) =>
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;
      return {
        windows: {
          ...state.windows,
          [id]: { ...win, zIndex: state.nextZIndex },
        },
        nextZIndex: state.nextZIndex + 1,
      };
    }),

  patchWindow: (id, patch) =>
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;
      return {
        windows: {
          ...state.windows,
          [id]: { ...win, ...patch },
        },
      };
    }),
}));

import React, { createContext, useContext, useState } from "react";

interface WindowState {
  id: string;
  isOpen: boolean;
  isMinimized: boolean;
  title: string;
}

interface AppContextType {
  windows: Record<string, WindowState>;
  openWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  closeWindow: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    finder: { id: "finder", isOpen: true, isMinimized: false, title: "Finder" },
  });

  const openWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false,
        title: id.charAt(0).toUpperCase() + id.slice(1),
      },
    }));
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false, isMinimized: false },
    }));
  };

  return (
    <AppContext.Provider
      value={{ windows, openWindow, minimizeWindow, closeWindow }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
}

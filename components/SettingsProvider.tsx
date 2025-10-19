'use client';

import * as React from "react";
import { fetchSettings, type SettingsDoc } from "@/lib/firestore";

interface SettingsContextValue {
  settings: SettingsDoc | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  setSettings: (value: SettingsDoc | null) => void;
}

const SettingsContext = React.createContext<SettingsContextValue | undefined>(
  undefined
);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [settings, setSettings] = React.useState<SettingsDoc | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const refresh = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchSettings();
      if (data) {
        setSettings(data);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = React.useMemo<SettingsContextValue>(
    () => ({
      settings,
      isLoading,
      refresh,
      setSettings,
    }),
    [settings, isLoading, refresh]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};

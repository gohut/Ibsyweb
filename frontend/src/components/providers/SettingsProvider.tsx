"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { type AppSettings } from "@/lib/settings";
import { deriveThemeVariables } from "@/lib/theme";

type SettingsContextValue = {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({
  children,
  initialSettings,
}: PropsWithChildren<{
  initialSettings: AppSettings;
}>) {
  const [settings, setSettings] = useState<AppSettings>(initialSettings);

  useEffect(() => {
    const root = document.documentElement;
    const variables = deriveThemeVariables(settings.website);

    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [settings]);

  const value = useMemo(
    () => ({
      settings,
      setSettings,
    }),
    [settings],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
}

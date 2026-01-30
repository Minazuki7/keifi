"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

type SiteSettings = {
  whatsappPhone: string;
  googleFormUrl: string;
};

type SettingsContextType = {
  settings: SiteSettings;
  isLoading: boolean;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  resetSettings: () => void;
};

const defaultSettings: SiteSettings = {
  whatsappPhone: "21612345678",
  googleFormUrl: "https://forms.gle/your-form-id",
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings({ ...defaultSettings, ...data });
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = useCallback(async (newSettings: SiteSettings) => {
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
    } catch {}
  }, []);

  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      saveSettings(updated);
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{ settings, isLoading, updateSettings, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

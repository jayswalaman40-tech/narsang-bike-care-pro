import { create } from 'zustand';
import type { Language, GarageSettings } from '../types';
import { settingsService } from '../services/api';

interface UIState {
  language: Language;
  settings: GarageSettings | null;
  mechanicWhatsapp: string;
  isDrawerOpen: boolean;

  // Actions
  setLanguage: (lang: Language) => void;
  setMechanicWhatsapp: (wa: string) => void;
  toggleDrawer: () => void;
  closeDrawer: () => void;
  fetchSettings: () => Promise<void>;
}

const defaultMechanicWA = import.meta.env.VITE_MECHANIC_WHATSAPP || '7202807340';

export const useUIStore = create<UIState>((set) => ({
  language: 'en',
  settings: null,
  mechanicWhatsapp: defaultMechanicWA,
  isDrawerOpen: false,

  setLanguage: (lang) => {
    set({ language: lang });
    // Keep it in sync if needed, though i18next handles actual resolution
  },
  
  setMechanicWhatsapp: (wa) => set({ mechanicWhatsapp: wa }),
  
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  
  closeDrawer: () => set({ isDrawerOpen: false }),

  fetchSettings: async () => {
    try {
      const settings = await settingsService.get();
      if (settings) {
        set({ settings, mechanicWhatsapp: settings.mechanic_whatsapp });
      }
    } catch (err) {
      console.error("Failed to fetch settings", err);
    }
  }
}));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// TypeScript interfaces for type safety

export type IJsonData = {
  baseinfo: {
    id: number;
    title: string;
    description: string;
  };
  componentSchema: string[];
};
export interface SavedInterface {
  id: string;
  content: string | IJsonData;
  timestamp: string;
}

export interface InterfaceStore {
  preViewPath: string | null;
  setPreViewPath: (value: string) => void;
  currentInterface: SavedInterface | null;
  setCurrentInterface: (value: SavedInterface | null) => void;
  savedInterfaces: SavedInterface[];
  updateInterface: (interfaceData: SavedInterface[]) => void;
  removeInterface: (id: string) => void;
  clearInterfaces: () => void;
}

// Zustand store with localStorage persistence
export const useInterfaceStore = create<InterfaceStore>()(
  persist(
    set => ({
      preViewPath: '',
      setPreViewPath: (value: string) => set({ preViewPath: value }),
      currentInterface: null,
      setCurrentInterface: (value: SavedInterface | null) => set({ currentInterface: value }),
      savedInterfaces: [],
      updateInterface: (interfaceData: SavedInterface[]) => set({ savedInterfaces: interfaceData }),
      removeInterface: (id: string) =>
        set(state => ({
          savedInterfaces: state.savedInterfaces.filter(item => item.id !== id),
        })),
      clearInterfaces: () => set({ savedInterfaces: [] }),
    }),
    {
      name: 'interface-store', // localStorage key
      // Optional: customize what gets persisted
      partialize: state => ({
        savedInterfaces: state.savedInterfaces,
      }),
    },
  ),
);

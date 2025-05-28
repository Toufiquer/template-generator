import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// TypeScript interfaces for type safety
export interface SavedInterface {
  id: string;
  content: string;
  timestamp: string;
  title: string;
}

export interface InterfaceStore {
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

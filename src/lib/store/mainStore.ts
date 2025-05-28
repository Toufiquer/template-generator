import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// TypeScript interfaces for type safety
export interface SavedInterface {
  id: number;
  content: string;
  timestamp: string;
}

export interface InterfaceStore {
  interfaceString: string;
  setInterfaceString: (value: string) => void;
  savedInterfaces: SavedInterface[];
  addInterface: (interfaceData: string) => void;
  removeInterface: (id: number) => void;
  clearInterfaces: () => void;
}

// Zustand store with localStorage persistence
export const useInterfaceStore = create<InterfaceStore>()(
  persist(
    (set) => ({
      interfaceString: '',
      setInterfaceString: (value: string) => set({ interfaceString: value }),
      savedInterfaces: [],
      addInterface: (interfaceData: string) => set((state) => ({
        savedInterfaces: [...state.savedInterfaces, {
          id: Date.now(),
          content: interfaceData,
          timestamp: new Date().toISOString()
        }]
      })),
      removeInterface: (id: number) => set((state) => ({
        savedInterfaces: state.savedInterfaces.filter(item => item.id !== id)
      })),
      clearInterfaces: () => set({ savedInterfaces: [] })
    }),
    {
      name: 'interface-store', // localStorage key
      // Optional: customize what gets persisted
      partialize: (state) => ({
        savedInterfaces: state.savedInterfaces,
        interfaceString: state.interfaceString
      })
    }
  )
);
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
export interface ISavedInterfaceToLocalDB {
  id: string;
  content: string;
  timestamp: string;
}

export interface InterfaceStore {
  preViewPath: string | null;
  setPreViewPath: (value: string) => void;
  currentInterface: ISavedInterfaceToLocalDB | null;
  setCurrentInterface: (value: ISavedInterfaceToLocalDB | null) => void;
  interfaceDBArr: ISavedInterfaceToLocalDB[];
  updateInterface: (interfaceData: ISavedInterfaceToLocalDB[]) => void;
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
      setCurrentInterface: (value: ISavedInterfaceToLocalDB | null) => set({ currentInterface: value }),
      interfaceDBArr: [],
      updateInterface: (interfaceData: ISavedInterfaceToLocalDB[]) => set({ interfaceDBArr: interfaceData }),
      removeInterface: (id: string) =>
        set(state => ({
          interfaceDBArr: state.interfaceDBArr.filter(item => item.id !== id),
        })),
      clearInterfaces: () => set({ interfaceDBArr: [] }),
    }),
    {
      name: 'interface-store', // localStorage key
      // Optional: customize what gets persisted
      partialize: state => ({
        interfaceDBArr: state.interfaceDBArr,
      }),
    },
  ),
);

// store/jsonStore.ts
import { create } from 'zustand'

export interface JsonItem {
    id: string
    data: any
    timestamp: Date
}

export interface JsonStore {
    items: JsonItem[]
    addItem: (data: any) => void
    removeItem: (id: string) => void
    clearItems: () => void
}

export const useJsonStore = create<JsonStore>((set) => ({
    items: [],
    addItem: (data) =>
        set((state) => ({
            items: [
                ...state.items,
                {
                    id: Date.now().toString(),
                    data,
                    timestamp: new Date(),
                },
            ],
        })),
    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        })),
    clearItems: () => set({ items: [] }),
}))

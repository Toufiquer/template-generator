// store/jsonStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface JsonItem {
    id: string
    data: undefined | string | object | { uid: string; templateName: string }
    timestamp: Date
}

export interface JsonStore {
    items: JsonItem[]
    addItem: (data: undefined | string) => void
    removeItem: (id: string) => void
    clearItems: () => void
}

export const useJsonStore = create<JsonStore>()(
    persist(
        (set) => ({
            items: [],
            addItem: (data) =>
                set((state) => ({
                    items: [
                        {
                            id: Date.now().toString(),
                            data,
                            timestamp: new Date(),
                        },
                        ...state.items,
                    ],
                })),
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
            clearItems: () => set({ items: [] }),
        }),
        {
            name: 'json-storage', // unique name for the storage item
            storage: createJSONStorage(() => localStorage), // (optional) by default the storage is localStorage
        }
    )
)

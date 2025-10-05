// ../store/jsonStore.ts (Example - adjust based on your actual store implementation)
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

interface JsonItem {
    id: string
    data: any
    timestamp: number
}

interface JsonStore {
    items: JsonItem[]
    addItem: (data: any) => void
    removeItem: (id: string) => void
    updateItem: (id: string, newData: any) => void // Add this line
    clearItems: () => void
}

export const useJsonStore = create<JsonStore>()(
    persist(
        (set) => ({
            items: [],
            addItem: (data) =>
                set((state) => ({
                    items: [
                        { id: uuidv4(), data, timestamp: Date.now() },
                        ...state.items,
                    ],
                })),
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
            updateItem: (
                id,
                newData // Implement updateItem
            ) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id
                            ? { ...item, data: newData, timestamp: Date.now() }
                            : item
                    ),
                })),
            clearItems: () => set({ items: [] }),
        }),
        {
            name: 'json-storage', // name of the item in the storage (e.g. localStorage)
            storage: createJSONStorage(() => localStorage), // use localStorage as the storage
        }
    )
)

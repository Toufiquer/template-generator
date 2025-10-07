import { create } from 'zustand'
import { ITesta, defaultTesta } from './data/data'
import { TestaStore } from './store-type'
import { queryParams } from './store-constant'

export const useTestaStore = create<TestaStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    testa: [],
    selectedTesta: null,
    newTesta: defaultTesta,
    isBulkEditModalOpen: false,
    isBulkDynamicUpdateModal: false,
    isBulkUpdateModalOpen: false,
    isBulkDeleteModalOpen: false,
    isAddModalOpen: false,
    isViewModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    bulkData: [],
    setQueryPramsLimit: (payload: number) => set({ queryPramsLimit: payload }),
    setQueryPramsPage: (payload: number) => set({ queryPramsPage: payload }),
    setQueryPramsQ: (payload: string) => set({ queryPramsQ: payload }),
    setBulkData: (bulkData: ITesta[]) => set({ bulkData }),
    setTesta: (testa: ITesta[]) => set({ testa }),
    setSelectedTesta: (Testa) => set({ selectedTesta: Testa }),
    setNewTesta: (Testa) =>
        set((state) => ({
            newTesta:
                typeof Testa === 'function' ? Testa(state.newTesta) : Testa,
        })),
    toggleAddModal: (data) => set({ isAddModalOpen: data }),
    toggleViewModal: (data) => set({ isViewModalOpen: data }),
    toggleEditModal: (data) => set({ isEditModalOpen: data }),
    toggleDeleteModal: (data) => set({ isDeleteModalOpen: data }),
    toggleBulkEditModal: (data) => set({ isBulkEditModalOpen: data }),
    toggleBulkUpdateModal: (data) => set({ isBulkUpdateModalOpen: data }),
    toggleBulkDynamicUpdateModal: (data) =>
        set({ isBulkDynamicUpdateModal: data }),
    toggleBulkDeleteModal: (data) => set({ isBulkDeleteModalOpen: data }),
}))

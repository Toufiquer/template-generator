import { create } from 'zustand'
import { IMvs ,defaultMvs} from '../store/data/data'
import { MvsStore } from '../store/store-type' 
import { queryParams } from '../store/store-constant';

export const useMvsStore = create<MvsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    mvs: [],
    selectedMvs: null,
    newMvs: defaultMvs,
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
    setBulkData: (bulkData: IMvs[]) => set({ bulkData }),
    setMvs: (mvs: IMvs[]) =>
        set({ mvs }),
    setSelectedMvs: (Mvs) =>
        set({ selectedMvs: Mvs }),
    setNewMvs: (Mvs) =>
        set((state) => ({
            newMvs:
                typeof Mvs === 'function'
                    ? Mvs(state.newMvs)
                    : Mvs,
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

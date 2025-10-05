import { create } from 'zustand'
import { IMvs2 ,defaultMvs2} from '../store/data/data'
import { Mvs2Store } from '../store/store-type' 
import { queryParams } from '../store/store-constant';

export const useMvs2Store = create<Mvs2Store>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    mvs2: [],
    selectedMvs2: null,
    newMvs2: defaultMvs2,
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
    setBulkData: (bulkData: IMvs2[]) => set({ bulkData }),
    setMvs2: (mvs2: IMvs2[]) =>
        set({ mvs2 }),
    setSelectedMvs2: (Mvs2) =>
        set({ selectedMvs2: Mvs2 }),
    setNewMvs2: (Mvs2) =>
        set((state) => ({
            newMvs2:
                typeof Mvs2 === 'function'
                    ? Mvs2(state.newMvs2)
                    : Mvs2,
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

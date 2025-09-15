import { create } from 'zustand'
import { ITest2s ,defaultTest2s} from '@/app/generate/test2s/all/store/data/data'
import { Test2sStore } from '@/app/generate/test2s/all/store/store-type' 
import { queryParams } from '@/app/generate/test2s/all/store/store-constant';

export const useTest2sStore = create<Test2sStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    test2s: [],
    selectedTest2s: null,
    newTest2s: defaultTest2s,
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
    setBulkData: (bulkData: ITest2s[]) => set({ bulkData }),
    setTest2s: (test2s: ITest2s[]) =>
        set({ test2s }),
    setSelectedTest2s: (Test2s) =>
        set({ selectedTest2s: Test2s }),
    setNewTest2s: (Test2s) =>
        set((state) => ({
            newTest2s:
                typeof Test2s === 'function'
                    ? Test2s(state.newTest2s)
                    : Test2s,
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

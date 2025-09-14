import { create } from 'zustand'
import { INews1es ,defaultNews1es} from '@/app/generate/news1es/all/store/data/data'
import { News1esStore } from '@/app/generate/news1es/all/store/store-type' 
import { queryParams } from '@/app/generate/news1es/all/store/store-constant';

export const useNews1esStore = create<News1esStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    news1es: [],
    selectedNews1es: null,
    newNews1es: defaultNews1es,
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
    setBulkData: (bulkData: INews1es[]) => set({ bulkData }),
    setNews1es: (news1es: INews1es[]) =>
        set({ news1es }),
    setSelectedNews1es: (News1es) =>
        set({ selectedNews1es: News1es }),
    setNewNews1es: (News1es) =>
        set((state) => ({
            newNews1es:
                typeof News1es === 'function'
                    ? News1es(state.newNews1es)
                    : News1es,
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

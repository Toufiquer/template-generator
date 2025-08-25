import { create } from 'zustand'
import { IAccesses ,defaultAccesses} from '@/app/dashboard/accessess/all/api/v1/model'
import { AccessesStore } from '@/app/dashboard/accessess/all/store/store-type' 
import { queryParams } from '@/app/dashboard/accessess/all/store/store-constant';

export const useAccessesStore = create<AccessesStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    accessess: [],
    selectedAccesses: null,
    newAccesses: defaultAccesses,
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
    setBulkData: (bulkData: IAccesses[]) => set({ bulkData }),
    setAccesses: (accessess: IAccesses[]) =>
        set({ accessess }),
    setSelectedAccesses: (Accesses) =>
        set({ selectedAccesses: Accesses }),
    setNewAccesses: (Accesses) =>
        set((state) => ({
            newAccesses:
                typeof Accesses === 'function'
                    ? Accesses(state.newAccesses)
                    : Accesses,
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

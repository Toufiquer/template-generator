import { create } from 'zustand'
import { IPostsa ,defaultPostsa} from '../store/data/data'
import { PostsaStore } from '../store/store-type' 
import { queryParams } from '../store/store-constant';

export const usePostsaStore = create<PostsaStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    postsa: [],
    selectedPostsa: null,
    newPostsa: defaultPostsa,
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
    setBulkData: (bulkData: IPostsa[]) => set({ bulkData }),
    setPostsa: (postsa: IPostsa[]) =>
        set({ postsa }),
    setSelectedPostsa: (Postsa) =>
        set({ selectedPostsa: Postsa }),
    setNewPostsa: (Postsa) =>
        set((state) => ({
            newPostsa:
                typeof Postsa === 'function'
                    ? Postsa(state.newPostsa)
                    : Postsa,
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

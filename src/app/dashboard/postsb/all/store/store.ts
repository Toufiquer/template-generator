import { create } from 'zustand'
import { IPostsb ,defaultPostsb} from '../store/data/data'
import { PostsbStore } from '../store/store-type' 
import { queryParams } from '../store/store-constant';

export const usePostsbStore = create<PostsbStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    postsb: [],
    selectedPostsb: null,
    newPostsb: defaultPostsb,
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
    setBulkData: (bulkData: IPostsb[]) => set({ bulkData }),
    setPostsb: (postsb: IPostsb[]) =>
        set({ postsb }),
    setSelectedPostsb: (Postsb) =>
        set({ selectedPostsb: Postsb }),
    setNewPostsb: (Postsb) =>
        set((state) => ({
            newPostsb:
                typeof Postsb === 'function'
                    ? Postsb(state.newPostsb)
                    : Postsb,
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

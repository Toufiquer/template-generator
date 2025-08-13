import { create } from 'zustand'
import { IBlogs } from '@/app/dashboard/blogs/all/api/v1/model'
import { BlogsStore } from '@/app/dashboard/blogs/all/store/StoreTypes'
import {
    baseIBlogs,
    queryParams,
} from '@/app/dashboard/blogs/all/store/StoreConstants'

export const useBlogsStore = create<BlogsStore>((set) => ({
    queryPramsLimit: queryParams.limit,
    queryPramsPage: queryParams.page,
    queryPramsQ: queryParams.q,
    blogs: [],
    selectedBlogs: null,
    newBlogs: baseIBlogs,
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
    setBulkData: (bulkData: IBlogs[]) => set({ bulkData }),
    setBlogs: (blogs: IBlogs[]) =>
        set({ blogs }),
    setSelectedBlogs: (Blogs) =>
        set({ selectedBlogs: Blogs }),
    setNewBlogs: (Blogs) =>
        set((state) => ({
            newBlogs:
                typeof Blogs === 'function'
                    ? Blogs(state.newBlogs)
                    : Blogs,
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

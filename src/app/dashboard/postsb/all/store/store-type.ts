import { IPostsb } from './data/data'

export interface PostsbStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    postsb: IPostsb[]
    selectedPostsb: IPostsb | null
    newPostsb: Partial<IPostsb>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewPostsb: React.Dispatch<
        React.SetStateAction<Partial<IPostsb>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IPostsb[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setPostsb: (Postsb: IPostsb[]) => void
    setSelectedPostsb: (Postsb: IPostsb | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Postsb: boolean) => void
    toggleBulkUpdateModal: (Postsb: boolean) => void
    toggleBulkDynamicUpdateModal: (Postsb: boolean) => void
    toggleBulkDeleteModal: (Postsb: boolean) => void
    setBulkData: (bulkData: IPostsb[]) => void
}

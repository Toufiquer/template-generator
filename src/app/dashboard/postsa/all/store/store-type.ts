import { IPostsa } from '../data/data'

export interface PostsaStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    postsa: IPostsa[]
    selectedPostsa: IPostsa | null
    newPostsa: Partial<IPostsa>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewPostsa: React.Dispatch<
        React.SetStateAction<Partial<IPostsa>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IPostsa[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setPostsa: (Postsa: IPostsa[]) => void
    setSelectedPostsa: (Postsa: IPostsa | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Postsa: boolean) => void
    toggleBulkUpdateModal: (Postsa: boolean) => void
    toggleBulkDynamicUpdateModal: (Postsa: boolean) => void
    toggleBulkDeleteModal: (Postsa: boolean) => void
    setBulkData: (bulkData: IPostsa[]) => void
}

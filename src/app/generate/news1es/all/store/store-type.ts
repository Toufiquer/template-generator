import { INews1es } from '@/app/generate/news1es/all/api/v1/model'

export interface News1esStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    news1es: INews1es[]
    selectedNews1es: INews1es | null
    newNews1es: Partial<INews1es>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewNews1es: React.Dispatch<
        React.SetStateAction<Partial<INews1es>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: INews1es[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setNews1es: (News1es: INews1es[]) => void
    setSelectedNews1es: (News1es: INews1es | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (News1es: boolean) => void
    toggleBulkUpdateModal: (News1es: boolean) => void
    toggleBulkDynamicUpdateModal: (News1es: boolean) => void
    toggleBulkDeleteModal: (News1es: boolean) => void
    setBulkData: (bulkData: INews1es[]) => void
}

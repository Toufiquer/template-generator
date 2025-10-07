import { ITesta } from './data/data'

export interface TestaStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    testa: ITesta[]
    selectedTesta: ITesta | null
    newTesta: Partial<ITesta>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewTesta: React.Dispatch<
        React.SetStateAction<Partial<ITesta>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: ITesta[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setTesta: (Testa: ITesta[]) => void
    setSelectedTesta: (Testa: ITesta | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Testa: boolean) => void
    toggleBulkUpdateModal: (Testa: boolean) => void
    toggleBulkDynamicUpdateModal: (Testa: boolean) => void
    toggleBulkDeleteModal: (Testa: boolean) => void
    setBulkData: (bulkData: ITesta[]) => void
}

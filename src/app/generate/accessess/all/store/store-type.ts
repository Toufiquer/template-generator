import { IAccesses } from '@/app/dashboard/accessess/all/api/v1/model'

export interface AccessesStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    accessess: IAccesses[]
    selectedAccesses: IAccesses | null
    newAccesses: Partial<IAccesses>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewAccesses: React.Dispatch<
        React.SetStateAction<Partial<IAccesses>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IAccesses[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setAccesses: (Accesses: IAccesses[]) => void
    setSelectedAccesses: (Accesses: IAccesses | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Accesses: boolean) => void
    toggleBulkUpdateModal: (Accesses: boolean) => void
    toggleBulkDynamicUpdateModal: (Accesses: boolean) => void
    toggleBulkDeleteModal: (Accesses: boolean) => void
    setBulkData: (bulkData: IAccesses[]) => void
}

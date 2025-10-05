import { IMvs2 } from '../data/data'

export interface Mvs2Store {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    mvs2: IMvs2[]
    selectedMvs2: IMvs2 | null
    newMvs2: Partial<IMvs2>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewMvs2: React.Dispatch<
        React.SetStateAction<Partial<IMvs2>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IMvs2[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setMvs2: (Mvs2: IMvs2[]) => void
    setSelectedMvs2: (Mvs2: IMvs2 | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Mvs2: boolean) => void
    toggleBulkUpdateModal: (Mvs2: boolean) => void
    toggleBulkDynamicUpdateModal: (Mvs2: boolean) => void
    toggleBulkDeleteModal: (Mvs2: boolean) => void
    setBulkData: (bulkData: IMvs2[]) => void
}

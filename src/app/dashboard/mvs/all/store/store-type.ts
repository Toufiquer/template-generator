import { IMvs } from '@/app/generate/mvs/all/api/v1/model'

export interface MvsStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    mvs: IMvs[]
    selectedMvs: IMvs | null
    newMvs: Partial<IMvs>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewMvs: React.Dispatch<
        React.SetStateAction<Partial<IMvs>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IMvs[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setMvs: (Mvs: IMvs[]) => void
    setSelectedMvs: (Mvs: IMvs | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Mvs: boolean) => void
    toggleBulkUpdateModal: (Mvs: boolean) => void
    toggleBulkDynamicUpdateModal: (Mvs: boolean) => void
    toggleBulkDeleteModal: (Mvs: boolean) => void
    setBulkData: (bulkData: IMvs[]) => void
}

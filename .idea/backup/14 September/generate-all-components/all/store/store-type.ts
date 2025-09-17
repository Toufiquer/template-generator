import { ITest2s } from '@/app/generate/test2s/all/api/v1/model'

export interface Test2sStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    test2s: ITest2s[]
    selectedTest2s: ITest2s | null
    newTest2s: Partial<ITest2s>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewTest2s: React.Dispatch<
        React.SetStateAction<Partial<ITest2s>>
    >
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: ITest2s[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setTest2s: (Test2s: ITest2s[]) => void
    setSelectedTest2s: (Test2s: ITest2s | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Test2s: boolean) => void
    toggleBulkUpdateModal: (Test2s: boolean) => void
    toggleBulkDynamicUpdateModal: (Test2s: boolean) => void
    toggleBulkDeleteModal: (Test2s: boolean) => void
    setBulkData: (bulkData: ITest2s[]) => void
}

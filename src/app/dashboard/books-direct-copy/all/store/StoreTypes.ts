// import { IBooks } from '@/app/api/v1/Books/filename7Model';
import { IBooks } from '../api/v1/model'

export interface BooksStore {
    queryPramsLimit: number
    queryPramsPage: number
    queryPramsQ: string
    books: IBooks[]
    selectedBooks: IBooks | null
    newBooks: Partial<IBooks>
    isAddModalOpen: boolean
    isViewModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    setNewBooks: React.Dispatch<React.SetStateAction<Partial<IBooks>>>
    isBulkEditModalOpen: boolean
    isBulkUpdateModalOpen: boolean
    isBulkDynamicUpdateModal: boolean
    isBulkDeleteModalOpen: boolean
    bulkData: IBooks[]
    setQueryPramsLimit: (payload: number) => void
    setQueryPramsPage: (payload: number) => void
    setQueryPramsQ: (payload: string) => void
    setBooks: (Books: IBooks[]) => void
    setSelectedBooks: (Books: IBooks | null) => void
    toggleAddModal: (isOpen: boolean) => void
    toggleViewModal: (isOpen: boolean) => void
    toggleEditModal: (isOpen: boolean) => void
    toggleDeleteModal: (isOpen: boolean) => void
    toggleBulkEditModal: (Books: boolean) => void
    toggleBulkUpdateModal: (Books: boolean) => void
    toggleBulkDynamicUpdateModal: (Books: boolean) => void
    toggleBulkDeleteModal: (Books: boolean) => void
    setBulkData: (bulkData: IBooks[]) => void
}

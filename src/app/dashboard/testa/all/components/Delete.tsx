import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { ITesta, defaultTesta } from '../store/data/data'
import { useTestaStore } from '../store/store'
import { useDeleteTestaMutation } from '@/redux/features/testa/testaSlice'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedTesta,
        setSelectedTesta,
    } = useTestaStore()
    
    const [deleteTesta, { isLoading }] = useDeleteTestaMutation()

    const handleDelete = async () => {
        if (selectedTesta) {
            try {
                await deleteTesta({
                    id: selectedTesta._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Testa:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedTesta({ ...defaultTesta } as ITesta)
    }

    const displayName = (selectedTesta)?.['title'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedTesta && (
                    <div className="py-4">
                        <p>
                            You are about to delete this testa:{' '}
                            <span className="font-semibold">
                                {displayName}
                            </span>
                        </p>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteNextComponents

import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IAccesses, defaultAccesses } from '../api/v1/model'
import { useAccessesStore } from '../store/store'
import { useDeleteAccessesMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedAccesses,
        setSelectedAccesses,
    } = useAccessesStore()
    
    const [deleteAccess, { isLoading }] = useDeleteAccessesMutation()

    const handleDelete = async () => {
        if (selectedAccesses) {
            try {
                await deleteAccess({
                    id: selectedAccesses._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Access:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedAccesses({ ...defaultAccesses } as IAccesses)
    }

    const displayName = (selectedAccesses as any)?.['student'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedAccesses && (
                    <div className="py-4">
                        <p>
                            You are about to delete this access:{' '}
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

import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { INews1es, defaultNews1es } from '../store/data/data'
import { useNews1esStore } from '../store/store'
import { useDeleteNews1esMutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedNews1es,
        setSelectedNews1es,
    } = useNews1esStore()
    
    const [deleteNews1, { isLoading }] = useDeleteNews1esMutation()

    const handleDelete = async () => {
        if (selectedNews1es) {
            try {
                await deleteNews1({
                    id: selectedNews1es._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete News1:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedNews1es({ ...defaultNews1es } as INews1es)
    }

    const displayName = (selectedNews1es as any)?.['title1'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedNews1es && (
                    <div className="py-4">
                        <p>
                            You are about to delete this news1:{' '}
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

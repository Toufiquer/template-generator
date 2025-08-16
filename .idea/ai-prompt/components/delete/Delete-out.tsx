import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IPosts } from '../api/v1/model'
import { usePostsStore } from '../store/Store'
import { baseIPosts } from '../store/StoreConstants'
import { useDeletePostsMutation } from '../redux/rtk-Api'

import { handleSuccess } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedPosts,
        setSelectedPosts,
    } = usePostsStore()
    const [deletePosts] = useDeletePostsMutation()

    const handleDeletePosts = async () => {
        if (selectedPosts) {
            try {
                await deletePosts({
                    id: selectedPosts._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Posts:', error)
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedPosts({ ...baseIPosts } as IPosts)
    }

    const { name = '' } = selectedPosts || {}

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedPosts && (
                    <div className="py-4">
                        <p>
                            You are about to delete Posts:{' '}
                            <span className="font-semibold">
                                {(name as string) || ''}
                            </span>
                        </p>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        className="cursor-pointer border-1 border-slate-400 hover:border-slate-500"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="text-rose-400 hover:text-rose-500 cursor-pointer bg-rose-100 hover:bg-rose-200 border-1 border-rose-300 hover:border-rose-400 "
                        variant="outline"
                        onClick={handleDeletePosts}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteNextComponents

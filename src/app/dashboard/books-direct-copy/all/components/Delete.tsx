/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { IBooks } from '../api/v1/model'
import { useBooksStore } from '../store/Store'
import { baseIBooks } from '../store/StoreConstants'
import { useDeleteBooksMutation } from '../redux/rtk-Api'

import { handleSuccess } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selectedBooks,
        setSelectedBooks,
    } = useBooksStore()
    const [deleteBooks] = useDeleteBooksMutation()

    const handleDeleteBooks = async () => {
        if (selectedBooks) {
            try {
                await deleteBooks({
                    id: selectedBooks._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete Books:', error)
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelectedBooks({ ...baseIBooks } as IBooks)
    }

    const { name = '' } = selectedBooks || {}

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selectedBooks && (
                    <div className="py-4">
                        <p>
                            You are about to delete Books:{' '}
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
                        onClick={handleDeleteBooks}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteNextComponents

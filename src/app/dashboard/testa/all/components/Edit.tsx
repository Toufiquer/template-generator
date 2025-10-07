import React, { useEffect, useState } from 'react'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'
import StringArrayField from '@/components/dashboard-ui/StringArrayField'

import { DataItem, ITesta, defaultTesta } from '../store/data/data'
import { useTestaStore } from '../store/store'
import { useUpdateTestaMutation } from '@/redux/features/testa/testaSlice'
import {
    formatDuplicateKeyError,
    handleError,
    handleSuccess,
    isApiErrorResponse,
} from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedTesta,
        setSelectedTesta,
    } = useTestaStore()

    const [updateTesta, { isLoading }] = useUpdateTestaMutation()
    const [editedTesta, setEditedTesta] = useState<ITesta>(defaultTesta)

    // Load selected item into form when modal opens
    useEffect(() => {
        if (selectedTesta) {
            setEditedTesta(selectedTesta)
        } else {
            setEditedTesta(defaultTesta)
        }
    }, [selectedTesta])

    const handleFieldChange = (name: string, value: unknown) => {
        setEditedTesta((prev) => ({ ...prev, [name]: value }))
    }

    const handleEditTesta = async () => {
        if (!selectedTesta) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedTesta
            await updateTesta({
                id: selectedTesta._id,
                ...updateData,
            }).unwrap()
            toggleEditModal(false)
            setSelectedTesta(null)
            handleSuccess('Edit Successful')
        } catch (error: unknown) {
            console.error('Failed to update record:', error)
            let errMessage: string = 'An unknown error occurred.'
            if (isApiErrorResponse(error)) {
                errMessage =
                    formatDuplicateKeyError(error.data.message) ||
                    'An API error occurred.'
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[825px]">
                <DialogHeader>
                    <DialogTitle>Edit Testa</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        {/* Title Field */}
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString
                                    id="title"
                                    placeholder="Title"
                                    value={editedTesta.title}
                                    onChange={(value) =>
                                        handleFieldChange(
                                            'title',
                                            value as string
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Students Field (StringArrayField) */}
                        <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
                            <Label
                                htmlFor="students"
                                className="text-right pt-3"
                            >
                                Students
                            </Label>
                            <div className="col-span-3">
                                <StringArrayField
                                    value={editedTesta.students as DataItem[]}
                                    onChange={(newValue) =>
                                        handleFieldChange('students', newValue)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedTesta(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditTesta}
                        className="bg-green-500 text-white hover:bg-green-600"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditNextComponents

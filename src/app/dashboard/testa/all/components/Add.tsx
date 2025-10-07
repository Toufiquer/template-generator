import { useState } from 'react'
import { Input } from '@/components/ui/input'
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

import { useTestaStore } from '../store/store'
import { useAddTestaMutation } from '@/redux/features/testa/testaSlice'
import { DataItem, ITesta, defaultTesta } from '../store/data/data'
import {
    formatDuplicateKeyError,
    handleError,
    handleSuccess,
    isApiErrorResponse,
} from './utils'
import StringArrayField from '@/components/dashboard-ui/StringArrayField'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setTesta } = useTestaStore()
    const [addTesta, { isLoading }] = useAddTestaMutation()
    const [newTesta, setNewTesta] = useState<ITesta>(defaultTesta)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewTesta((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddTesta = async () => {
        try {
            const { _id, ...updateDataWith_id } = newTesta

            const updateData = {
                ...updateDataWith_id,
                students: updateDataWith_id.students.map(
                    ({ _id, ...rest }) => rest
                ),
            }

            console.log('newTesta :', newTesta)
            console.log('updateData :', updateData)

            const addedTesta = await addTesta(updateData).unwrap()
            setTesta([addedTesta])
            toggleAddModal(false)
            setNewTesta(defaultTesta)
            handleSuccess('Added Successfully')
        } catch (error: unknown) {
            console.error('Failed to add record:', error)
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
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[825px]">
                <DialogHeader>
                    <DialogTitle>Add New Testa</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        {/* Title */}
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString
                                    id="title"
                                    placeholder="Title"
                                    value={newTesta['title']}
                                    onChange={(value) =>
                                        handleFieldChange(
                                            'title',
                                            value as string
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Students (StringArrayField) */}
                        <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pr-1">
                            <Label
                                htmlFor="students"
                                className="text-right pt-3"
                            >
                                Students
                            </Label>
                            <div className="col-span-3">
                                <StringArrayField
                                    value={newTesta.students as DataItem[]}
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
                        onClick={() => toggleAddModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button disabled={isLoading} onClick={handleAddTesta}>
                        {isLoading ? 'Adding...' : 'Add Testa'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents

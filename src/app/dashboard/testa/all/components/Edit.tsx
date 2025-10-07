import React, { useEffect, useState } from 'react'

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

import StringArrayField from '@/app/dashboard/testa/all/components/others-field-type/StringArrayField'
import AutocompleteField from '@/components/dashboard-ui/AutocompleteField'
import ColorPickerField from '@/components/dashboard-ui/ColorPickerField'
import DateRangePickerField from '@/components/dashboard-ui/DateRangePickerField'
import DynamicSelectField from '@/components/dashboard-ui/DynamicSelectField'
import ImageUploadFieldSingle from '@/components/dashboard-ui/ImageUploadFieldSingle'
import ImageUploadManager from '@/components/dashboard-ui/ImageUploadManager'
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail'
import InputFieldForPasscode from '@/components/dashboard-ui/InputFieldForPasscode'
import InputFieldForPassword from '@/components/dashboard-ui/InputFieldForPassword'
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'
import JsonTextareaField from '@/components/dashboard-ui/JsonTextareaField'
import MultiCheckboxGroupField from '@/components/dashboard-ui/MultiCheckboxGroupField'
import MultiOptionsField from '@/components/dashboard-ui/MultiOptionsField'
import NumberInputFieldFloat from '@/components/dashboard-ui/NumberInputFieldFloat'
import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger'
import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import TimeField from '@/components/dashboard-ui/TimeField'
import TimeRangePickerField from '@/components/dashboard-ui/TimeRangePickerField'
import UrlInputField from '@/components/dashboard-ui/UrlInputField'
import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField'
import { CheckboxField } from '@/components/dashboard-ui/CheckboxField'
import { DateField } from '@/components/dashboard-ui/DateField'
import { RadioButtonGroupField } from '@/components/dashboard-ui/RadioButtonGroupField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { ITesta, defaultTesta } from '../store/data/data'
import { useTestaStore } from '../store/store'
import { useUpdateTestaMutation } from '@/redux/features/testa/testaSlice'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedTesta,
        setSelectedTesta,
    } = useTestaStore()

    const [updateTesta, { isLoading }] = useUpdateTestaMutation()
    const [editedTesta, setTesta] = useState<ITesta>(defaultTesta)

    useEffect(() => {
        if (selectedTesta) {
            setTesta(selectedTesta)
        }
    }, [selectedTesta])

    const handleFieldChange = (name: string, value: unknown) => {
        setTesta(prev => ({ ...prev, [name]: value }));
    };

    const handleEditTesta = async () => {
        if (!selectedTesta) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedTesta;
            await updateTesta({
                id: selectedTesta._id,
                ...updateData,
            }).unwrap()
            toggleEditModal(false)
            handleSuccess('Edit Successful')
        } catch (error: unknown) {
            console.error('Failed to update record:', error)
            let errMessage: string = 'An unknown error occurred.'
            if (isApiErrorResponse(error)) {
                errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.'
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }



    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Testa</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right ">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="title" placeholder="Title" value={editedTesta['title']} onChange={(value) => handleFieldChange('title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4 pr-1">
                            <Label htmlFor="students" className="text-right pt-3">
                                Students
                            </Label>
                            <div className="col-span-3">
                                <StringArrayField value={editedTesta['students']} onChange={(value) => handleFieldChange('students', value)} />
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
                        className="bg-green-100 text-green-600 hover:bg-green-200"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditNextComponents

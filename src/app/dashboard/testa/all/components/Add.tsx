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

// Static import for all possible form components
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
import StringArrayField from '@/app/dashboard/testa/all/components/StringArrayField'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import TimeField from '@/components/dashboard-ui/TimeField'
import TimeRangePickerField from '@/components/dashboard-ui/TimeRangePickerField'
import UrlInputField from '@/components/dashboard-ui/UrlInputField'
import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField'
import { CheckboxField } from '@/components/dashboard-ui/CheckboxField'
import { DateField } from '@/components/dashboard-ui/DateField'
import { RadioButtonGroupField } from '@/components/dashboard-ui/RadioButtonGroupField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { useTestaStore } from '../store/store'

import { useAddTestaMutation } from '@/redux/features/testa/testaSlice'
import { ITesta, defaultTesta } from '../store/data/data'
import {
    formatDuplicateKeyError,
    handleError,
    handleSuccess,
    isApiErrorResponse,
} from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setTesta } = useTestaStore()
    const [addTesta, { isLoading }] = useAddTestaMutation()
    const [newTesta, setNewTesta] = useState<ITesta>(defaultTesta)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewTesta((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddTesta = async () => {
        try {
            const updateData = { ...newTesta }
            delete updateData._id
            updateData.students = updateData.students.map((i) => {
                const r = { ...i }
                delete r._id
                return r
            })
            console.log('udpateData : ', updateData)
            const addedTesta = await addTesta(updateData).unwrap()
            setTesta([addedTesta]) // Example: update store, you might need a different strategy
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
                        <div className="grid grid-cols-1 md:grid-cols-4  items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right ">
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
                        <div className="grid grid-cols-1 md:grid-cols-4  items-start gap-4 pr-1">
                            <Label
                                htmlFor="students"
                                className="text-right pt-3"
                            >
                                Students
                            </Label>
                            <div className="col-span-3">
                                <StringArrayField
                                    value={newTesta['students']}
                                    onChange={(value) =>
                                        handleFieldChange('students', value)
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

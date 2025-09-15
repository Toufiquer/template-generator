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

// Import all UI components
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail'
import InputFieldForPassword from '@/components/dashboard-ui/InputFieldForPassword'
import InputFieldForPasscode from '@/components/dashboard-ui/InputFieldForPasscode'
import { SelectField } from '@/components/dashboard-ui/SelectField'
import DynamicSelectField from '@/components/dashboard-ui/DynamicSelectField'
import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger'
import NumberInputFieldFloat from '@/components/dashboard-ui/NumberInputFieldFloat'
import { CheckboxField } from '@/components/dashboard-ui/CheckboxField'
import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField'
import { DateField } from '@/components/dashboard-ui/DateField'
import TimeField from '@/components/dashboard-ui/TimeField'
import DateRangePickerField from '@/components/dashboard-ui/DateRangePickerField'
import TimeRangePickerField from '@/components/dashboard-ui/TimeRangePickerField'
import ColorPickerField from '@/components/dashboard-ui/ColorPickerField'
import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'
import UrlInputField from '@/components/dashboard-ui/UrlInputField'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import AutocompleteField from '@/components/dashboard-ui/AutocompleteField'
import { RadioButtonGroupField } from '@/components/dashboard-ui/RadioButtonGroupField'
import MultiCheckboxGroupField from '@/components/dashboard-ui/MultiCheckboxGroupField'
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField'
import ImageUploadManager from '@/components/dashboard-ui/ImageUploadManager'
import ImageUploadFieldSingle from '@/components/dashboard-ui/ImageUploadFieldSingle'
import MULTIOPTIONSField from '@/components/dashboard-ui/MULTIOPTIONSField'

import { useTest2sStore } from '../store/store'
import { useAddTest2sMutation } from '../redux/rtk-api'
import {
    ITest2s,
    defaultTest2s,
} from '@/app/generate/test2s/all/store/data/data'
import {
    formatDuplicateKeyError,
    handleError,
    handleSuccess,
    isApiErrorResponse,
} from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setTest2s } = useTest2sStore()
    const [addTest2s, { isLoading }] = useAddTest2sMutation()
    const [newTest2, setNewTest2] = useState<ITest2s>(defaultTest2s)
    const [selectedShift, setSelectedShift] = useState('morning')

    const shiftOptions: {
        value: string
        label: string
    }[] = [
        { value: 'morning', label: 'Morning Shift (9 AM - 5 PM)' },
        { value: 'evening', label: 'Evening Shift (5 PM - 1 AM)' },
        { value: 'night', label: 'Night Shift (1 AM - 9 AM)' },
    ]
    const handleFieldChange = (name: string, value: any) => {
        setNewTest2((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddTest2 = async () => {
        try {
            const { _id, ...updateData } = newTest2
            console.log('Adding new record:', updateData)
            const addedTest2 = await addTest2s(updateData).unwrap()
            setTest2s([addedTest2])
            toggleAddModal(false)
            setNewTest2(defaultTest2s)
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

    const label = 'Select Team Members'
    const placeholder = 'Search and select members...'
    const apiUrl = 'https://jsonplaceholder.typicode.com/users'
    const hobbyOptions = [
        { value: 'reading', label: 'Reading' },
        { value: 'travel', label: 'Travel' },
        { value: 'sports', label: 'Sports' },
    ]
    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Test2</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString
                                    id="title"
                                    value={newTest2['title']}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'title',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail
                                    id="email"
                                    value={newTest2['email']}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'email',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForPassword
                                    id="password"
                                    value={newTest2['password']}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'password',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="passcode" className="text-right">
                                Passcode
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForPasscode
                                    id="passcode"
                                    value={newTest2['passcode']}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'passcode',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="area" className="text-right">
                                Area
                            </Label>
                            <div className="col-span-3">
                                <SelectField
                                    value={newTest2['area']}
                                    onValueChange={(value) =>
                                        handleFieldChange('area', value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="books-list" className="text-right">
                                Books List
                            </Label>

                            <Input
                                id="books-list"
                                name="books-list"
                                value={newTest2['books-list']}
                                onChange={(e) =>
                                    handleFieldChange(
                                        'books-list',
                                        e.target.value
                                    )
                                }
                                placeholder="Unsupported field type: MULTISELECT"
                                className="col-span-3"
                                disabled
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="check-list" className="text-right">
                                Check List
                            </Label>
                            <div className="col-span-3">
                                <MULTIOPTIONSField
                                    value={[newTest2['check-list']]}
                                    onChange={(values) =>
                                        handleFieldChange('check-list', values)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="sub-area" className="text-right">
                                Sub Area
                            </Label>
                            <div className="col-span-3">
                                <DynamicSelectField
                                    label={label}
                                    placeholder={placeholder}
                                    apiUrl={apiUrl}
                                    value={[newTest2['sub-area']]}
                                    onChange={(values) =>
                                        handleFieldChange('sub-area', values)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label
                                htmlFor="products-images"
                                className="text-right"
                            >
                                Products Images
                            </Label>
                            <div className="col-span-3">
                                <ImageUploadManager
                                    value={newTest2['products-images']}
                                    onChange={(urls) =>
                                        handleFieldChange(
                                            'products-images',
                                            urls
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label
                                htmlFor="personal-image"
                                className="text-right"
                            >
                                Personal Image
                            </Label>
                            <div className="col-span-3">
                                <ImageUploadFieldSingle
                                    value={newTest2['personal-image']}
                                    onChange={(url) =>
                                        handleFieldChange('personal-image', url)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription
                                    id="description"
                                    value={newTest2['description']}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'description',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="age" className="text-right">
                                Age
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger
                                    id="age"
                                    value={newTest2['age']}
                                    onChange={(e) =>
                                        handleFieldChange('age', e)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldFloat
                                    id="amount"
                                    value={newTest2['amount']}
                                    onChange={(e) =>
                                        handleFieldChange('amount', e)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="isActive" className="text-right">
                                IsActive
                            </Label>
                            <div className="col-span-3">
                                <BooleanInputField
                                    id="isActive"
                                    checked={newTest2['isActive']}
                                    onCheckedChange={(checked) =>
                                        handleFieldChange('isActive', checked)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start-date" className="text-right">
                                Start Date
                            </Label>
                            <div className="col-span-3">
                                <DateField
                                    id="start-date"
                                    value={newTest2['start-date']}
                                    onChange={(date) =>
                                        handleFieldChange('start-date', date)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start-time" className="text-right">
                                Start Time
                            </Label>
                            <div className="col-span-3">
                                <TimeField
                                    id="start-time"
                                    value={newTest2['start-time']}
                                    onChange={(time) =>
                                        handleFieldChange('start-time', time)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label
                                htmlFor="schedule-date"
                                className="text-right"
                            >
                                Schedule Date
                            </Label>
                            <div className="col-span-3">
                                <DateRangePickerField
                                    id="schedule-date"
                                    value={newTest2['schedule-date']}
                                    onChange={(range) =>
                                        handleFieldChange(
                                            'schedule-date',
                                            range
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label
                                htmlFor="schedule-time"
                                className="text-right"
                            >
                                Schedule Time
                            </Label>
                            <div className="col-span-3">
                                <TimeRangePickerField
                                    id="schedule-time"
                                    value={newTest2['schedule-time']}
                                    onChange={(range) =>
                                        handleFieldChange(
                                            'schedule-time',
                                            range
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label
                                htmlFor="favorite-color"
                                className="text-right"
                            >
                                Favorite Color
                            </Label>
                            <div className="col-span-3">
                                <ColorPickerField
                                    id="favorite-color"
                                    value={newTest2['favorite-color']}
                                    onChange={(e) =>
                                        handleFieldChange('favorite-color', e)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="number" className="text-right">
                                Number
                            </Label>
                            <div className="col-span-3">
                                <PhoneInputField
                                    id="number"
                                    value={newTest2['number']}
                                    onChange={(value) =>
                                        handleFieldChange('number', value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="profile" className="text-right">
                                Profile
                            </Label>
                            <div className="col-span-3">
                                <UrlInputField
                                    id="profile"
                                    value={newTest2['profile']}
                                    onChange={(e) =>
                                        handleFieldChange('profile', e)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="test" className="text-right">
                                Test
                            </Label>
                            <div className="col-span-3">
                                <RichTextEditorField
                                    id="test"
                                    value={newTest2['test']}
                                    onChange={(value) =>
                                        handleFieldChange('test', value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="info" className="text-right">
                                Info
                            </Label>
                            <div className="col-span-3">
                                <AutocompleteField
                                    id="info"
                                    value={newTest2['info']}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="shift" className="text-right">
                                Shift
                            </Label>
                            <div className="col-span-3">
                                <RadioButtonGroupField
                                    value={newTest2['shift']}
                                    options={shiftOptions}
                                    onChange={(value) =>
                                        handleFieldChange('shift', value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="policy" className="text-right">
                                Policy
                            </Label>
                            <div className="col-span-3">
                                <CheckboxField
                                    id="policy"
                                    checked={newTest2['policy']}
                                    onCheckedChange={(checked) =>
                                        handleFieldChange('policy', checked)
                                    }
                                    label="Policy"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="hobbys" className="text-right">
                                Hobbys
                            </Label>
                            <div className="col-span-3">
                                <MultiCheckboxGroupField
                                    value={newTest2['hobbys']}
                                    onChange={(values) =>
                                        handleFieldChange('hobbys', values)
                                    }
                                    options={hobbyOptions}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="ideas" className="text-right">
                                Ideas
                            </Label>
                            <div className="col-span-3">
                                <MULTIOPTIONSField
                                    value={[newTest2['ideas']]}
                                    onChange={(values) =>
                                        handleFieldChange('ideas', values)
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
                    <Button disabled={isLoading} onClick={handleAddTest2}>
                        {isLoading ? 'Adding...' : 'Add Test2'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents

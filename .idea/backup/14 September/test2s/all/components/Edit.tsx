import React, { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { ITest2s, defaultTest2s } from '../store/data/data'
import { useTest2sStore } from '../store/store'
import { useUpdateTest2sMutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const InputField: React.FC<{
    id: string
    name: string
    label: string
    type?: string
    value: string | number
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}> = ({ id, name, label, type = 'text', value, onChange }) => (
    <div className="grid grid-cols-4 items-center gap-4 pr-1">
        <Label htmlFor={id} className="text-right">
            {label}
        </Label>
        {type === 'textarea' ? (
            <Textarea
                id={id}
                name={name}
                value={value as string}
                onChange={onChange}
                className="col-span-3"
            />
        ) : (
            <Input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className="col-span-3"
            />
        )}
    </div>
)

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedTest2s,
        setSelectedTest2s,
    } = useTest2sStore()

    const [updateTest2s, { isLoading }] = useUpdateTest2sMutation()
    const [editedTest2, setTest2] = useState<ITest2s>(defaultTest2s)

    useEffect(() => {
        if (selectedTest2s) {
            setTest2(selectedTest2s)
        }
    }, [selectedTest2s])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setTest2({ ...editedTest2, [name]: value })
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setTest2({ ...editedTest2, [name]: checked })
    }

    const handleSelectChange = (name: string, value: string) => {
        setTest2({ ...editedTest2, [name]: value })
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setTest2({
                ...editedTest2,
                [field]: {
                    ...(editedTest2[field as keyof ITest2s] as object),
                    [nestedField]: new Date(value),
                },
            })
        } else {
            setTest2({ ...editedTest2, [field]: new Date(value) })
        }
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setTest2({
                ...editedTest2,
                [field]: {
                    ...(editedTest2[field as keyof ITest2s] as object),
                    [nestedField]: value,
                },
            })
        } else {
            setTest2({ ...editedTest2, [field]: value })
        }
    }

    const handleArrayChange = (name: string, value: string) => {
        setTest2({ ...editedTest2, [name]: value.split(',').map(s => s.trim()) })
    }

    const handleEditTest2 = async () => {
        if (!selectedTest2s) return

        try {
            await updateTest2s({
                id: selectedTest2s._id,
                ...editedTest2,
            }).unwrap()
            toggleEditModal(false)
            handleSuccess('Edit Successful')
        } catch (error: unknown) {
            let errMessage: string = ''
            if (isApiErrorResponse(error)) {
                errMessage = formatDuplicateKeyError(error.data.message)
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }
    
    const formatDate = (date: Date | string | undefined): string => {
        if (!date) return ''
        try {
            return new Date(date).toISOString().split('T')[0]
        } catch (error) {
            return ''
        }
    }

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Test2</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <InputField
                            id="title"
                            name="title"
                            label="Title"
                            value={editedTest2['title'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            value={editedTest2['email'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={editedTest2['password'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="passcode"
                            name="passcode"
                            label="Passcode"
                            type="password"
                            value={editedTest2['passcode'] || ''}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="area" className="text-right">
                                Area
                            </Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('area', value)}
                                value={editedTest2['area'] || ''}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Option 1">Option 1</SelectItem>
                                    <SelectItem value="Option 2">Option 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <InputField
                            id="books-list"
                            name="books-list"
                            label="Books List"
                            value={editedTest2['books-list'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="check-list"
                            name="check-list"
                            label="Check List"
                            value={editedTest2['check-list'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="sub-area"
                            name="sub-area"
                            label="Sub Area"
                            value={editedTest2['sub-area'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="products-images"
                            name="products-images"
                            label="Products Images (comma separated)"
                            value={(editedTest2['products-images'] as string[])?.join(',') || ''}
                            onChange={(e) => handleArrayChange('products-images', e.target.value)}
                        />
                        <InputField
                            id="personal-image"
                            name="personal-image"
                            label="Personal Image"
                            value={editedTest2['personal-image'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="description"
                            name="description"
                            label="Description"
                            type="textarea"
                            value={editedTest2['description'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="age"
                            name="age"
                            label="Age"
                            type="number"
                            value={editedTest2['age'] || 0}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="amount"
                            name="amount"
                            label="Amount"
                            type="number"
                            value={editedTest2['amount'] || 0}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="isActive" className="text-right">
                                IsActive
                            </Label>
                            <Checkbox
                                id="isActive"
                                name="isActive"
                                checked={editedTest2['isActive'] || false}
                                onCheckedChange={(checked) => handleCheckboxChange('isActive', !!checked)}
                            />
                        </div>
                        <InputField
                            id="start-date"
                            name="start-date"
                            label="Start Date"
                            type="date"
                            value={formatDate(editedTest2['start-date'])}
                            onChange={(e) => handleDateChange(e, 'start-date')}
                        />
                        <InputField
                            id="start-time"
                            name="start-time"
                            label="Start Time"
                            type="time"
                            value={editedTest2['start-time'] || ''}
                            onChange={(e) => handleTimeChange(e, 'start-time')}
                        />
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="schedule-date-start" className="text-right">Schedule Date Start</Label>
                            <Input
                                id="schedule-date-start"
                                name="schedule-date-start"
                                type="date"
                                value={formatDate(editedTest2['schedule-date']?.start)}
                                onChange={(e) => handleDateChange(e, 'schedule-date', 'start')}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="schedule-date-end" className="text-right">Schedule Date End</Label>
                            <Input
                                id="schedule-date-end"
                                name="schedule-date-end"
                                type="date"
                                value={formatDate(editedTest2['schedule-date']?.end)}
                                onChange={(e) => handleDateChange(e, 'schedule-date', 'end')}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="schedule-time-start" className="text-right">Schedule Time Start</Label>
                            <Input
                                id="schedule-time-start"
                                name="schedule-time-start"
                                type="time"
                                value={editedTest2['schedule-time']?.start || ''}
                                onChange={(e) => handleTimeChange(e, 'schedule-time', 'start')}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="schedule-time-end" className="text-right">Schedule Time End</Label>
                            <Input
                                id="schedule-time-end"
                                name="schedule-time-end"
                                type="time"
                                value={editedTest2['schedule-time']?.end || ''}
                                onChange={(e) => handleTimeChange(e, 'schedule-time', 'end')}
                                className="col-span-3"
                            />
                        </div>
                        <InputField
                            id="favorite-color"
                            name="favorite-color"
                            label="Favorite Color"
                            type="color"
                            value={editedTest2['favorite-color'] || '#000000'}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="number"
                            name="number"
                            label="Number"
                            value={editedTest2['number'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="profile"
                            name="profile"
                            label="Profile"
                            value={editedTest2['profile'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="test"
                            name="test"
                            label="Test"
                            value={editedTest2['test'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="info"
                            name="info"
                            label="Info"
                            value={editedTest2['info'] || ''}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="shift" className="text-right">
                                Shift
                            </Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('shift', value)}
                                value={editedTest2['shift'] || ''}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Option 1">Option 1</SelectItem>
                                    <SelectItem value="Option 2">Option 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="policy" className="text-right">
                                Policy
                            </Label>
                            <Checkbox
                                id="policy"
                                name="policy"
                                checked={editedTest2['policy'] || false}
                                onCheckedChange={(checked) => handleCheckboxChange('policy', !!checked)}
                            />
                        </div>
                        <InputField
                            id="hobbys"
                            name="hobbys"
                            label="Hobbys (comma separated)"
                            value={(editedTest2['hobbys'] as string[])?.join(',') || ''}
                            onChange={(e) => handleArrayChange('hobbys', e.target.value)}
                        />
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedTest2s(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditTest2}
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

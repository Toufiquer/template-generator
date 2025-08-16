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

import { IPosts, defaultPosts } from '../api/v1/model'
import { usePostsStore } from '../store/Store'
import { useUpdatePostsMutation } from '../redux/rtk-Api'
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
        selectedPost,
        setSelectedPost,
    } = usePostsStore()

    const [updatePosts, { isLoading }] = useUpdatePostsMutation()
    const [editedPost, setPost] = useState<IPosts>(defaultPosts)

    useEffect(() => {
        if (selectedPost) {
            setPost(selectedPost)
        }
    }, [selectedPost])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setPost({ ...editedPost, [name]: value })
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setPost({ ...editedPost, [name]: checked })
    }

    const handleSelectChange = (name: string, value: string) => {
        setPost({ ...editedPost, [name]: value })
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setPost({
                ...editedPost,
                [field]: {
                    ...(editedPost[field as keyof IPosts] as object),
                    [nestedField]: new Date(value),
                },
            })
        } else {
            setPost({ ...editedPost, [field]: new Date(value) })
        }
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setPost({
                ...editedPost,
                [field]: {
                    ...(editedPost[field as keyof IPosts] as object),
                    [nestedField]: value,
                },
            })
        } else {
            setPost({ ...editedPost, [field]: value })
        }
    }

    const handleArrayChange = (name: string, value: string) => {
        setPost({ ...editedPost, [name]: value.split(',').map(s => s.trim()) })
    }

    const handleEditPost = async () => {
        if (!selectedPost) return

        try {
            await updatePosts({
                id: selectedPost._id,
                ...editedPost,
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
                    <DialogTitle>Edit Post</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <InputField
                            id="title"
                            name="title"
                            label="Title"
                            value={editedPost['title'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            value={editedPost['email'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={editedPost['password'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="passcode"
                            name="passcode"
                            label="Passcode"
                            type="password"
                            value={editedPost['passcode'] || ''}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="area" className="text-right">
                                Area
                            </Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('area', value)}
                                value={editedPost['area'] || ''}
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
                            value={editedPost['books-list'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="check-list"
                            name="check-list"
                            label="Check List"
                            value={editedPost['check-list'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="sub-area"
                            name="sub-area"
                            label="Sub Area"
                            value={editedPost['sub-area'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="products-images"
                            name="products-images"
                            label="Products Images (comma separated)"
                            value={(editedPost['products-images'] as string[])?.join(',') || ''}
                            onChange={(e) => handleArrayChange('products-images', e.target.value)}
                        />
                        <InputField
                            id="personal-image"
                            name="personal-image"
                            label="Personal Image"
                            value={editedPost['personal-image'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="description"
                            name="description"
                            label="Description"
                            type="textarea"
                            value={editedPost['description'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="age"
                            name="age"
                            label="Age"
                            type="number"
                            value={editedPost['age'] || 0}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="amount"
                            name="amount"
                            label="Amount"
                            type="number"
                            value={editedPost['amount'] || 0}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="isActive" className="text-right">
                                IsActive
                            </Label>
                            <Checkbox
                                id="isActive"
                                name="isActive"
                                checked={editedPost['isActive'] || false}
                                onCheckedChange={(checked) => handleCheckboxChange('isActive', !!checked)}
                            />
                        </div>
                        <InputField
                            id="start-date"
                            name="start-date"
                            label="Start Date"
                            type="date"
                            value={formatDate(editedPost['start-date'])}
                            onChange={(e) => handleDateChange(e, 'start-date')}
                        />
                        <InputField
                            id="start-time"
                            name="start-time"
                            label="Start Time"
                            type="time"
                            value={editedPost['start-time'] || ''}
                            onChange={(e) => handleTimeChange(e, 'start-time')}
                        />
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="schedule-date-start" className="text-right">Schedule Date Start</Label>
                            <Input
                                id="schedule-date-start"
                                name="schedule-date-start"
                                type="date"
                                value={formatDate(editedPost['schedule-date']?.start)}
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
                                value={formatDate(editedPost['schedule-date']?.end)}
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
                                value={editedPost['schedule-time']?.start || ''}
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
                                value={editedPost['schedule-time']?.end || ''}
                                onChange={(e) => handleTimeChange(e, 'schedule-time', 'end')}
                                className="col-span-3"
                            />
                        </div>
                        <InputField
                            id="favorite-color"
                            name="favorite-color"
                            label="Favorite Color"
                            type="color"
                            value={editedPost['favorite-color'] || '#000000'}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="number"
                            name="number"
                            label="Number"
                            value={editedPost['number'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="profile"
                            name="profile"
                            label="Profile"
                            value={editedPost['profile'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="test"
                            name="test"
                            label="Test"
                            value={editedPost['test'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="info"
                            name="info"
                            label="Info"
                            value={editedPost['info'] || ''}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="shift" className="text-right">
                                Shift
                            </Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('shift', value)}
                                value={editedPost['shift'] || ''}
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
                                checked={editedPost['policy'] || false}
                                onCheckedChange={(checked) => handleCheckboxChange('policy', !!checked)}
                            />
                        </div>
                        <InputField
                            id="hobbys"
                            name="hobbys"
                            label="Hobbys (comma separated)"
                            value={(editedPost['hobbys'] as string[])?.join(',') || ''}
                            onChange={(e) => handleArrayChange('hobbys', e.target.value)}
                        />
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedPost(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditPost}
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

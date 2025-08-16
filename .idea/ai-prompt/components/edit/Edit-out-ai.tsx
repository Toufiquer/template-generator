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

import { IPosts, defaultPosts } from './api/v1/model'
import { usePostsStore } from '../store/Store'
import { useUpdatePostsMutation } from '../redux/rtk-Api'
import {
    formatDuplicateKeyError,
    handleError,
    handleSuccess,
    isApiErrorResponse,
} from './utils'

const InputField: React.FC<{
    id: string
    name: string
    label: string
    type?: string
    value: string | number
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void
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
        selectedPosts,
        setSelectedPosts,
    } = usePostsStore()

    const [updatePosts, { isLoading }] = useUpdatePostsMutation()
    const [editedPost, setEditedPost] = useState<IPosts>(defaultPosts)

    useEffect(() => {
        if (selectedPosts) {
            setEditedPost(selectedPosts)
        }
    }, [selectedPosts])

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target as HTMLInputElement
        const checked = (e.target as HTMLInputElement).checked
        setEditedPost({
            ...editedPost,
            [name]: type === 'checkbox' ? checked : value,
        })
    }

    const handleSelectChange = (name: string, value: string) => {
        setEditedPost({ ...editedPost, [name]: value })
    }

    const handleDateChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string,
        nestedField?: 'start' | 'end'
    ) => {
        const { value } = e.target
        if (nestedField) {
            setEditedPost({
                ...editedPost,
                [field]: {
                    ...(editedPost[field as keyof IPosts] as object),
                    [nestedField]: new Date(value),
                },
            })
        } else {
            setEditedPost({ ...editedPost, [field]: new Date(value) })
        }
    }

    const handleTimeChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string,
        nestedField?: 'start' | 'end'
    ) => {
        const { value } = e.target
        if (nestedField) {
            setEditedPost({
                ...editedPost,
                [field]: {
                    ...(editedPost[field as keyof IPosts] as object),
                    [nestedField]: value,
                },
            })
        } else {
            setEditedPost({ ...editedPost, [field]: value })
        }
    }

    const handleArrayChange = (name: string, value: string) => {
        setEditedPost({
            ...editedPost,
            [name]: value.split(',').map((s) => s.trim()),
        })
    }

    const handleEditPost = async () => {
        if (!selectedPosts) return

        try {
            await updatePosts({
                id: selectedPosts._id,
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

    const formatDate = (date: Date | string | undefined) => {
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
                            value={editedPost.title || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            value={editedPost.email || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="passcode"
                            name="passcode"
                            label="Passcode"
                            type="password"
                            value={editedPost.passcode || ''}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="area" className="text-right">
                                Area
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    handleSelectChange('area', value)
                                }
                                value={editedPost.area || ''}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select an area" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Option 1">
                                        Option 1
                                    </SelectItem>
                                    <SelectItem value="Option 2">
                                        Option 2
                                    </SelectItem>
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
                            value={
                                editedPost['products-images']?.join(',') || ''
                            }
                            onChange={(e) =>
                                handleArrayChange(
                                    'products-images',
                                    e.target.value
                                )
                            }
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
                            value={editedPost.description || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="age"
                            name="age"
                            label="Age"
                            type="number"
                            value={editedPost.age || 0}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="amount"
                            name="amount"
                            label="Amount"
                            type="number"
                            value={editedPost.amount || 0}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="isActive" className="text-right">
                                Is Active
                            </Label>
                            <Checkbox
                                id="isActive"
                                name="isActive"
                                checked={editedPost.isActive || false}
                                onCheckedChange={(checked) =>
                                    setEditedPost({
                                        ...editedPost,
                                        isActive: !!checked,
                                    })
                                }
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
                            <Label
                                htmlFor="schedule-date-start"
                                className="text-right"
                            >
                                Schedule Start Date
                            </Label>
                            <Input
                                id="schedule-date-start"
                                name="schedule-date-start"
                                type="date"
                                value={formatDate(
                                    editedPost['schedule-date']?.start
                                )}
                                onChange={(e) =>
                                    handleDateChange(
                                        e,
                                        'schedule-date',
                                        'start'
                                    )
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label
                                htmlFor="schedule-date-end"
                                className="text-right"
                            >
                                Schedule End Date
                            </Label>
                            <Input
                                id="schedule-date-end"
                                name="schedule-date-end"
                                type="date"
                                value={formatDate(
                                    editedPost['schedule-date']?.end
                                )}
                                onChange={(e) =>
                                    handleDateChange(e, 'schedule-date', 'end')
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label
                                htmlFor="schedule-time-start"
                                className="text-right"
                            >
                                Schedule Start Time
                            </Label>
                            <Input
                                id="schedule-time-start"
                                name="schedule-time-start"
                                type="time"
                                value={editedPost['schedule-time']?.start || ''}
                                onChange={(e) =>
                                    handleTimeChange(
                                        e,
                                        'schedule-time',
                                        'start'
                                    )
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label
                                htmlFor="schedule-time-end"
                                className="text-right"
                            >
                                Schedule End Time
                            </Label>
                            <Input
                                id="schedule-time-end"
                                name="schedule-time-end"
                                type="time"
                                value={editedPost['schedule-time']?.end || ''}
                                onChange={(e) =>
                                    handleTimeChange(e, 'schedule-time', 'end')
                                }
                                className="col-span-3"
                            />
                        </div>
                        <InputField
                            id="favorite-color"
                            name="favorite-color"
                            label="Favorite Color"
                            type="color"
                            value={editedPost['favorite-color'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="number"
                            name="number"
                            label="Phone Number"
                            value={editedPost.number || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="profile"
                            name="profile"
                            label="Profile"
                            type="textarea"
                            value={editedPost.profile || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="test"
                            name="test"
                            label="Test"
                            value={editedPost.test || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="info"
                            name="info"
                            label="Info"
                            type="textarea"
                            value={editedPost.info || ''}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="shift" className="text-right">
                                Shift
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    handleSelectChange('shift', value)
                                }
                                value={editedPost.shift || ''}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a shift" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Choice A">
                                        Choice A
                                    </SelectItem>
                                    <SelectItem value="Choice B">
                                        Choice B
                                    </SelectItem>
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
                                checked={editedPost.policy || false}
                                onCheckedChange={(checked) =>
                                    setEditedPost({
                                        ...editedPost,
                                        policy: !!checked,
                                    })
                                }
                            />
                        </div>
                        <InputField
                            id="hobbys"
                            name="hobbys"
                            label="Hobbies (comma separated)"
                            value={editedPost.hobbys?.join(',') || ''}
                            onChange={(e) =>
                                handleArrayChange('hobbys', e.target.value)
                            }
                        />
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        className="border-slate-500 hover:border-slate-600 border-1 cursor-pointer"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedPosts(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        className="text-green-400 hover:text-green-500 cursor-pointer bg-green-100 hover:bg-green-200 border-1 border-green-300 hover:border-green-400"
                        onClick={handleEditPost}
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditNextComponents

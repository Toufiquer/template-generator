import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { usePostsStore } from '../store/Store'
import { useAddPostsMutation } from '../redux/rtk-Api'
import { IPosts, defaultPosts } from '@/app/dashboard/posts/api/v1/model'
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

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setPosts } = usePostsStore()
    const [addPosts, { isLoading }] = useAddPostsMutation()
    const [newPost, setNewPost] = useState<IPosts>(defaultPosts)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value })
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setNewPost({ ...newPost, [name]: checked })
    }

    const handleSelectChange = (name: string, value: string) => {
        setNewPost({ ...newPost, [name]: value })
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setNewPost({
                ...newPost,
                [field]: {
                    ...(newPost[field as keyof IPosts] as object),
                    [nestedField]: new Date(value),
                },
            })
        } else {
            setNewPost({ ...newPost, [field]: new Date(value) })
        }
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setNewPost({
                ...newPost,
                [field]: {
                    ...(newPost[field as keyof IPosts] as object),
                    [nestedField]: value,
                },
            })
        } else {
            setNewPost({ ...newPost, [field]: value })
        }
    }

    const handleArrayChange = (name: string, value: string) => {
        setNewPost({ ...newPost, [name]: value.split(',').map(item => item.trim()) })
    }

    const handleAddPost = async () => {
        try {
            const addedPost = await addPosts(newPost).unwrap()
            setPosts([addedPost])
            toggleAddModal(false)
            setNewPost(defaultPosts)
            handleSuccess('Added Successful')
        } catch (error: unknown) {
            console.error(error)
            let errMessage: string = 'An unknown error occurred.'
            if (isApiErrorResponse(error)) {
                errMessage = formatDuplicateKeyError(error.data.message) || 'API error'
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }

    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Post</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <InputField
                            id="title"
                            name="title"
                            label="Title"
                            value={newPost['title']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            value={newPost['email']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={newPost['password']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="passcode"
                            name="passcode"
                            label="Passcode"
                            type="password"
                            value={newPost['passcode']}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="area" className="text-right">
                                Area
                            </Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('area', value)}
                                value={newPost['area']}
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
                            value={newPost['books-list']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="check-list"
                            name="check-list"
                            label="Check List"
                            value={newPost['check-list']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="sub-area"
                            name="sub-area"
                            label="Sub Area"
                            value={newPost['sub-area']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="products-images"
                            name="products-images"
                            label="Products Images (comma separated)"
                            value={(newPost['products-images'] as string[]).join(',')}
                            onChange={(e) => handleArrayChange('products-images', e.target.value)}
                        />
                        <InputField
                            id="personal-image"
                            name="personal-image"
                            label="Personal Image"
                            value={newPost['personal-image']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="description"
                            name="description"
                            label="Description"
                            type="textarea"
                            value={newPost['description']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="age"
                            name="age"
                            label="Age"
                            type="number"
                            value={newPost['age']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="amount"
                            name="amount"
                            label="Amount"
                            type="number"
                            value={newPost['amount']}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="isActive" className="text-right">
                                IsActive
                            </Label>
                            <Checkbox
                                id="isActive"
                                name="isActive"
                                checked={newPost['isActive']}
                                onCheckedChange={(checked) => handleCheckboxChange('isActive', !!checked)}
                            />
                        </div>
                        <InputField
                            id="start-date"
                            name="start-date"
                            label="Start Date"
                            type="date"
                            value={newPost['start-date'] ? new Date(newPost['start-date']).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleDateChange(e, 'start-date')}
                        />
                        <InputField
                            id="start-time"
                            name="start-time"
                            label="Start Time"
                            type="time"
                            value={newPost['start-time']}
                            onChange={(e) => handleTimeChange(e, 'start-time')}
                        />
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="schedule-date-start" className="text-right">Schedule Date Start</Label>
                            <Input
                                id="schedule-date-start"
                                name="schedule-date-start"
                                type="date"
                                value={newPost['schedule-date'].start ? new Date(newPost['schedule-date'].start).toISOString().split('T')[0] : ''}
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
                                value={newPost['schedule-date'].end ? new Date(newPost['schedule-date'].end).toISOString().split('T')[0] : ''}
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
                                value={newPost['schedule-time'].start}
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
                                value={newPost['schedule-time'].end}
                                onChange={(e) => handleTimeChange(e, 'schedule-time', 'end')}
                                className="col-span-3"
                            />
                        </div>
                        <InputField
                            id="favorite-color"
                            name="favorite-color"
                            label="Favorite Color"
                            type="color"
                            value={newPost['favorite-color']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="number"
                            name="number"
                            label="Number"
                            value={newPost['number']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="profile"
                            name="profile"
                            label="Profile"
                            value={newPost['profile']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="test"
                            name="test"
                            label="Test"
                            value={newPost['test']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="info"
                            name="info"
                            label="Info"
                            value={newPost['info']}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="shift" className="text-right">
                                Shift
                            </Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('shift', value)}
                                value={newPost['shift']}
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
                                checked={newPost['policy']}
                                onCheckedChange={(checked) => handleCheckboxChange('policy', !!checked)}
                            />
                        </div>
                        <InputField
                            id="hobbys"
                            name="hobbys"
                            label="Hobbys (comma separated)"
                            value={(newPost['hobbys'] as string[]).join(',')}
                            onChange={(e) => handleArrayChange('hobbys', e.target.value)}
                        />
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => toggleAddModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleAddPost}
                    >
                        {isLoading ? 'Adding...' : 'Add Post'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents

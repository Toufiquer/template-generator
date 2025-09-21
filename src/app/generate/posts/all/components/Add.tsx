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

import { usePostsStore } from '../store/store'
import { useAddPostsMutation } from '../redux/rtk-api'
import { IPosts, defaultPosts } from '@/app/generate/posts/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setPosts } = usePostsStore()
    const [addPosts, { isLoading }] = useAddPostsMutation()
    const [newPost, setNewPost] = useState<IPosts>(defaultPosts)

    const handleFieldChange = (name: string, value: any) => {
        setNewPost(prev => ({ ...prev, [name]: value }));
    };

    const handleAddPost = async () => {
        try {
            const { _id, ...updateData } = newPost
            console.log('Adding new record:', updateData)
            const addedPost = await addPosts(updateData).unwrap()
            setPosts([addedPost])
            toggleAddModal(false)
            setNewPost(defaultPosts)
            handleSuccess('Added Successfully')
        } catch (error: unknown) {
            console.error('Failed to add record:', error)
            let errMessage: string = 'An unknown error occurred.'
            if (isApiErrorResponse(error)) {
                errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.'
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }

    const  options=[
            { label: 'OP 1', value: 'op1' },
            { label: 'OP 2', value: 'op2' },
        ]
    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Post</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="title"       placeholder="Title" value={newPost['title']} onChange={(e) => handleFieldChange('title', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="email" value={newPost['email']} onChange={(e) => handleFieldChange('email', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForPassword id="password" value={newPost['password']} onChange={(value) => handleFieldChange('password', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="passcode" className="text-right">
                                Passcode
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForPasscode id="passcode" value={newPost['passcode']} onChange={(e) => handleFieldChange('passcode', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="area" className="text-right">
                                Area
                            </Label>
                            <div className="col-span-3">
                                <SelectField value={newPost['area']} onValueChange={(value) => handleFieldChange('area', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="sub-area" className="text-right">
                                Sub Area
                            </Label>
                            <div className="col-span-3">
                                <DynamicSelectField value={newPost['sub-area']} onChange={(values) => handleFieldChange('sub-area', values)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="products-images" className="text-right">
                                Products Images
                            </Label>
                            <div className="col-span-3">
                                <ImageUploadManager value={newPost['products-images']} onChange={(urls) => handleFieldChange('products-images', urls)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="personal-image" className="text-right">
                                Personal Image
                            </Label>
                            <div className="col-span-3">
                                <ImageUploadFieldSingle value={newPost['personal-image']} onImageUploadSuccess={(url) => handleFieldChange('personal-image', url)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="description" value={newPost['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="age" className="text-right">
                                Age
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger id="age" value={newPost['age']} onChange={(e) => handleFieldChange('age', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldFloat id="amount" value={newPost['amount']} onChange={(e) => handleFieldChange('amount', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="isActive" className="text-right">
                                IsActive
                            </Label>
                            <div className="col-span-3">
                                <BooleanInputField id="isActive" checked={newPost['isActive']} onCheckedChange={(checked) => handleFieldChange('isActive', checked)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start-date" className="text-right">
                                Start Date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="start-date" selected={newPost['start-date']} onSelect={(date) => handleFieldChange('start-date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start-time" className="text-right">
                                Start Time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="start-time" value={newPost['start-time']} onChange={(time) => handleFieldChange('start-time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="schedule-date" className="text-right">
                                Schedule Date
                            </Label>
                            <div className="col-span-3">
                                <DateRangePickerField id="schedule-date" value={newPost['schedule-date']} onChange={(range) => handleFieldChange('schedule-date', range)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="schedule-time" className="text-right">
                                Schedule Time
                            </Label>
                            <div className="col-span-3">
                                <TimeRangePickerField id="schedule-time" value={newPost['schedule-time']} onChange={(range) => handleFieldChange('schedule-time', range)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="favorite-color" className="text-right">
                                Favorite Color
                            </Label>
                            <div className="col-span-3">
                                <ColorPickerField id="favorite-color" value={newPost['favorite-color']} onChange={(e) => handleFieldChange('favorite-color', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="number" className="text-right">
                                Number
                            </Label>
                            <div className="col-span-3">
                                <PhoneInputField id="number" value={newPost['number']} onChange={(value) => handleFieldChange('number', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="profile" className="text-right">
                                Profile
                            </Label>
                            <div className="col-span-3">
                                <UrlInputField id="profile" value={newPost['profile']} onChange={(e) => handleFieldChange('profile', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="test" className="text-right">
                                Test
                            </Label>
                            <div className="col-span-3">
                                <RichTextEditorField id="test" value={newPost['test']} onChange={(value) => handleFieldChange('test', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="info" className="text-right">
                                Info
                            </Label>
                            <div className="col-span-3">
                                <AutocompleteField id="info" value={newPost['info']} onChange={(value) => handleFieldChange('info', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="shift" className="text-right">
                                Shift
                            </Label>
                            <div className="col-span-3">
                                <RadioButtonGroupField options={options} value={newPost['shift']} onChange={(value) => handleFieldChange('shift', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="policy" className="text-right">
                                Policy
                            </Label>
                            <div className="col-span-3">
                                <CheckboxField id="policy" checked={newPost['policy']} onCheckedChange={(checked) => handleFieldChange('policy', checked)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="hobbys" className="text-right">
                                Hobbys
                            </Label>
                            <div className="col-span-3">
                                <MultiCheckboxGroupField value={newPost['hobbys']} onChange={(values) => handleFieldChange('hobbys', values)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="ideas" className="text-right">
                                Ideas
                            </Label>
                            
                        <Input
                            id="ideas"
                            name="ideas"
                            value={newPost['ideas']}
                            onChange={(e) => handleFieldChange('ideas', e.target.value)}
                            placeholder="Unsupported field type: MULTIOPTIONS"
                            className="col-span-3"
                            disabled
                        />
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

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

import StringArrayField from '@/app/dashboard/posts/all/components/others-field-type/StringArrayField'
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

import { IPosts, defaultPosts } from '../store/data/data'
import { usePostsStore } from '../store/store'
import { useUpdatePostsMutation } from '@/redux/features/posts/postsSlice'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const EditNextComponents: React.FC = () => {
    const {
        toggleEditModal,
        isEditModalOpen,
        selectedPosts,
        setSelectedPosts,
    } = usePostsStore()

    const [updatePosts, { isLoading }] = useUpdatePostsMutation()
    const [editedPost, setPost] = useState<IPosts>(defaultPosts)

    useEffect(() => {
        if (selectedPosts) {
            setPost(selectedPosts)
        }
    }, [selectedPosts])

    const handleFieldChange = (name: string, value: unknown) => {
        setPost(prev => ({ ...prev, [name]: value }));
    };

    const handleEditPost = async () => {
        if (!selectedPosts) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = editedPost;
            await updatePosts({
                id: selectedPosts._id,
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

    const areaOptions = [
        { label: 'Bangladesh', value: 'Bangladesh' },
        { label: 'India', value: 'India' },
        { label: 'Pakistan', value: 'Pakistan' },
        { label: 'Canada', value: 'Canada' }
    ];

    return (
        <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right ">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="title" placeholder="Title" value={editedPost['title']} onChange={(value) => handleFieldChange('title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="area" className="text-right ">
                                Area
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={areaOptions} value={editedPost['area']} onValueChange={(value) => handleFieldChange('area', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="sub-area" className="text-right ">
                                Sub Area
                            </Label>
                            <div className="col-span-3">
                                <DynamicSelectField value={editedPost['sub-area']} apiUrl='https://jsonplaceholder.typicode.com/users' onChange={(values) => handleFieldChange('sub-area', values)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="isActive" className="text-right ">
                                IsActive
                            </Label>
                            <div className="col-span-3">
                                <BooleanInputField id="isActive" checked={editedPost['isActive']} onCheckedChange={(checked) => handleFieldChange('isActive', checked)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="policy" className="text-right ">
                                Policy
                            </Label>
                            <div className="col-span-3">
                                <CheckboxField id="policy" checked={editedPost['policy']} onCheckedChange={(checked) => handleFieldChange('policy', checked)} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedPosts(null)
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

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

import { INews1es, defaultNews1es } from '../store/data/data'
import { useNews1esStore } from '../store/store'
import { useUpdateNews1esMutation } from '../redux/rtk-api'
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
        selectedNews1es,
        setSelectedNews1es,
    } = useNews1esStore()

    const [updateNews1es, { isLoading }] = useUpdateNews1esMutation()
    const [editedNews1, setNews1] = useState<INews1es>(defaultNews1es)

    useEffect(() => {
        if (selectedNews1es) {
            setNews1(selectedNews1es)
        }
    }, [selectedNews1es])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNews1({ ...editedNews1, [name]: value })
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setNews1({ ...editedNews1, [name]: checked })
    }

    const handleSelectChange = (name: string, value: string) => {
        setNews1({ ...editedNews1, [name]: value })
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setNews1({
                ...editedNews1,
                [field]: {
                    ...(editedNews1[field as keyof INews1es] as object),
                    [nestedField]: new Date(value),
                },
            })
        } else {
            setNews1({ ...editedNews1, [field]: new Date(value) })
        }
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setNews1({
                ...editedNews1,
                [field]: {
                    ...(editedNews1[field as keyof INews1es] as object),
                    [nestedField]: value,
                },
            })
        } else {
            setNews1({ ...editedNews1, [field]: value })
        }
    }

    const handleArrayChange = (name: string, value: string) => {
        setNews1({ ...editedNews1, [name]: value.split(',').map(s => s.trim()) })
    }

    const handleEditNews1 = async () => {
        if (!selectedNews1es) return

        try {
            await updateNews1es({
                id: selectedNews1es._id,
                ...editedNews1,
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
                    <DialogTitle>Edit News1</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <InputField
                            id="title1"
                            name="title1"
                            label="Title1"
                            value={editedNews1['title1'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="title2"
                            name="title2"
                            label="Title2"
                            value={editedNews1['title2'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="title3"
                            name="title3"
                            label="Title3"
                            value={editedNews1['title3'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="title4"
                            name="title4"
                            label="Title4"
                            value={editedNews1['title4'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="title5"
                            name="title5"
                            label="Title5"
                            value={editedNews1['title5'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="title6"
                            name="title6"
                            label="Title6"
                            value={editedNews1['title6'] || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedNews1es(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditNews1}
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

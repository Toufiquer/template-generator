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

import { IAccesses, defaultAccesses } from '../api/v1/model'
import { useAccessesStore } from '../store/store'
import { useUpdateAccessesMutation } from '../redux/rtk-api'
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
        selectedAccesses,
        setSelectedAccesses,
    } = useAccessesStore()

    const [updateAccesses, { isLoading }] = useUpdateAccessesMutation()
    const [editedAccess, setAccess] = useState<IAccesses>(defaultAccesses)

    useEffect(() => {
        if (selectedAccesses) {
            setAccess(selectedAccesses)
        }
    }, [selectedAccesses])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setAccess({ ...editedAccess, [name]: value })
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setAccess({ ...editedAccess, [name]: checked })
    }

    const handleSelectChange = (name: string, value: string) => {
        setAccess({ ...editedAccess, [name]: value })
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setAccess({
                ...editedAccess,
                [field]: {
                    ...(editedAccess[field as keyof IAccesses] as object),
                    [nestedField]: new Date(value),
                },
            })
        } else {
            setAccess({ ...editedAccess, [field]: new Date(value) })
        }
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setAccess({
                ...editedAccess,
                [field]: {
                    ...(editedAccess[field as keyof IAccesses] as object),
                    [nestedField]: value,
                },
            })
        } else {
            setAccess({ ...editedAccess, [field]: value })
        }
    }

    const handleArrayChange = (name: string, value: string) => {
        setAccess({ ...editedAccess, [name]: value.split(',').map(s => s.trim()) })
    }

    const handleEditAccess = async () => {
        if (!selectedAccesses) return

        try {
            await updateAccesses({
                id: selectedAccesses._id,
                ...editedAccess,
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
                    <DialogTitle>Edit Access</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <InputField
                            id="student"
                            name="student"
                            label="Student"
                            value={editedAccess['student'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="admin"
                            name="admin"
                            label="Admin"
                            value={editedAccess['admin'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="moderator"
                            name="moderator"
                            label="Moderator"
                            value={editedAccess['moderator'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="mentor"
                            name="mentor"
                            label="Mentor"
                            value={editedAccess['mentor'] || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="instructor"
                            name="instructor"
                            label="Instructor"
                            value={editedAccess['instructor'] || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelectedAccesses(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEditAccess}
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

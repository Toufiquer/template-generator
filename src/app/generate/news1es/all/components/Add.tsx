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

import { useNews1esStore } from '../store/store'
import { useAddNews1esMutation } from '../redux/rtk-api'
import { INews1es, defaultNews1es } from '@/app/generate/news1es/all/store/data/data'
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
    const { toggleAddModal, isAddModalOpen, setNews1es } = useNews1esStore()
    const [addNews1es, { isLoading }] = useAddNews1esMutation()
    const [newNews1, setNewNews1] = useState<INews1es>(defaultNews1es)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewNews1({ ...newNews1, [name]: value })
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setNewNews1({ ...newNews1, [name]: checked })
    }

    const handleSelectChange = (name: string, value: string) => {
        setNewNews1({ ...newNews1, [name]: value })
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setNewNews1({
                ...newNews1,
                [field]: {
                    ...(newNews1[field as keyof INews1es] as object),
                    [nestedField]: new Date(value),
                },
            })
        } else {
            setNewNews1({ ...newNews1, [field]: new Date(value) })
        }
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setNewNews1({
                ...newNews1,
                [field]: {
                    ...(newNews1[field as keyof INews1es] as object),
                    [nestedField]: value,
                },
            })
        } else {
            setNewNews1({ ...newNews1, [field]: value })
        }
    }

    const handleArrayChange = (name: string, value: string) => {
        setNewNews1({ ...newNews1, [name]: value.split(',').map(item => item.trim()) })
    }

    const handleAddNews1 = async () => {
        try {
            const { _id, ...updateNews1es } = newNews1
            console.log('_id', _id)
            const addedNews1 = await addNews1es(updateNews1es).unwrap()
            setNews1es([addedNews1])
            toggleAddModal(false)
            setNewNews1(defaultNews1es)
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
                    <DialogTitle>Add New News1</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <InputField
                            id="title1"
                            name="title1"
                            label="Title1"
                            value={newNews1['title1']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="title2"
                            name="title2"
                            label="Title2"
                            value={newNews1['title2']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="title3"
                            name="title3"
                            label="Title3"
                            value={newNews1['title3']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="title4"
                            name="title4"
                            label="Title4"
                            value={newNews1['title4']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="title5"
                            name="title5"
                            label="Title5"
                            value={newNews1['title5']}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="title6"
                            name="title6"
                            label="Title6"
                            value={newNews1['title6']}
                            onChange={handleInputChange}
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
                        onClick={handleAddNews1}
                    >
                        {isLoading ? 'Adding...' : 'Add News1'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents

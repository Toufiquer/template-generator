/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import React, { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
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

import { useBooksStore } from '../store/Store'
import { useAddBooksMutation } from '../redux/rtk-Api'
import {
    defaultBooksData,
    select_5_000___,
    ISelect_6_000___,
    booksSelectorArr,
} from '../store/StoreConstants'

import DataSelect from './DataSelect'
import ImagesSelect from './ImagesSelect'
import RichTextEditor from './rich-text-editor'
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
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}> = ({ id, name, label, type = 'text', value, onChange }) => (
    <div className="grid grid-cols-4 items-center gap-4 pr-1">
        <Label htmlFor={id} className="text-right">
            {label}
        </Label>
        <Input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className="col-span-3"
        />
    </div>
)

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, newBooks, setNewBooks, setBooks } =
        useBooksStore()
    const [addBooks, { isLoading }] = useAddBooksMutation()

    const [newItemTags, setNewItemTags] = useState<string[]>([])
    const [newImages, setNewImages] = useState<string[]>([])

    const [descriptions, setDescriptions] = useState('')

    const onChange = (content: string) => {
        setDescriptions(content)
        console.log(content)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewBooks({ ...newBooks, [name]: value })
    }

    const handleRoleChange = (value: string) => {
        setNewBooks({ ...newBooks, role: value as ISelect_6_000___ })
    }

    const handleAddBooks = async () => {
        const books = {
            dataArr: newItemTags || [],
            name: newBooks.name || '',
            email: newBooks.email || '',
            passCode: newBooks.passCode || '',
            alias: newBooks.alias || '',
            role: (newBooks.role as ISelect_6_000___) || select_5_000___,
            images: newImages || [],
            descriptions: descriptions || '',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        try {
            const addedBooks = await addBooks(books).unwrap() // Get the returned data
            setBooks([books, addedBooks]) // Use the returned data instead of the local `Books` object
            toggleAddModal(false)
            setNewBooks(defaultBooksData)
            handleSuccess('Added Successful')
        } catch (error: unknown) {
            console.log(error)
            let errMessage: string = ''
            if (isApiErrorResponse(error)) {
                errMessage = formatDuplicateKeyError(error.data.message)
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }

    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Books</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        <InputField
                            id="name"
                            name="name"
                            label="Name"
                            value={(newBooks.name as string) || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            value={(newBooks.email as string) || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="passCode"
                            name="passCode"
                            label="Pass Code"
                            type="password"
                            value={(newBooks.passCode as string) || ''}
                            onChange={handleInputChange}
                        />
                        <InputField
                            id="alias"
                            name="alias"
                            label="Alias"
                            value={(newBooks.alias as string) || ''}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role
                            </Label>
                            <Select
                                onValueChange={handleRoleChange}
                                defaultValue={(newBooks.role as string) || ''}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {booksSelectorArr?.map((i, index) => (
                                        <SelectItem
                                            key={i + index}
                                            className="cursor-pointer"
                                            value={i}
                                        >
                                            {i}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DataSelect
                            newItemTags={newItemTags as string[]}
                            setNewItemTags={setNewItemTags}
                        />
                        <ImagesSelect
                            newImages={newImages as string[]}
                            setNewImages={setNewImages}
                        />

                        <RichTextEditor
                            content={descriptions}
                            onChange={onChange}
                        />
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        className="border-slate-500 hover:border-slate-600 border-1 cursor-pointer"
                        onClick={() => toggleAddModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="outline"
                        className="border-slate-500 hover:border-slate-600 border-1 cursor-pointer"
                        onClick={handleAddBooks}
                    >
                        Add Books
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents

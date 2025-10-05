/*
|-----------------------------------------
| setting up StringArrayField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: template-generator, October, 2025
|-----------------------------------------
*/

'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, PlusCircle } from 'lucide-react'

// Define the shape of each item in the array
type Item = Record<string, any>

interface StringArrayFieldProps {}

const StringArrayField: React.FC<StringArrayFieldProps> = () => {
    const id = Math.random().toString(36).substring(2)
    const fields = ['field1', 'field2', 'field3'] // Example fields
    const value: { [key in string]: string }[] = []
    const onChange = (newValue: Item[]) => {}
    // Handles changes to an input field within a specific item
    const handleItemChange = (
        index: number,
        field: string,
        fieldValue: string
    ) => {
        // Create a new array with the updated item (immutability)
        const newItems = value.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: fieldValue }
            }
            return item
        })
        onChange(newItems)
    }

    // Adds a new, empty item to the array
    const handleAddItem = () => {
        // Create a new object with all specified fields initialized to empty strings
        const newItem = fields.reduce((acc, field) => {
            acc[field] = ''
            return acc
        }, {} as Item)
        // Create a new array by appending the new item
        onChange([...value, newItem])
    }

    // Removes an item from the array at a specific index
    const handleRemoveItem = (index: number) => {
        // Create a new array excluding the item at the specified index
        const newItems = value.filter((_, i) => i !== index)
        onChange(newItems)
    }

    return (
        <div id={id} className="w-full p-3 border rounded-lg space-y-3">
            {value.map((item, index) => (
                <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-md"
                >
                    {fields.map((field) => (
                        <div key={field} className="flex-1 min-w-0">
                            <Input
                                type="text"
                                placeholder={field}
                                value={item[field] || ''}
                                onChange={(e) =>
                                    handleItemChange(
                                        index,
                                        field,
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveItem(index)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAddItem}
            >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Item
            </Button>
        </div>
    )
}

export default StringArrayField

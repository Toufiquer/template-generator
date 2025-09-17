/**
 * Generates the content for a BulkUpdate.tsx component file.
 *
 * @param {InputJsonFile} inputJsonFile The JSON object with schema and naming conventions.
 * @returns {string} The complete BulkUpdate.tsx file content as a string.
 */
export const generateBulkUpdateComponentFile = (
    inputJsonFile: string
): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile) || {}

    // 1. Extract and format names.
    const pluralPascalCase = namingConvention.Users_1_000___ // e.g., "Posts"
    const pluralLowerCase = namingConvention.users_2_000___ // e.g., "posts"
    const singularPascalCase = namingConvention.User_3_000___ // e.g., "Post"
    const interfaceName = `I${pluralPascalCase}` // e.g., "IPosts"

    // 2. Find a primary display key for listing items.
    const schemaKeys = Object.keys(schema)
    const displayKey =
        schemaKeys.find((key) => key.toLowerCase() === 'name') ||
        schemaKeys.find((key) => key.toLowerCase() === 'title') ||
        schemaKeys.find((key) => schema[key] === 'STRING') ||
        '_id'

    // 3. Find the first field suitable for bulk updating (SELECT or RADIOBUTTON).
    const editableField = Object.entries(schema).find(
        ([, value]) =>
            typeof value === 'string' &&
            ['SELECT', 'RADIOBUTTON'].includes(value.toUpperCase())
    )
    const editableFieldKey = editableField ? editableField[0] : 'role' // Default to 'role' if none found
    const editableFieldLabel = editableFieldKey
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())

    // 4. Construct the entire file content.
    return `import React from 'react'

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

import { ${interfaceName} } from '../store/data/data'
import { use${pluralPascalCase}Store } from '../store/store'
import { ${pluralLowerCase}SelectorArr } from '../store/store-constant'
import { useBulkUpdate${pluralPascalCase}Mutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const BulkUpdateNextComponents: React.FC = () => {
    const {
        toggleBulkUpdateModal,
        isBulkUpdateModalOpen,
        bulkData,
        setBulkData,
    } = use${pluralPascalCase}Store()
    
    const [bulkUpdate${pluralPascalCase}, { isLoading }] = useBulkUpdate${pluralPascalCase}Mutation()

    const handleBulkUpdate = async () => {
        if (!bulkData.length) return
        try {
            const newBulkData = bulkData.map(({ _id, ...rest }) => ({
                id: _id,
                updateData: rest,
            }))
            await bulkUpdate${pluralPascalCase}(newBulkData).unwrap()
            toggleBulkUpdateModal(false)
            setBulkData([])
            handleSuccess('Update Successful')
        } catch (error) {
            console.error('Failed to edit ${pluralLowerCase}:', error)
            handleError('Failed to update items. Please try again.')
        }
    }

    const handleFieldChangeForAll = (value: string) => {
        setBulkData(
            bulkData.map((${singularPascalCase.toLowerCase()}) => ({
                ...${singularPascalCase.toLowerCase()},
                ['${editableFieldKey}']: value,
            })) as ${interfaceName}[]
        )
    }

    return (
        <Dialog
            open={isBulkUpdateModalOpen}
            onOpenChange={toggleBulkUpdateModal}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Bulk Update</DialogTitle>
                </DialogHeader>
                {bulkData.length > 0 && (
                    <div>
                        <p className="pt-2">
                            You are about to update{' '}
                            <span className="font-semibold">
                                ({bulkData.length})
                            </span>{' '}
                            ${pluralLowerCase}.
                        </p>
                        <div className="w-full flex items-center justify-between pt-2">
                            <p>Set all <span className="font-semibold">${editableFieldLabel}</span> to</p>
                            <Select
                                onValueChange={(value) =>
                                    handleFieldChangeForAll(value)
                                }
                                defaultValue={
                                    (${pluralLowerCase}SelectorArr[0] as string) || ''
                                }
                            >
                                <SelectTrigger className="bg-slate-50 w-[180px]">
                                    <SelectValue placeholder="Select a value" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-50">
                                    {${pluralLowerCase}SelectorArr?.map((option, index) => (
                                        <SelectItem
                                            key={option + index}
                                            value={option}
                                            className="cursor-pointer hover:bg-slate-200"
                                        >
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex flex-col gap-2">
                        {bulkData.map((${singularPascalCase.toLowerCase()}, idx) => (
                            <div
                                key={(${singularPascalCase.toLowerCase()}._id as string) || idx}
                                className="flex items-center justify-between"
                            >
                                <span>
                                    {idx + 1}. {(${singularPascalCase.toLowerCase()} as any)['${displayKey}'] as string || ''}
                                </span>
                                <span className="text-blue-500">{${singularPascalCase.toLowerCase()}['${displayKey}'] as string}</span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => toggleBulkUpdateModal(false)}
                        className="cursor-pointer border-slate-400 hover:border-slate-500"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="outline"
                        onClick={handleBulkUpdate}
                        className="text-green-500 hover:text-green-600 cursor-pointer bg-green-100 hover:bg-green-200 border border-green-300 hover:border-green-400"
                    >
                        {isLoading ? 'Updating...' : 'Update Selected'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BulkUpdateNextComponents
`
}

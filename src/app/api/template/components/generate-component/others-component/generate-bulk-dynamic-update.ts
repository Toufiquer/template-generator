/**
 * Defines the structure for the schema object.
 */
interface Schema {
    [key: string]: string | Schema
}

/**
 * Defines the structure for the naming convention object.
 */
interface NamingConvention {
    Users_1_000___: string
    users_2_000___: string
    User_3_000___: string
    user_4_000___: string
    [key: string]: string // Allows for additional keys
}

/**
 * Defines the structure for the main input JSON file.
 */
interface InputJsonFile {
    uid: string
    templateName: string
    schema: Schema
    namingConvention: NamingConvention
}

/**
 * Generates the content for a BulkDynamicUpdate.tsx component file.
 *
 * @param {InputJsonFile} inputJsonFile The JSON object with schema and naming conventions.
 * @returns {string} The complete BulkDynamicUpdate.tsx file content as a string.
 */
export const generateBulkDynamicUpdateComponentFile = (
    inputJsonFile: string
): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile)

    // 1. Extract and format names from the naming convention.
    const pluralPascalCase = namingConvention.Users_1_000___ // e.g., "Posts"
    const pluralLowerCase = namingConvention.users_2_000___ // e.g., "posts"
    const singularPascalCase = namingConvention.User_3_000___ // e.g., "Post"

    // 2. Intelligently find the most suitable display key from the schema.
    const schemaKeys = Object.keys(schema)
    const displayKey =
        schemaKeys.find((key) => key.toLowerCase() === 'name') ||
        schemaKeys.find((key) => key.toLowerCase() === 'title') ||
        schemaKeys.find((key) => schema[key] === 'STRING') ||
        '_id' // Fallback to _id if no suitable string is found

    // 3. Construct the file content using a template literal.
    return `import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { use${pluralPascalCase}Store } from '../store/store'
import { useBulkUpdate${pluralPascalCase}Mutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'
import DynamicDataSelect from './DynamicDataSelect'

const BulkDynamicUpdateNextComponents: React.FC = () => {
    const [newItemTags, setNewItemTags] = useState<string[]>([])
    const {
        toggleBulkDynamicUpdateModal,
        isBulkDynamicUpdateModal,
        bulkData,
        setBulkData,
    } = use${pluralPascalCase}Store()

    const [bulkUpdate${pluralPascalCase}, { isLoading }] = useBulkUpdate${pluralPascalCase}Mutation()

    const handleBulkEdit${pluralPascalCase} = async () => {
        if (!bulkData.length) return
        try {
            // Note: This assumes the schema has a 'dataArr' field to be updated.
            // This logic can be adapted if the target field is different.
            const newBulkData = bulkData.map(({ _id, ...rest }) => ({
                id: _id,
                updateData: { ...rest, dataArr: newItemTags },
            }))

            await bulkUpdate${pluralPascalCase}(newBulkData).unwrap()
            toggleBulkDynamicUpdateModal(false)
            setBulkData([])
            setNewItemTags([])
            handleSuccess('Update Successful')
        } catch (error) {
            console.error('Failed to edit ${pluralLowerCase}:', error)
            handleError('Failed to update items. Please try again.')
        }
    }

    return (
        <Dialog
            open={isBulkDynamicUpdateModal}
            onOpenChange={toggleBulkDynamicUpdateModal}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Dynamic Update</DialogTitle>
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
                            <DynamicDataSelect
                                label="Update all data as"
                                newItemTags={newItemTags as string[]}
                                setNewItemTags={setNewItemTags}
                            />
                        </div>
                    </div>
                )}
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex flex-col gap-2">
                        {bulkData.map((${singularPascalCase.toLowerCase()}, idx) => (
                            <div
                                key={(${singularPascalCase.toLowerCase()}._id as string) || idx}
                                className="flex items-start mb-2 justify-between flex-col"
                            >
                                <div className="flex flex-col">
                                    <span>
                                        {idx + 1}.{' '}
                                        {(${singularPascalCase.toLowerCase()} as any)['${displayKey}'] as string || ''}
                                    </span>
                                    <span className="text-xs mt-0 text-blue-500">
                                        Will be updated to: {newItemTags.join(', ') || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => toggleBulkDynamicUpdateModal(false)}
                        className="cursor-pointer border-slate-400 hover:border-slate-500"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="outline"
                        onClick={handleBulkEdit${pluralPascalCase}}
                        className="text-green-500 hover:text-green-600 cursor-pointer bg-green-100 hover:bg-green-200 border border-green-300 hover:border-green-400"
                    >
                        {isLoading ? 'Updating...' : 'Update Selected'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BulkDynamicUpdateNextComponents
`
}

// --- EXAMPLE USAGE ---

const inputJsonFile: InputJsonFile = {
    uid: '000',
    templateName: 'Basic Template',
    schema: {
        title: 'STRING', // The generator will pick 'title' as the display key
        email: 'EMAIL',
        description: 'DESCRIPTION',
        dataArr: 'MULTICHECKBOX', // This field is targeted by the component's logic
    },
    namingConvention: {
        Users_1_000___: 'Posts',
        users_2_000___: 'posts',
        User_3_000___: 'Post',
        user_4_000___: 'post',
        ISelect_6_000___: 'ISelect',
        select_5_000___: 'select',
    },
}

/**
 * Generates the content for a Delete.tsx component file.
 *
 * @param {InputJsonFile} inputJsonFile The JSON object with schema and naming conventions.
 * @returns {string} The complete Delete.tsx file content as a string.
 */
export const generateDeleteComponentFile = (inputJsonFile: string): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile)

    // 1. Extract and format names.
    const pluralPascalCase = namingConvention.Users_1_000___ // e.g., "Posts"
    const singularPascalCase = namingConvention.User_3_000___ // e.g., "Post"
    const interfaceName = `I${pluralPascalCase}` // e.g., "IPosts"

    // 2. Intelligently find the most suitable display key from the schema.
    const schemaKeys = Object.keys(schema)
    const displayKey =
        schemaKeys.find((key) => key.toLowerCase() === 'name') ||
        schemaKeys.find((key) => key.toLowerCase() === 'title') ||
        schemaKeys.find((key) => schema[key] === 'STRING') ||
        '_id' // Fallback to _id if no suitable string is found

    // 3. Construct the entire file content using a template literal.
    return `import React from 'react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { ${interfaceName}, default${pluralPascalCase} } from '../store/data/data'
import { use${pluralPascalCase}Store } from '../store/store'
import { useDelete${pluralPascalCase}Mutation } from '../redux/rtk-api'
import { handleSuccess, handleError } from './utils'

const DeleteNextComponents: React.FC = () => {
    const {
        toggleDeleteModal,
        isDeleteModalOpen,
        selected${pluralPascalCase},
        setSelected${pluralPascalCase},
    } = use${pluralPascalCase}Store()
    
    const [delete${singularPascalCase}, { isLoading }] = useDelete${pluralPascalCase}Mutation()

    const handleDelete = async () => {
        if (selected${pluralPascalCase}) {
            try {
                await delete${singularPascalCase}({
                    id: selected${pluralPascalCase}._id,
                }).unwrap()
                toggleDeleteModal(false)
                handleSuccess('Delete Successful')
            } catch (error) {
                console.error('Failed to delete ${singularPascalCase}:', error)
                handleError('Failed to delete item. Please try again.')
            }
        }
    }

    const handleCancel = () => {
        toggleDeleteModal(false)
        setSelected${pluralPascalCase}({ ...default${pluralPascalCase} } as ${interfaceName})
    }

    const displayName = (selected${pluralPascalCase})?.['${displayKey}'] || ''

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                {selected${pluralPascalCase} && (
                    <div className="py-4">
                        <p>
                            You are about to delete this ${singularPascalCase.toLowerCase()}:{' '}
                            <span className="font-semibold">
                                {displayName}
                            </span>
                        </p>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteNextComponents
`
}

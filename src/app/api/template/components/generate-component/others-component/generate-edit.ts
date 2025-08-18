/**
 * Defines the structure for the schema object, allowing for nested properties.
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
    [key: string]: string
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
 * Generates the content for a dynamic Edit.tsx component file based on a JSON schema.
 *
 * @param {InputJsonFile} inputJsonFile The JSON object with schema and naming conventions.
 * @returns {string} The complete Edit.tsx file content as a string.
 */
export const generateEditComponentFile = (inputJsonFile: string): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile)

    const pluralPascalCase = namingConvention.Users_1_000___ // e.g., "Posts"
    const singularPascalCase = namingConvention.User_3_000___ // e.g., "Post"
    const pluralLowerCase = namingConvention.users_2_000___ // e.g., "posts"
    const interfaceName = `I${pluralPascalCase}` // e.g., "IPosts"
    const defaultInstanceName = `default${pluralPascalCase}` // e.g., "defaultPosts"
    const editedStateName = `edited${singularPascalCase}` // e.g., "editedPost"

    /**
     * Generates the JSX for a specific form field based on its schema type.
     */
    const generateFormFieldJsx = (key: string, type: string): string => {
        const label = key
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())

        switch (type.toUpperCase()) {
            case 'STRING':
            case 'URL':
            case 'AUTOCOMPLETE':
            case 'DYNAMICSELECT':
            case 'MULTISELECT':
            case 'MULTIDYNAMICSELECT':
            case 'IMAGE':
            case 'PHONE':
            case 'RICHTEXT':
            case 'TEST':
            case 'INFO':
                return `
                        <InputField
                            id="${key}"
                            name="${key}"
                            label="${label}"
                            value={${editedStateName}['${key}'] || ''}
                            onChange={handleInputChange}
                        />`
            case 'EMAIL':
                return `
                        <InputField
                            id="${key}"
                            name="${key}"
                            label="${label}"
                            type="email"
                            value={${editedStateName}['${key}'] || ''}
                            onChange={handleInputChange}
                        />`

            case 'PASSWORD':
            case 'PASSCODE':
                return `
                        <InputField
                            id="${key}"
                            name="${key}"
                            label="${label}"
                            type="password"
                            value={${editedStateName}['${key}'] || ''}
                            onChange={handleInputChange}
                        />`

            case 'DESCRIPTION':
                return `
                        <InputField
                            id="${key}"
                            name="${key}"
                            label="${label}"
                            type="textarea"
                            value={${editedStateName}['${key}'] || ''}
                            onChange={handleInputChange}
                        />`

            case 'INTNUMBER':
            case 'FLOATNUMBER':
                return `
                        <InputField
                            id="${key}"
                            name="${key}"
                            label="${label}"
                            type="number"
                            value={${editedStateName}['${key}'] || 0}
                            onChange={handleInputChange}
                        />`

            case 'BOOLEAN':
            case 'CHECKBOX':
                return `
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="${key}" className="text-right">
                                ${label}
                            </Label>
                            <Checkbox
                                id="${key}"
                                name="${key}"
                                checked={${editedStateName}['${key}'] || false}
                                onCheckedChange={(checked) => handleCheckboxChange('${key}', !!checked)}
                            />
                        </div>`

            case 'SELECT':
            case 'RADIOBUTTON':
                return `
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="${key}" className="text-right">
                                ${label}
                            </Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('${key}', value)}
                                value={${editedStateName}['${key}'] || ''}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Option 1">Option 1</SelectItem>
                                    <SelectItem value="Option 2">Option 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>`

            case 'IMAGES':
            case 'MULTICHECKBOX':
                return `
                        <InputField
                            id="${key}"
                            name="${key}"
                            label="${label} (comma separated)"
                            value={(${editedStateName}['${key}'] as string[])?.join(',') || ''}
                            onChange={(e) => handleArrayChange('${key}', e.target.value)}
                        />`

            case 'DATE':
                return `
                        <InputField
                            id="${key}"
                            name="${key}"
                            label="${label}"
                            type="date"
                            value={formatDate(${editedStateName}['${key}'])}
                            onChange={(e) => handleDateChange(e, '${key}')}
                        />`
            case 'TIME':
                return `
                        <InputField
                            id="${key}"
                            name="${key}"
                            label="${label}"
                            type="time"
                            value={${editedStateName}['${key}'] || ''}
                            onChange={(e) => handleTimeChange(e, '${key}')}
                        />`

            case 'DATERANGE':
                return `
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="${key}-start" className="text-right">${label} Start</Label>
                            <Input
                                id="${key}-start"
                                name="${key}-start"
                                type="date"
                                value={formatDate(${editedStateName}['${key}']?.start)}
                                onChange={(e) => handleDateChange(e, '${key}', 'start')}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="${key}-end" className="text-right">${label} End</Label>
                            <Input
                                id="${key}-end"
                                name="${key}-end"
                                type="date"
                                value={formatDate(${editedStateName}['${key}']?.end)}
                                onChange={(e) => handleDateChange(e, '${key}', 'end')}
                                className="col-span-3"
                            />
                        </div>`
            case 'TIMERANGE':
                return `
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="${key}-start" className="text-right">${label} Start</Label>
                            <Input
                                id="${key}-start"
                                name="${key}-start"
                                type="time"
                                value={${editedStateName}['${key}']?.start || ''}
                                onChange={(e) => handleTimeChange(e, '${key}', 'start')}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="${key}-end" className="text-right">${label} End</Label>
                            <Input
                                id="${key}-end"
                                name="${key}-end"
                                type="time"
                                value={${editedStateName}['${key}']?.end || ''}
                                onChange={(e) => handleTimeChange(e, '${key}', 'end')}
                                className="col-span-3"
                            />
                        </div>`

            case 'COLORPICKER':
                return `
                        <InputField
                            id="${key}"
                            name="${key}"
                            label="${label}"
                            type="color"
                            value={${editedStateName}['${key}'] || '#000000'}
                            onChange={handleInputChange}
                        />`
            default:
                return ``
        }
    }

    const formFieldsJsx = Object.entries(schema)
        .map(([key, value]) => generateFormFieldJsx(key, value as string))
        .join('')

    return `import React, { useEffect, useState } from 'react'

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

import { ${interfaceName}, ${defaultInstanceName} } from '../api/v1/model'
import { use${pluralPascalCase}Store } from '../store/store'
import { useUpdate${pluralPascalCase}Mutation } from '../redux/rtk-api'
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
        selected${pluralPascalCase},
        setSelected${pluralPascalCase},
    } = use${pluralPascalCase}Store()

    const [update${pluralPascalCase}, { isLoading }] = useUpdate${pluralPascalCase}Mutation()
    const [${editedStateName}, set${singularPascalCase}] = useState<${interfaceName}>(${defaultInstanceName})

    useEffect(() => {
        if (selected${pluralPascalCase}) {
            set${singularPascalCase}(selected${pluralPascalCase})
        }
    }, [selected${pluralPascalCase}])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        set${singularPascalCase}({ ...${editedStateName}, [name]: value })
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        set${singularPascalCase}({ ...${editedStateName}, [name]: checked })
    }

    const handleSelectChange = (name: string, value: string) => {
        set${singularPascalCase}({ ...${editedStateName}, [name]: value })
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            set${singularPascalCase}({
                ...${editedStateName},
                [field]: {
                    ...(${editedStateName}[field as keyof ${interfaceName}] as object),
                    [nestedField]: new Date(value),
                },
            })
        } else {
            set${singularPascalCase}({ ...${editedStateName}, [field]: new Date(value) })
        }
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            set${singularPascalCase}({
                ...${editedStateName},
                [field]: {
                    ...(${editedStateName}[field as keyof ${interfaceName}] as object),
                    [nestedField]: value,
                },
            })
        } else {
            set${singularPascalCase}({ ...${editedStateName}, [field]: value })
        }
    }

    const handleArrayChange = (name: string, value: string) => {
        set${singularPascalCase}({ ...${editedStateName}, [name]: value.split(',').map(s => s.trim()) })
    }

    const handleEdit${singularPascalCase} = async () => {
        if (!selected${pluralPascalCase}) return

        try {
            await update${pluralPascalCase}({
                id: selected${pluralPascalCase}._id,
                ...${editedStateName},
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
                    <DialogTitle>Edit ${singularPascalCase}</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        ${formFieldsJsx}
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleEditModal(false)
                            setSelected${pluralPascalCase}(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleEdit${singularPascalCase}}
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
`
}

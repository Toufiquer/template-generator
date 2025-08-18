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
 * Generates the content for a dynamic Add.tsx component file based on a JSON schema.
 *
 * @param {InputJsonFile} inputJsonFile The JSON object with schema and naming conventions.
 * @returns {string} The complete Add.tsx file content as a string.
 */
export const generateAddComponentFile = (inputJsonFile: string): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile) || {}

    const pluralPascalCase = namingConvention.Users_1_000___ // e.g., "Posts"
    const singularPascalCase = namingConvention.User_3_000___ // e.g., "Post"
    const pluralLowerCase = namingConvention.users_2_000___ // e.g., "posts"
    const interfaceName = `I${pluralPascalCase}` // e.g., "IPosts"
    const defaultInstanceName = `default${pluralPascalCase}` // e.g., "defaultPosts"

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
            case 'DYNAMICSELECT': // Handled as simple text for now
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
                            value={new${singularPascalCase}['${key}']}
                            onChange={handleInputChange}
                        />`
            case 'EMAIL':
                return `
                        <InputField
                            id="${key}"
                            name="${key}"
                            label="${label}"
                            type="email"
                            value={new${singularPascalCase}['${key}']}
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
                            value={new${singularPascalCase}['${key}']}
                            onChange={handleInputChange}
                        />`

            case 'DESCRIPTION':
                return `
                        <InputField
                            id="${key}"
                            name="${key}"
                            label="${label}"
                            type="textarea"
                            value={new${singularPascalCase}['${key}']}
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
                            value={new${singularPascalCase}['${key}']}
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
                                checked={new${singularPascalCase}['${key}']}
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
                                value={new${singularPascalCase}['${key}']}
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
                            value={(new${singularPascalCase}['${key}'] as string[]).join(',')}
                            onChange={(e) => handleArrayChange('${key}', e.target.value)}
                        />`

            case 'DATE':
                return `
                        <InputField
                            id="${key}"
                            name="${key}"
                            label="${label}"
                            type="date"
                            value={new${singularPascalCase}['${key}'] ? new Date(new${singularPascalCase}['${key}']).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleDateChange(e, '${key}')}
                        />`
            case 'TIME':
                return `
                        <InputField
                            id="${key}"
                            name="${key}"
                            label="${label}"
                            type="time"
                            value={new${singularPascalCase}['${key}']}
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
                                value={new${singularPascalCase}['${key}'].start ? new Date(new${singularPascalCase}['${key}'].start).toISOString().split('T')[0] : ''}
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
                                value={new${singularPascalCase}['${key}'].end ? new Date(new${singularPascalCase}['${key}'].end).toISOString().split('T')[0] : ''}
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
                                value={new${singularPascalCase}['${key}'].start}
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
                                value={new${singularPascalCase}['${key}'].end}
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
                            value={new${singularPascalCase}['${key}']}
                            onChange={handleInputChange}
                        />`
            default:
                return `
                        {/* Field type '${type}' is not supported yet. */}
                        <InputField
                            id="${key}"
                            name="${key}"
                            label="${label}"
                            value={new${singularPascalCase}['${key}']}
                            onChange={handleInputChange}
                        />`
        }
    }

    const formFieldsJsx = Object.entries(schema)
        .map(([key, value]) => generateFormFieldJsx(key, value as string))
        .join('')

    return `import { useState } from 'react'

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

import { use${pluralPascalCase}Store } from '../store/store'
import { useAdd${pluralPascalCase}Mutation } from '../redux/rtk-api'
import { ${interfaceName}, ${defaultInstanceName} } from '@/app/dashboard/${pluralLowerCase}/all/api/v1/model'
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
    const { toggleAddModal, isAddModalOpen, set${pluralPascalCase} } = use${pluralPascalCase}Store()
    const [add${pluralPascalCase}, { isLoading }] = useAdd${pluralPascalCase}Mutation()
    const [new${singularPascalCase}, setNew${singularPascalCase}] = useState<${interfaceName}>(${defaultInstanceName})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNew${singularPascalCase}({ ...new${singularPascalCase}, [name]: value })
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setNew${singularPascalCase}({ ...new${singularPascalCase}, [name]: checked })
    }

    const handleSelectChange = (name: string, value: string) => {
        setNew${singularPascalCase}({ ...new${singularPascalCase}, [name]: value })
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setNew${singularPascalCase}({
                ...new${singularPascalCase},
                [field]: {
                    ...(new${singularPascalCase}[field as keyof ${interfaceName}] as object),
                    [nestedField]: new Date(value),
                },
            })
        } else {
            setNew${singularPascalCase}({ ...new${singularPascalCase}, [field]: new Date(value) })
        }
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, nestedField?: 'start' | 'end') => {
        const { value } = e.target
        if (nestedField) {
            setNew${singularPascalCase}({
                ...new${singularPascalCase},
                [field]: {
                    ...(new${singularPascalCase}[field as keyof ${interfaceName}] as object),
                    [nestedField]: value,
                },
            })
        } else {
            setNew${singularPascalCase}({ ...new${singularPascalCase}, [field]: value })
        }
    }

    const handleArrayChange = (name: string, value: string) => {
        setNew${singularPascalCase}({ ...new${singularPascalCase}, [name]: value.split(',').map(item => item.trim()) })
    }

    const handleAdd${singularPascalCase} = async () => {
        try {
            const added${singularPascalCase} = await add${pluralPascalCase}(new${singularPascalCase}).unwrap()
            set${pluralPascalCase}([added${singularPascalCase}])
            toggleAddModal(false)
            setNew${singularPascalCase}(${defaultInstanceName})
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
                    <DialogTitle>Add New ${singularPascalCase}</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        ${formFieldsJsx}
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
                        onClick={handleAdd${singularPascalCase}}
                    >
                        {isLoading ? 'Adding...' : 'Add ${singularPascalCase}'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
`
}

/**
 * Generates the content for a dynamic Edit.tsx component file based on a JSON schema,
 * with conditional imports for required components.
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

    const requiredImports = new Set<string>()
    const componentBodyStatements = new Set<string>()

    const toCamelCase = (str: string) => {
        return str.replace(/-(\w)/g, (_, c) => c.toUpperCase())
    }

    /**
     * Generates a variable definition for an options array, adds it to the component body,
     * and returns the variable name. This function is only called when needed.
     */
    const generateOptionsVariable = (
        key: string,
        optionsString: string | undefined,
        defaultOptions: { label: string; value: string }[]
    ): string => {
        const varName = `${toCamelCase(key)}Options`
        let optionsJsArrayString: string

        if (optionsString) {
            const optionsArray = optionsString
                .split(',')
                .map((opt) => opt.trim())
            optionsJsArrayString = `[\n${optionsArray
                .map((opt) => `        { label: '${opt}', value: '${opt}' }`)
                .join(',\n')}\n    ]`
        } else {
            optionsJsArrayString = `[\n${defaultOptions
                .map(
                    (opt) =>
                        `        { label: '${opt.label}', value: '${opt.value}' }`
                )
                .join(',\n')}\n    ]`
        }

        componentBodyStatements.add(
            `const ${varName} = ${optionsJsArrayString};`
        )
        return varName
    }

    /**
     * Generates the JSX for a specific form field based on its schema type.
     */
    const generateFormFieldJsx = (key: string, type: string): string => {
        const label = key
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())

        const [typeName, optionsString] = type.split('#')

        const formFieldWrapper = (
            label: string,
            componentJsx: string
        ): string => `
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="${key}" className="text-right">
                                ${label}
                            </Label>
                            <div className="col-span-3">
                                ${componentJsx}
                            </div>
                        </div>`

        let componentJsx: string

        switch (typeName.toUpperCase()) {
            case 'STRING':
                requiredImports.add(
                    "import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'"
                )
                componentJsx = `<InputFieldForString id="${key}" placeholder="${label}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'EMAIL':
                requiredImports.add(
                    "import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail'"
                )
                componentJsx = `<InputFieldForEmail id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'PASSWORD':
                requiredImports.add(
                    "import InputFieldForPassword from '@/components/dashboard-ui/InputFieldForPassword'"
                )
                componentJsx = `<InputFieldForPassword id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'PASSCODE':
                requiredImports.add(
                    "import InputFieldForPasscode from '@/components/dashboard-ui/InputFieldForPasscode'"
                )
                componentJsx = `<InputFieldForPasscode id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'URL':
                requiredImports.add(
                    "import UrlInputField from '@/components/dashboard-ui/UrlInputField'"
                )
                componentJsx = `<UrlInputField id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'PHONE':
                requiredImports.add(
                    "import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'"
                )
                componentJsx = `<PhoneInputField id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'DESCRIPTION':
                requiredImports.add(
                    "import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'"
                )
                componentJsx = `<TextareaFieldForDescription id="${key}" value={${editedStateName}['${key}']} onChange={(e) => handleFieldChange('${key}', e.target.value)} />`
                break
            case 'RICHTEXT':
                requiredImports.add(
                    "import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField'"
                )
                componentJsx = `<RichTextEditorField id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'INTNUMBER':
                requiredImports.add(
                    "import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger'"
                )
                componentJsx = `<NumberInputFieldInteger id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}',  value as number)} />`
                break
            case 'FLOATNUMBER':
                requiredImports.add(
                    "import NumberInputFieldFloat from '@/components/dashboard-ui/NumberInputFieldFloat'"
                )
                componentJsx = `<NumberInputFieldFloat id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value as number)} />`
                break
            case 'BOOLEAN':
                requiredImports.add(
                    "import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField'"
                )
                componentJsx = `<BooleanInputField id="${key}" checked={${editedStateName}['${key}']} onCheckedChange={(checked) => handleFieldChange('${key}', checked)} />`
                break
            case 'CHECKBOX':
                requiredImports.add(
                    "import { CheckboxField } from '@/components/dashboard-ui/CheckboxField'"
                )
                componentJsx = `<CheckboxField id="${key}" checked={${editedStateName}['${key}']} onCheckedChange={(checked) => handleFieldChange('${key}', checked)} />`
                break
            case 'DATE':
                requiredImports.add(
                    "import { DateField } from '@/components/dashboard-ui/DateField'"
                )
                componentJsx = `<DateField id="${key}" value={${editedStateName}['${key}']} onChange={(date) => handleFieldChange('${key}', date)} />`
                break
            case 'TIME':
                requiredImports.add(
                    "import TimeField from '@/components/dashboard-ui/TimeField'"
                )
                componentJsx = `<TimeField id="${key}" value={${editedStateName}['${key}']} onChange={(time) => handleFieldChange('${key}', time)} />`
                break
            case 'DATERANGE':
                requiredImports.add(
                    "import DateRangePickerField from '@/components/dashboard-ui/DateRangePickerField'"
                )
                componentJsx = `<DateRangePickerField id="${key}" value={${editedStateName}['${key}']} onChange={(range) => handleFieldChange('${key}', range)} />`
                break
            case 'TIMERANGE':
                requiredImports.add(
                    "import TimeRangePickerField from '@/components/dashboard-ui/TimeRangePickerField'"
                )
                componentJsx = `<TimeRangePickerField id="${key}" value={${editedStateName}['${key}']} onChange={(range) => handleFieldChange('${key}', range)} />`
                break
            case 'COLORPICKER':
                requiredImports.add(
                    "import ColorPickerField from '@/components/dashboard-ui/ColorPickerField'"
                )
                componentJsx = `<ColorPickerField id="${key}" value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'SELECT':
                requiredImports.add(
                    "import { SelectField } from '@/components/dashboard-ui/SelectField'"
                )
                const selectVarName = generateOptionsVariable(
                    key,
                    optionsString,
                    [
                        { label: 'Option 1', value: 'Option 1' },
                        { label: 'Option 2', value: 'Option 2' },
                    ]
                )
                componentJsx = `<SelectField options={${selectVarName}} value={${editedStateName}['${key}']} onValueChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'RADIOBUTTON':
                requiredImports.add(
                    "import { RadioButtonGroupField } from '@/components/dashboard-ui/RadioButtonGroupField'"
                )
                const radioVarName = generateOptionsVariable(
                    key,
                    optionsString,
                    [
                        { label: 'Choice A', value: 'Choice A' },
                        { label: 'Choice B', value: 'Choice B' },
                    ]
                )
                componentJsx = `<RadioButtonGroupField options={${radioVarName}} value={${editedStateName}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'DYNAMICSELECT':
                requiredImports.add(
                    "import DynamicSelectField from '@/components/dashboard-ui/DynamicSelectField'"
                )
                componentJsx = `<DynamicSelectField value={${editedStateName}['${key}']} apiUrl='https://jsonplaceholder.typicode.com/users' onChange={(values) => handleFieldChange('${key}', values)} />`
                break
            case 'IMAGE':
                requiredImports.add(
                    "import ImageUploadFieldSingle from '@/components/dashboard-ui/ImageUploadFieldSingle'"
                )
                componentJsx = `<ImageUploadFieldSingle value={${editedStateName}['${key}']} onChange={(url) => handleFieldChange('${key}', url)} />`
                break
            case 'IMAGES':
                requiredImports.add(
                    "import ImageUploadManager from '@/components/dashboard-ui/ImageUploadManager'"
                )
                componentJsx = `<ImageUploadManager value={${editedStateName}['${key}']} onChange={(urls) => handleFieldChange('${key}', urls)} />`
                break
            case 'MULTICHECKBOX':
                requiredImports.add(
                    "import MultiCheckboxGroupField from '@/components/dashboard-ui/MultiCheckboxGroupField'"
                )
                componentJsx = `<MultiCheckboxGroupField value={${editedStateName}['${key}']} onChange={(values) => handleFieldChange('${key}', values)} />`
                break
            case 'MULTIOPTIONS':
                requiredImports.add(
                    "import MultiOptionsField from '@/components/dashboard-ui/MultiOptionsField'"
                )
                const multiOptionsVarName = generateOptionsVariable(
                    key,
                    optionsString,
                    [
                        {
                            label: 'Default Option A',
                            value: 'Default Option A',
                        },
                        {
                            label: 'Default Option B',
                            value: 'Default Option B',
                        },
                    ]
                )
                componentJsx = `<MultiOptionsField options={${multiOptionsVarName}} value={${editedStateName}['${key}']} onChange={(values) => handleFieldChange('${key}', values)} />`
                break
            case 'AUTOCOMPLETE':
                requiredImports.add(
                    "import AutocompleteField from '@/components/dashboard-ui/AutocompleteField'"
                )
                componentJsx = `<AutocompleteField id="${key}" value={${editedStateName}['${key}']} />`
                break
            default:
                componentJsx = `<Input id="${key}" name="${key}" value={${editedStateName}['${key}']} onChange={(e) => handleFieldChange('${key}', e.target.value)} placeholder="Unsupported field type: ${type}" className="col-span-3" disabled />`
                return `<div className="grid grid-cols-4 items-center gap-4 pr-1"> <Label htmlFor="${key}" className="text-right"> ${label} </Label> ${componentJsx} </div>`
        }

        return formFieldWrapper(label, componentJsx)
    }

    const formFieldsJsx = Object.entries(schema)
        .map(([key, value]) => generateFormFieldJsx(key, value as string))
        .join('')

    const dynamicImports = [...requiredImports].sort().join('\n')

    const dynamicVariablesContent =
        componentBodyStatements.size > 0
            ? `    ${[...componentBodyStatements].sort().join('\n\n    ')}`
            : ''

    return `import React, { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

// Dynamically import only the components needed for the form
${dynamicImports}

import { ${interfaceName}, ${defaultInstanceName} } from '@/app/generate/${pluralLowerCase}/all/store/data/data'
import { use${pluralPascalCase}Store } from '../store/store'
import { useUpdate${pluralPascalCase}Mutation } from '../redux/rtk-api'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

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

    const handleFieldChange = (name: string, value: unknown) => {
        set${singularPascalCase}(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit${singularPascalCase} = async () => {
        if (!selected${pluralPascalCase}) return

        try {
            const { _id, createdAt, updatedAt, ...updateData } = ${editedStateName};
            await update${pluralPascalCase}({
                id: selected${pluralPascalCase}._id,
                ...updateData,
            }).unwrap()
            toggleEditModal(false)
            handleSuccess('Edit Successful')
        } catch (error: unknown) {
            console.error('Failed to update record:', error)
            let errMessage: string = 'An unknown error occurred.'
            if (isApiErrorResponse(error)) {
                errMessage = formatDuplicateKeyError(error.data.message) || 'An API error occurred.'
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }

${dynamicVariablesContent}

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

act as a seniour webapp developer in NextJs with Typescript and tailwindCss.

here is example of 

generate-add.tsx
```
/**
 * Defines the structure for the schema object, allowing for recursive nesting.
 */
interface Schema {
    [key: string]: string | Schema
}

/**
 * Defines the overall structure of the input JSON configuration.
 */
interface InputConfig {
    uid: string
    templateName: string
    schema: Schema
    namingConvention: {
        Users_1_000___: string
        users_2_000___: string
        User_3_000___: string
        user_4_000___: string
        use_generate_folder: boolean
    }
}

/**
 * Generates the content for a dynamic Add.tsx component file based on a JSON schema,
 * with conditional imports for required components.
 *
 * @param {string} inputJsonString The JSON string with schema and naming conventions.
 * @returns {string} The complete Add.tsx file content as a string.
 */
export const generateAddComponentFile = (inputJsonFile: string): string => {
    const { schema, namingConvention }: InputConfig =
        JSON.parse(inputJsonFile) || {}

    const pluralPascalCase = namingConvention.Users_1_000___ // e.g., "Posts"
    const singularPascalCase = namingConvention.User_3_000___ // e.g., "Post"
    const pluralLowerCase = namingConvention.users_2_000___ // e.g., "posts"
    const interfaceName = `I${pluralPascalCase}` // e.g., "IPosts"
    const defaultInstanceName = `default${pluralPascalCase}` // e.g., "defaultPosts"

    const requiredImports = new Set<string>()
    const componentBodyStatements = new Set<string>()

    const toCamelCase = (str: string) => {
        return str.replace(/-(\w)/g, (_, c) => c.toUpperCase())
    }

    /**
     * Generates a variable definition for an options array for selects, radios, etc.
     */
    const generateOptionsVariable = (
        key: string,
        optionsString: string | undefined,
        defaultOptions: { label: string; value: string }[]
    ): string => {
        const varName = `${toCamelCase(key)}Options`
        const optionsArray = optionsString
            ? optionsString.split(',').map((opt) => ({
                  label: opt.trim(),
                  value: opt.trim(),
              }))
            : defaultOptions

        const optionsJsArrayString = `[\n${optionsArray
            .map(
                (opt) =>
                    `        { label: '${opt.label}', value: '${opt.value}' }`
            )
            .join(',\n')}\n    ]`

        componentBodyStatements.add(
            `const ${varName} = ${optionsJsArrayString};`
        )
        return varName
    }

    /**
     * Generates the JSX for a single form field based on its type string.
     */
    const generateFormFieldJsx = (key: string, type: string): string => {
        const label = key
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())

        const [typeName, optionsString] = type.split('#')

        const formFieldWrapper = (
            label: string,
            componentJsx: string,
            alignTop: boolean = false
        ): string => `
                        <div className="grid grid-cols-4 ${
                            alignTop ? 'items-start' : 'items-center'
                        } gap-4 pr-1">
                            <Label htmlFor="${key}" className="text-right ${
            alignTop ? 'pt-3' : ''
        }">
                                ${label}
                            </Label>
                            <div className="col-span-3">
                                ${componentJsx}
                            </div>
                        </div>`

        let componentJsx: string
        let isTallComponent = false

        switch (typeName.toUpperCase()) {
            case 'STRING':
                requiredImports.add("import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'")
                componentJsx = `<InputFieldForString id="${key}" placeholder="${label}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'EMAIL':
                requiredImports.add("import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail'")
                componentJsx = `<InputFieldForEmail id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'PASSWORD':
                requiredImports.add("import InputFieldForPassword from '@/components/dashboard-ui/InputFieldForPassword'")
                componentJsx = `<InputFieldForPassword id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'PASSCODE':
                requiredImports.add("import InputFieldForPasscode from '@/components/dashboard-ui/InputFieldForPasscode'")
                componentJsx = `<InputFieldForPasscode id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'URL':
                requiredImports.add("import UrlInputField from '@/components/dashboard-ui/UrlInputField'")
                componentJsx = `<UrlInputField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'PHONE':
                requiredImports.add("import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'")
                componentJsx = `<PhoneInputField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'DESCRIPTION':
                isTallComponent = true
                requiredImports.add("import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'")
                componentJsx = `<TextareaFieldForDescription id="${key}" value={new${singularPascalCase}['${key}']} onChange={(e) => handleFieldChange('${key}', e.target.value)} />`
                break
            case 'RICHTEXT':
                isTallComponent = true
                requiredImports.add("import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField'")
                componentJsx = `<RichTextEditorField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'INTNUMBER':
                requiredImports.add("import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger'")
                componentJsx = `<NumberInputFieldInteger id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}',  value as number)} />`
                break
            case 'FLOATNUMBER':
                requiredImports.add("import NumberInputFieldFloat from '@/components/dashboard-ui/NumberInputFieldFloat'")
                componentJsx = `<NumberInputFieldFloat id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as number)} />`
                break
            case 'BOOLEAN':
                requiredImports.add("import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField'")
                componentJsx = `<BooleanInputField id="${key}" checked={new${singularPascalCase}['${key}']} onCheckedChange={(checked) => handleFieldChange('${key}', checked)} />`
                break
            case 'CHECKBOX':
                requiredImports.add("import { CheckboxField } from '@/components/dashboard-ui/CheckboxField'")
                componentJsx = `<CheckboxField id="${key}" checked={new${singularPascalCase}['${key}']} onCheckedChange={(checked) => handleFieldChange('${key}', checked)} />`
                break
            case 'DATE':
                requiredImports.add("import { DateField } from '@/components/dashboard-ui/DateField'")
                componentJsx = `<DateField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(date) => handleFieldChange('${key}', date)} />`
                break
            case 'TIME':
                requiredImports.add("import TimeField from '@/components/dashboard-ui/TimeField'")
                componentJsx = `<TimeField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(time) => handleFieldChange('${key}', time)} />`
                break
            case 'DATERANGE':
                requiredImports.add("import DateRangePickerField from '@/components/dashboard-ui/DateRangePickerField'")
                componentJsx = `<DateRangePickerField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(range) => handleFieldChange('${key}', range)} />`
                break
            case 'TIMERANGE':
                requiredImports.add("import TimeRangePickerField from '@/components/dashboard-ui/TimeRangePickerField'")
                componentJsx = `<TimeRangePickerField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(range) => handleFieldChange('${key}', range)} />`
                break
            case 'COLORPICKER':
                requiredImports.add("import ColorPickerField from '@/components/dashboard-ui/ColorPickerField'")
                componentJsx = `<ColorPickerField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'SELECT':
                requiredImports.add("import { SelectField } from '@/components/dashboard-ui/SelectField'")
                const selectVarName = generateOptionsVariable(key, optionsString, [{ label: 'Option 1', value: 'Option 1' }])
                componentJsx = `<SelectField options={${selectVarName}} value={new${singularPascalCase}['${key}']} onValueChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'RADIOBUTTON':
                requiredImports.add("import { RadioButtonGroupField } from '@/components/dashboard-ui/RadioButtonGroupField'")
                const radioVarName = generateOptionsVariable(key, optionsString, [{ label: 'Choice A', value: 'Choice A' }])
                componentJsx = `<RadioButtonGroupField options={${radioVarName}} value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'MULTIOPTIONS':
                requiredImports.add("import MultiOptionsField from '@/components/dashboard-ui/MultiOptionsField'")
                const multiOptionsVarName = generateOptionsVariable(key, optionsString, [{ label: 'Default A', value: 'Default A' }])
                componentJsx = `<MultiOptionsField options={${multiOptionsVarName}} value={new${singularPascalCase}['${key}']} onChange={(values) => handleFieldChange('${key}', values)} />`
                break
            case 'DYNAMICSELECT':
                requiredImports.add("import DynamicSelectField from '@/components/dashboard-ui/DynamicSelectField'")
                componentJsx = `<DynamicSelectField value={new${singularPascalCase}['${key}']} apiUrl='https://jsonplaceholder.typicode.com/users' onChange={(values) => handleFieldChange('${key}', values)} />`
                break
            case 'IMAGE':
                requiredImports.add("import ImageUploadFieldSingle from '@/components/dashboard-ui/ImageUploadFieldSingle'")
                componentJsx = `<ImageUploadFieldSingle value={new${singularPascalCase}['${key}']} onChange={(url) => handleFieldChange('${key}', url)} />`
                break
            case 'IMAGES':
                requiredImports.add("import ImageUploadManager from '@/components/dashboard-ui/ImageUploadManager'")
                componentJsx = `<ImageUploadManager value={new${singularPascalCase}['${key}']} onChange={(urls) => handleFieldChange('${key}', urls)} />`
                break
            case 'MULTICHECKBOX':
                isTallComponent = true
                requiredImports.add("import MultiCheckboxGroupField from '@/components/dashboard-ui/MultiCheckboxGroupField'")
                componentJsx = `<MultiCheckboxGroupField value={new${singularPascalCase}['${key}']} onChange={(values) => handleFieldChange('${key}', values)} />`
                break
            case 'STRINGARRAY':
                isTallComponent = true
                requiredImports.add("import StringArrayField from '@/components/dashboard-ui/StringArrayField'")
                const fields = optionsString ? optionsString.split(',').map(s => s.trim()) : []
                const fieldsProp = `[\${fields.map(f => \`'\${f}'\`).join(', ')}]\\`
                componentJsx = `<StringArrayField id="\${key}" fields={\${fieldsProp}} value={new\${singularPascalCase}['\${key}']} onChange={(value) => handleFieldChange('\${key}', value)} />\\`
                break
            case 'AUTOCOMPLETE':
                requiredImports.add("import AutocompleteField from '@/components/dashboard-ui/AutocompleteField'")
                componentJsx = `<AutocompleteField id="${key}" value={new${singularPascalCase}['${key}']} />`
                break
            default:
                componentJsx = `<Input id="${key}" value={String(new${singularPascalCase}['${key}'] || '')} disabled placeholder="Unsupported type: ${typeName}" />`
                break
        }

        return formFieldWrapper(label, componentJsx, isTallComponent)
    }

    const formFieldsJsx = Object.entries(schema)
        .map(([key, value]) => {
            // Handle nested objects first
            if (typeof value === 'object' && !Array.isArray(value)) {
                requiredImports.add("import JsonTextareaField from '@/components/dashboard-ui/JsonTextareaField'")
                const label = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                const componentJsx = `<JsonTextareaField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(jsonValue) => handleFieldChange('${key}', jsonValue)} />`
                return `
                        <div className="grid grid-cols-4 items-start gap-4 pr-1">
                            <Label htmlFor="${key}" className="text-right pt-3">
                                ${label}
                            </Label>
                            <div className="col-span-3">
                                ${componentJsx}
                            </div>
                        </div>`
            }
            // Handle string-defined types
            return generateFormFieldJsx(key, value as string)
        })
        .join('')

    const dynamicImports = [...requiredImports].sort().join('\n')
    const dynamicVariablesContent = componentBodyStatements.size > 0
            ? `    ${[...componentBodyStatements].sort().join('\n\n    ')}`
            : ''

    return `import { useState } from 'react'

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

import { use${pluralPascalCase}Store } from '../store/store'
import { useAdd${pluralPascalCase}Mutation } from '@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice.ts'
import { ${interfaceName}, ${defaultInstanceName} } from '@/app/generate/${pluralLowerCase}/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, set${pluralPascalCase} } = use${pluralPascalCase}Store()
    const [add${pluralPascalCase}, { isLoading }] = useAdd${pluralPascalCase}Mutation()
    const [new${singularPascalCase}, setNew${singularPascalCase}] = useState<${interfaceName}>(${defaultInstanceName})

    const handleFieldChange = (name: string, value: unknown) => {
        setNew${singularPascalCase}(prev => ({ ...prev, [name]: value }));
    };

    const handleAdd${singularPascalCase} = async () => {
        try {
            const { _id, ...updateData } = new${singularPascalCase}
            const added${singularPascalCase} = await add${pluralPascalCase}(updateData).unwrap()
            set${pluralPascalCase}([added${singularPascalCase}]); // Example: update store, you might need a different strategy
            toggleAddModal(false)
            setNew${singularPascalCase}(${defaultInstanceName})
            handleSuccess('Added Successfully')
        } catch (error: unknown) {
            console.error('Failed to add record:', error)
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
```


here is updated output Add.tsx 
```
import { useState } from 'react'

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
import AutocompleteField from '@/components/dashboard-ui/AutocompleteField'
import ColorPickerField from '@/components/dashboard-ui/ColorPickerField'
import DateRangePickerField from '@/components/dashboard-ui/DateRangePickerField'
import DynamicSelectField from '@/components/dashboard-ui/DynamicSelectField'
import ImageUploadFieldSingle from '@/components/dashboard-ui/ImageUploadFieldSingle'
import ImageUploadManager from '@/components/dashboard-ui/ImageUploadManager'
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail'
import InputFieldForPasscode from '@/components/dashboard-ui/InputFieldForPasscode'
import InputFieldForPassword from '@/components/dashboard-ui/InputFieldForPassword'
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString'
import JsonTextareaField from '@/components/dashboard-ui/JsonTextareaField'
import MultiCheckboxGroupField from '@/components/dashboard-ui/MultiCheckboxGroupField'
import MultiOptionsField from '@/components/dashboard-ui/MultiOptionsField'
import NumberInputFieldFloat from '@/components/dashboard-ui/NumberInputFieldFloat'
import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger'
import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField'
import StringArrayField from '@/components/dashboard-ui/StringArrayField'
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'
import TimeField from '@/components/dashboard-ui/TimeField'
import TimeRangePickerField from '@/components/dashboard-ui/TimeRangePickerField'
import UrlInputField from '@/components/dashboard-ui/UrlInputField'
import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField'
import { CheckboxField } from '@/components/dashboard-ui/CheckboxField'
import { DateField } from '@/components/dashboard-ui/DateField'
import { RadioButtonGroupField } from '@/components/dashboard-ui/RadioButtonGroupField'
import { SelectField } from '@/components/dashboard-ui/SelectField'

import { usePostsStore } from '../store/store'
import { useAddPostsMutation } from '@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice.ts'
import { IPosts, defaultPosts } from '@/app/generate/posts/all/store/data/data'
import {
    formatDuplicateKeyError,
    handleError,
    handleSuccess,
    isApiErrorResponse,
} from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setPosts } = usePostsStore()
    const [addPosts, { isLoading }] = useAddPostsMutation()
    const [newPost, setNewPost] = useState<IPosts>(defaultPosts)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewPost((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddPost = async () => {
        try {
            const { _id, ...updateData } = newPost
            const addedPost = await addPosts(updateData).unwrap()
            setPosts([addedPost]) // Example: update store, you might need a different strategy
            toggleAddModal(false)
            setNewPost(defaultPosts)
            handleSuccess('Added Successfully')
        } catch (error: unknown) {
            console.error('Failed to add record:', error)
            let errMessage: string = 'An unknown error occurred.'
            if (isApiErrorResponse(error)) {
                errMessage =
                    formatDuplicateKeyError(error.data.message) ||
                    'An API error occurred.'
            } else if (error instanceof Error) {
                errMessage = error.message
            }
            handleError(errMessage)
        }
    }

    const areaOptions = [
        { label: 'Bangladesh', value: 'Bangladesh' },
        { label: 'India', value: 'India' },
        { label: 'Pakistan', value: 'Pakistan' },
        { label: 'Canada', value: 'Canada' },
    ]

    const ideasOptions = [
        { label: 'O 1', value: 'O 1' },
        { label: 'O 2', value: 'O 2' },
        { label: 'O 3', value: 'O 3' },
        { label: 'O 4', value: 'O 4' },
    ]

    const shiftOptions = [
        { label: 'OP 1', value: 'OP 1' },
        { label: 'OP 2', value: 'OP 2' },
        { label: 'OP 3', value: 'OP 3' },
        { label: 'OP 4', value: 'OP 4' },
    ]

    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Post</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right ">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString
                                    id="title"
                                    placeholder="Title"
                                    value={newPost['title']}
                                    onChange={(value) =>
                                        handleFieldChange(
                                            'title',
                                            value as string
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="email" className="text-right ">
                                Email
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail
                                    id="email"
                                    value={newPost['email']}
                                    onChange={(value) =>
                                        handleFieldChange(
                                            'email',
                                            value as string
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="password" className="text-right ">
                                Password
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForPassword
                                    id="password"
                                    value={newPost['password']}
                                    onChange={(value) =>
                                        handleFieldChange(
                                            'password',
                                            value as string
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="passcode" className="text-right ">
                                Passcode
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForPasscode
                                    id="passcode"
                                    value={newPost['passcode']}
                                    onChange={(value) =>
                                        handleFieldChange(
                                            'passcode',
                                            value as string
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="area" className="text-right ">
                                Area
                            </Label>
                            <div className="col-span-3">
                                <SelectField
                                    options={areaOptions}
                                    value={newPost['area']}
                                    onValueChange={(value) =>
                                        handleFieldChange('area', value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="sub-area" className="text-right ">
                                Sub Area
                            </Label>
                            <div className="col-span-3">
                                <DynamicSelectField
                                    value={newPost['sub-area']}
                                    apiUrl="https://jsonplaceholder.typicode.com/users"
                                    onChange={(values) =>
                                        handleFieldChange('sub-area', values)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label
                                htmlFor="products-images"
                                className="text-right "
                            >
                                Products Images
                            </Label>
                            <div className="col-span-3">
                                <ImageUploadManager
                                    value={newPost['products-images']}
                                    onChange={(urls) =>
                                        handleFieldChange(
                                            'products-images',
                                            urls
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label
                                htmlFor="personal-image"
                                className="text-right "
                            >
                                Personal Image
                            </Label>
                            <div className="col-span-3">
                                <ImageUploadFieldSingle
                                    value={newPost['personal-image']}
                                    onChange={(url) =>
                                        handleFieldChange('personal-image', url)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4 pr-1">
                            <Label
                                htmlFor="description"
                                className="text-right pt-3"
                            >
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription
                                    id="description"
                                    value={newPost['description']}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'description',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="age" className="text-right ">
                                Age
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger
                                    id="age"
                                    value={newPost['age']}
                                    onChange={(value) =>
                                        handleFieldChange(
                                            'age',
                                            value as number
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="amount" className="text-right ">
                                Amount
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldFloat
                                    id="amount"
                                    value={newPost['amount']}
                                    onChange={(value) =>
                                        handleFieldChange(
                                            'amount',
                                            value as number
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="isActive" className="text-right ">
                                IsActive
                            </Label>
                            <div className="col-span-3">
                                <BooleanInputField
                                    id="isActive"
                                    checked={newPost['isActive']}
                                    onCheckedChange={(checked) =>
                                        handleFieldChange('isActive', checked)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start-date" className="text-right ">
                                Start Date
                            </Label>
                            <div className="col-span-3">
                                <DateField
                                    id="start-date"
                                    value={newPost['start-date']}
                                    onChange={(date) =>
                                        handleFieldChange('start-date', date)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start-time" className="text-right ">
                                Start Time
                            </Label>
                            <div className="col-span-3">
                                <TimeField
                                    id="start-time"
                                    value={newPost['start-time']}
                                    onChange={(time) =>
                                        handleFieldChange('start-time', time)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label
                                htmlFor="schedule-date"
                                className="text-right "
                            >
                                Schedule Date
                            </Label>
                            <div className="col-span-3">
                                <DateRangePickerField
                                    id="schedule-date"
                                    value={newPost['schedule-date']}
                                    onChange={(range) =>
                                        handleFieldChange(
                                            'schedule-date',
                                            range
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label
                                htmlFor="schedule-time"
                                className="text-right "
                            >
                                Schedule Time
                            </Label>
                            <div className="col-span-3">
                                <TimeRangePickerField
                                    id="schedule-time"
                                    value={newPost['schedule-time']}
                                    onChange={(range) =>
                                        handleFieldChange(
                                            'schedule-time',
                                            range
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label
                                htmlFor="favorite-color"
                                className="text-right "
                            >
                                Favorite Color
                            </Label>
                            <div className="col-span-3">
                                <ColorPickerField
                                    id="favorite-color"
                                    value={newPost['favorite-color']}
                                    onChange={(value) =>
                                        handleFieldChange(
                                            'favorite-color',
                                            value as string
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="number" className="text-right ">
                                Number
                            </Label>
                            <div className="col-span-3">
                                <PhoneInputField
                                    id="number"
                                    value={newPost['number']}
                                    onChange={(value) =>
                                        handleFieldChange('number', value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="profile" className="text-right ">
                                Profile
                            </Label>
                            <div className="col-span-3">
                                <UrlInputField
                                    id="profile"
                                    value={newPost['profile']}
                                    onChange={(value) =>
                                        handleFieldChange(
                                            'profile',
                                            value as string
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4 pr-1">
                            <Label htmlFor="test" className="text-right pt-3">
                                Test
                            </Label>
                            <div className="col-span-3">
                                <RichTextEditorField
                                    id="test"
                                    value={newPost['test']}
                                    onChange={(value) =>
                                        handleFieldChange('test', value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="info" className="text-right ">
                                Info
                            </Label>
                            <div className="col-span-3">
                                <AutocompleteField
                                    id="info"
                                    value={newPost['info']}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="shift" className="text-right ">
                                Shift
                            </Label>
                            <div className="col-span-3">
                                <RadioButtonGroupField
                                    options={shiftOptions}
                                    value={newPost['shift']}
                                    onChange={(value) =>
                                        handleFieldChange('shift', value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="policy" className="text-right ">
                                Policy
                            </Label>
                            <div className="col-span-3">
                                <CheckboxField
                                    id="policy"
                                    checked={newPost['policy']}
                                    onCheckedChange={(checked) =>
                                        handleFieldChange('policy', checked)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4 pr-1">
                            <Label
                                htmlFor="hobbies"
                                className="text-right pt-3"
                            >
                                Hobbies
                            </Label>
                            <div className="col-span-3">
                                <MultiCheckboxGroupField
                                    value={newPost['hobbies']}
                                    onChange={(values) =>
                                        handleFieldChange('hobbies', values)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="ideas" className="text-right ">
                                Ideas
                            </Label>
                            <div className="col-span-3">
                                <MultiOptionsField
                                    options={ideasOptions}
                                    value={newPost['ideas']}
                                    onChange={(values) =>
                                        handleFieldChange('ideas', values)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4 pr-1">
                            <Label
                                htmlFor="students"
                                className="text-right pt-3"
                            >
                                Students
                            </Label>
                            <div className="col-span-3">
                                <StringArrayField />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4 pr-1">
                            <Label
                                htmlFor="complexValue"
                                className="text-right pt-3"
                            >
                                ComplexValue
                            </Label>
                            <div className="col-span-3">
                                <JsonTextareaField
                                    id="complexValue"
                                    value={newPost['complexValue']}
                                    onChange={(jsonValue) =>
                                        handleFieldChange(
                                            'complexValue',
                                            jsonValue
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => toggleAddModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button disabled={isLoading} onClick={handleAddPost}>
                        {isLoading ? 'Adding...' : 'Add Post'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
```


Now could you please update generate-add.tsx so it can produce the latest Add.tsx


act as a seniour webapp developer in NextJs with Typescript.

here is an example of code. I want to modify this code. so that it will not generate unused varibale.

generate-add.ts
```
/**
 * Generates the content for a dynamic Add.tsx component file based on a JSON schema,
 * with conditional imports for required components.
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

    // A Set to store the import statements for components that are actually used.
    const requiredImports = new Set<string>()
    // A Set to store dynamic variable definitions (like options arrays) needed in the component body.
    const componentBodyStatements = new Set<string>()

    /**
     * Helper to convert a hyphenated key (e.g., "sub-area") into camelCase (e.g., "subArea")
     * for safe use as a JavaScript variable name.
     */
    const toCamelCase = (str: string) => {
        return str.replace(/-(\w)/g, (_, c) => c.toUpperCase())
    }

    /**
     * Generates the JSX for a specific form field based on its schema type
     * and adds the required component import to the set.
     */
    const generateFormFieldJsx = (key: string, type: string): string => {
        const label = key
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())

        // Split the type string to separate the base type from unknown options (e.g., "SELECT#Opt1,Opt2")
        const [typeName, optionsString] = type.split('#')

        // Generic wrapper for consistent layout
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
                componentJsx = `<InputFieldForString id="${key}" placeholder="${label}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'EMAIL':
                requiredImports.add(
                    "import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail'"
                )
                componentJsx = `<InputFieldForEmail id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'PASSWORD':
                requiredImports.add(
                    "import InputFieldForPassword from '@/components/dashboard-ui/InputFieldForPassword'"
                )
                componentJsx = `<InputFieldForPassword id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'PASSCODE':
                requiredImports.add(
                    "import InputFieldForPasscode from '@/components/dashboard-ui/InputFieldForPasscode'"
                )
                componentJsx = `<InputFieldForPasscode id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'URL':
                requiredImports.add(
                    "import UrlInputField from '@/components/dashboard-ui/UrlInputField'"
                )
                componentJsx = `<UrlInputField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'PHONE':
                requiredImports.add(
                    "import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'"
                )
                componentJsx = `<PhoneInputField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'DESCRIPTION':
                requiredImports.add(
                    "import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription'"
                )
                componentJsx = `<TextareaFieldForDescription id="${key}" value={new${singularPascalCase}['${key}']} onChange={(e) => handleFieldChange('${key}', e.target.value)} />`
                break
            case 'RICHTEXT':
                requiredImports.add(
                    "import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField'"
                )
                componentJsx = `<RichTextEditorField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'INTNUMBER':
                requiredImports.add(
                    "import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger'"
                )
                componentJsx = `<NumberInputFieldInteger id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}',  value as number)} />`
                break
            case 'FLOATNUMBER':
                requiredImports.add(
                    "import NumberInputFieldFloat from '@/components/dashboard-ui/NumberInputFieldFloat'"
                )
                componentJsx = `<NumberInputFieldFloat id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as number)} />`
                break
            case 'BOOLEAN':
                requiredImports.add(
                    "import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField'"
                )
                componentJsx = `<BooleanInputField id="${key}" checked={new${singularPascalCase}['${key}']} onCheckedChange={(checked) => handleFieldChange('${key}', checked)} />`
                break
            case 'CHECKBOX':
                requiredImports.add(
                    "import { CheckboxField } from '@/components/dashboard-ui/CheckboxField'"
                )
                componentJsx = `<CheckboxField id="${key}" checked={new${singularPascalCase}['${key}']} onCheckedChange={(checked) => handleFieldChange('${key}', checked)} />`
                break
            case 'DATE':
                requiredImports.add(
                    "import { DateField } from '@/components/dashboard-ui/DateField'"
                )
                componentJsx = `<DateField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(date) => handleFieldChange('${key}', date)} />`
                break
            case 'TIME':
                requiredImports.add(
                    "import TimeField from '@/components/dashboard-ui/TimeField'"
                )
                componentJsx = `<TimeField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(time) => handleFieldChange('${key}', time)} />`
                break
            case 'DATERANGE':
                requiredImports.add(
                    "import DateRangePickerField from '@/components/dashboard-ui/DateRangePickerField'"
                )
                componentJsx = `<DateRangePickerField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(range) => handleFieldChange('${key}', range)} />`
                break
            case 'TIMERANGE':
                requiredImports.add(
                    "import TimeRangePickerField from '@/components/dashboard-ui/TimeRangePickerField'"
                )
                componentJsx = `<TimeRangePickerField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(range) => handleFieldChange('${key}', range)} />`
                break
            case 'COLORPICKER':
                requiredImports.add(
                    "import ColorPickerField from '@/components/dashboard-ui/ColorPickerField'"
                )
                componentJsx = `<ColorPickerField id="${key}" value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value as string)} />`
                break
            case 'SELECT':
                requiredImports.add(
                    "import { SelectField } from '@/components/dashboard-ui/SelectField'"
                )
                const selectVarName = `${toCamelCase(key)}Options`
                let selectOptionsJsArrayString

                if (optionsString) {
                    const optionsArray = optionsString
                        .split(',')
                        .map((opt) => opt.trim())
                    selectOptionsJsArrayString = `[
        ${optionsArray.map((opt) => `        { label: '${opt}', value: '${opt}' }`).join(',\n')}
    ]`
                } else {
                    selectOptionsJsArrayString = `[
        { label: 'Option 1', value: 'Option 1' },
        { label: 'Option 2', value: 'Option 2' }
    ]`
                }
                componentBodyStatements.add(
                    `const ${selectVarName} = ${selectOptionsJsArrayString};`
                )
                componentJsx = `<SelectField options={${selectVarName}} value={new${singularPascalCase}['${key}']} onValueChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'RADIOBUTTON':
                requiredImports.add(
                    "import { RadioButtonGroupField } from '@/components/dashboard-ui/RadioButtonGroupField'"
                )
                const radioVarName = `${toCamelCase(key)}Options`
                let radioOptionsJsArrayString

                if (optionsString) {
                    const optionsArray = optionsString
                        .split(',')
                        .map((opt) => opt.trim())
                    radioOptionsJsArrayString = `[
        ${optionsArray.map((opt) => `        { label: '${opt}', value: '${opt}' }`).join(',\n')}
    ]`
                } else {
                    radioOptionsJsArrayString = `[
        { label: 'Choice A', value: 'Choice A' },
        { label: 'Choice B', value: 'Choice B' }
    ]`
                }
                componentBodyStatements.add(
                    `const ${radioVarName} = ${radioOptionsJsArrayString};`
                )
                componentJsx = `<RadioButtonGroupField options={${radioVarName}} value={new${singularPascalCase}['${key}']} onChange={(value) => handleFieldChange('${key}', value)} />`
                break
            case 'DYNAMICSELECT':
                requiredImports.add(
                    "import DynamicSelectField from '@/components/dashboard-ui/DynamicSelectField'"
                )
                componentJsx = `<DynamicSelectField value={new${singularPascalCase}['${key}']}   apiUrl='https://jsonplaceholder.typicode.com/users' onChange={(values) => handleFieldChange('${key}', values)} />`
                break
            case 'IMAGE':
                requiredImports.add(
                    "import ImageUploadFieldSingle from '@/components/dashboard-ui/ImageUploadFieldSingle'"
                )
                componentJsx = `<ImageUploadFieldSingle value={new${singularPascalCase}['${key}']} onChange={(url) => handleFieldChange('${key}', url)} />`
                break
            case 'IMAGES':
                requiredImports.add(
                    "import ImageUploadManager from '@/components/dashboard-ui/ImageUploadManager'"
                )
                componentJsx = `<ImageUploadManager value={new${singularPascalCase}['${key}']} onChange={(urls) => handleFieldChange('${key}', urls)} />`
                break
            case 'MULTICHECKBOX':
                requiredImports.add(
                    "import MultiCheckboxGroupField from '@/components/dashboard-ui/MultiCheckboxGroupField'"
                )
                componentJsx = `<MultiCheckboxGroupField value={new${singularPascalCase}['${key}']} onChange={(values) => handleFieldChange('${key}', values)} />`
                break
            case 'MULTIOPTIONS':
                requiredImports.add(
                    "import MultiOptionsField from '@/components/dashboard-ui/MultiOptionsField'"
                )
                const multiOptionsVarName = `${toCamelCase(key)}Options`
                let multiOptionsJsArrayString

                if (optionsString) {
                    const optionsArray = optionsString
                        .split(',')
                        .map((opt) => opt.trim())
                    multiOptionsJsArrayString = `[
        ${optionsArray.map((opt) => `        { label: '${opt}', value: '${opt}' }`).join(',\n')}
    ]`
                } else {
                    multiOptionsJsArrayString = `[
        { label: 'Default Option A', value: 'Default Option A' },
        { label: 'Default Option B', value: 'Default Option B' }
    ]`
                }
                componentBodyStatements.add(
                    `const ${multiOptionsVarName} = ${multiOptionsJsArrayString};`
                )
                componentJsx = `<MultiOptionsField options={${multiOptionsVarName}} value={new${singularPascalCase}['${key}']} onChange={(values) => handleFieldChange('${key}', values)} />`
                break
            case 'AUTOCOMPLETE':
                requiredImports.add(
                    "import AutocompleteField from '@/components/dashboard-ui/AutocompleteField'"
                )
                componentJsx = `<AutocompleteField id="${key}" value={new${singularPascalCase}['${key}']} />`
                break
            default:
                componentJsx = `
                        <Input
                            id="${key}"
                            name="${key}"
                            value={new${singularPascalCase}['${key}']}
                            onChange={(e) => handleFieldChange('${key}', e.target.value)}
                            placeholder="Unsupported field type: ${type}"
                            className="col-span-3"
                            disabled
                        />`
                return `
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="${key}" className="text-right">
                                ${label}
                            </Label>
                            ${componentJsx}
                        </div>`
        }

        return formFieldWrapper(label, componentJsx)
    }

    const formFieldsJsx = Object.entries(schema)
        .map(([key, value]) => generateFormFieldJsx(key, value as string))
        .join('')

    const dynamicImports = [...requiredImports].sort().join('\n')
    const dynamicVariables = [...componentBodyStatements]
        .sort()
        .join('\n\n    ')

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
import { useAdd${pluralPascalCase}Mutation } from '../redux/rtk-api'
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
            console.log('Adding new record:', updateData)
            const added${singularPascalCase} = await add${pluralPascalCase}(updateData).unwrap()
            set${pluralPascalCase}([added${singularPascalCase}])
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

    ${dynamicVariables}

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


here is output Add.tsx
```import { useState } from 'react'

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
import MultiCheckboxGroupField from '@/components/dashboard-ui/MultiCheckboxGroupField'
import MultiOptionsField from '@/components/dashboard-ui/MultiOptionsField'
import NumberInputFieldFloat from '@/components/dashboard-ui/NumberInputFieldFloat'
import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger'
import PhoneInputField from '@/components/dashboard-ui/PhoneInputField'
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField'
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
import { useAddPostsMutation } from '../redux/rtk-api'
import { IPosts, defaultPosts } from '@/app/generate/posts/all/store/data/data'
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils'

const AddNextComponents: React.FC = () => {
    const { toggleAddModal, isAddModalOpen, setPosts } = usePostsStore()
    const [addPosts, { isLoading }] = useAddPostsMutation()
    const [newPost, setNewPost] = useState<IPosts>(defaultPosts)

    const handleFieldChange = (name: string, value: unknown) => {
        setNewPost(prev => ({ ...prev, [name]: value }));
    };

    const handleAddPost = async () => {
        try {
            const { _id, ...updateData } = newPost
            console.log('Adding new record:', updateData)
            const addedPost = await addPosts(updateData).unwrap()
            setPosts([addedPost])
            toggleAddModal(false)
            setNewPost(defaultPosts)
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

    const areaOptions = [
                { label: 'Bangladesh', value: 'Bangladesh' },
        { label: 'India', value: 'India' },
        { label: 'Pakistan', value: 'Pakistan' },
        { label: 'Canada', value: 'Canada' }
    ];

    const ideasOptions = [
                { label: 'O 1', value: 'O 1' },
        { label: 'O 2', value: 'O 2' },
        { label: 'O 3', value: 'O 3' },
        { label: 'O 4', value: 'O 4' }
    ];

    const shiftOptions = [
                { label: 'OP 1', value: 'OP 1' },
        { label: 'OP 2', value: 'OP 2' },
        { label: 'OP 3', value: 'OP 3' },
        { label: 'OP 4', value: 'OP 4' }
    ];

    return (
        <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Post</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <div className="grid gap-4 py-4">
                        
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForString id="title" placeholder="Title" value={newPost['title']} onChange={(value) => handleFieldChange('title', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForEmail id="email" value={newPost['email']} onChange={(value) => handleFieldChange('email', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForPassword id="password" value={newPost['password']} onChange={(value) => handleFieldChange('password', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="passcode" className="text-right">
                                Passcode
                            </Label>
                            <div className="col-span-3">
                                <InputFieldForPasscode id="passcode" value={newPost['passcode']} onChange={(value) => handleFieldChange('passcode', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="area" className="text-right">
                                Area
                            </Label>
                            <div className="col-span-3">
                                <SelectField options={areaOptions} value={newPost['area']} onValueChange={(value) => handleFieldChange('area', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="sub-area" className="text-right">
                                Sub Area
                            </Label>
                            <div className="col-span-3">
                                <DynamicSelectField value={newPost['sub-area']}   apiUrl='https://jsonplaceholder.typicode.com/users' onChange={(values) => handleFieldChange('sub-area', values)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="products-images" className="text-right">
                                Products Images
                            </Label>
                            <div className="col-span-3">
                                <ImageUploadManager value={newPost['products-images']} onChange={(urls) => handleFieldChange('products-images', urls)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="personal-image" className="text-right">
                                Personal Image
                            </Label>
                            <div className="col-span-3">
                                <ImageUploadFieldSingle value={newPost['personal-image']} onChange={(url) => handleFieldChange('personal-image', url)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <TextareaFieldForDescription id="description" value={newPost['description']} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="age" className="text-right">
                                Age
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldInteger id="age" value={newPost['age']} onChange={(value) => handleFieldChange('age',  value as number)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <div className="col-span-3">
                                <NumberInputFieldFloat id="amount" value={newPost['amount']} onChange={(value) => handleFieldChange('amount', value as number)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="isActive" className="text-right">
                                IsActive
                            </Label>
                            <div className="col-span-3">
                                <BooleanInputField id="isActive" checked={newPost['isActive']} onCheckedChange={(checked) => handleFieldChange('isActive', checked)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start-date" className="text-right">
                                Start Date
                            </Label>
                            <div className="col-span-3">
                                <DateField id="start-date" value={newPost['start-date']} onChange={(date) => handleFieldChange('start-date', date)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="start-time" className="text-right">
                                Start Time
                            </Label>
                            <div className="col-span-3">
                                <TimeField id="start-time" value={newPost['start-time']} onChange={(time) => handleFieldChange('start-time', time)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="schedule-date" className="text-right">
                                Schedule Date
                            </Label>
                            <div className="col-span-3">
                                <DateRangePickerField id="schedule-date" value={newPost['schedule-date']} onChange={(range) => handleFieldChange('schedule-date', range)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="schedule-time" className="text-right">
                                Schedule Time
                            </Label>
                            <div className="col-span-3">
                                <TimeRangePickerField id="schedule-time" value={newPost['schedule-time']} onChange={(range) => handleFieldChange('schedule-time', range)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="favorite-color" className="text-right">
                                Favorite Color
                            </Label>
                            <div className="col-span-3">
                                <ColorPickerField id="favorite-color" value={newPost['favorite-color']} onChange={(value) => handleFieldChange('favorite-color', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="number" className="text-right">
                                Number
                            </Label>
                            <div className="col-span-3">
                                <PhoneInputField id="number" value={newPost['number']} onChange={(value) => handleFieldChange('number', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="profile" className="text-right">
                                Profile
                            </Label>
                            <div className="col-span-3">
                                <UrlInputField id="profile" value={newPost['profile']} onChange={(value) => handleFieldChange('profile', value as string)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="test" className="text-right">
                                Test
                            </Label>
                            <div className="col-span-3">
                                <RichTextEditorField id="test" value={newPost['test']} onChange={(value) => handleFieldChange('test', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="info" className="text-right">
                                Info
                            </Label>
                            <div className="col-span-3">
                                <AutocompleteField id="info" value={newPost['info']} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="shift" className="text-right">
                                Shift
                            </Label>
                            <div className="col-span-3">
                                <RadioButtonGroupField options={shiftOptions} value={newPost['shift']} onChange={(value) => handleFieldChange('shift', value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="policy" className="text-right">
                                Policy
                            </Label>
                            <div className="col-span-3">
                                <CheckboxField id="policy" checked={newPost['policy']} onCheckedChange={(checked) => handleFieldChange('policy', checked)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="hobbies" className="text-right">
                                Hobbies
                            </Label>
                            <div className="col-span-3">
                                <MultiCheckboxGroupField value={newPost['hobbies']} onChange={(values) => handleFieldChange('hobbies', values)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-1">
                            <Label htmlFor="ideas" className="text-right">
                                Ideas
                            </Label>
                            <div className="col-span-3">
                                <MultiOptionsField options={ideasOptions} value={newPost['ideas']} onChange={(values) => handleFieldChange('ideas', values)} />
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
                    <Button
                        disabled={isLoading}
                        onClick={handleAddPost}
                    >
                        {isLoading ? 'Adding...' : 'Add Post'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNextComponents
```

here is inputJsonFile example
```{
  "uid": "000",
  "templateName": "Basic Template",
  "schema": {
    "title": "STRING",
    "email": "EMAIL", 
    "password": "PASSWORD",
    "passcode": "PASSCODE",
    "area": "SELECT#Bangladesh,India,Pakistan,Canada",
    "sub-area": "DYNAMICSELECT",
    "products-images": "IMAGES",
    "personal-image": "IMAGE",
    "description": "DESCRIPTION",
    "age": "INTNUMBER",
    "amount": "FLOATNUMBER",
    "isActive": "BOOLEAN",
    "start-date": "DATE",
    "start-time": "TIME",
    "schedule-date": "DATERANGE",
    "schedule-time": "TIMERANGE",
    "favorite-color": "COLORPICKER",
    "number": "PHONE",
    "profile": "URL",
    "test": "RICHTEXT",
    "info": "AUTOCOMPLETE",
    "shift": "RADIOBUTTON#OP 1, OP 2, OP 3, OP 4",
    "policy": "CHECKBOX",
    "hobbys": "MULTICHECKBOX",
    "ideas": "MULTIOPTIONS#O 1, O 2, O 3, O 4"
  },
  "namingConvention": {
    "Users_1_000___": "Posts",
    "users_2_000___": "posts",
    "User_3_000___": "Post",
    "user_4_000___": "post",
    "ISelect_6_000___": "ISelect",
    "select_5_000___": "select"
  }
}
```

but some time it looks like 
```
{
  "uid": "000",
  "templateName": "Basic Template",
  "schema": {
    "title": "STRING",
  },
  "namingConvention": {
    "Users_1_000___": "Posts",
    "users_2_000___": "posts",
    "User_3_000___": "Post",
    "user_4_000___": "post",
    "ISelect_6_000___": "ISelect",
    "select_5_000___": "select"
  }
}
```

and it will generate un-used varibale. 

Now could you please update generate-add.ts so it will not generate un used variable. 
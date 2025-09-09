// ViewDataType.tsx

'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'react-toastify'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Import all UI components
import InputFieldForString from './ui-components/InputFieldForString'
import InputFieldForEmail from './ui-components/InputFieldForEmail'
import InputFieldForPassword from './ui-components/InputFieldForPassword'
import InputFieldForPasscode from './ui-components/InputFieldForPasscode'
import { SelectField } from './ui-components/SelectField'
import DynamicSelectField from './ui-components/DynamicSelectField'
import ImageUploadFieldMultiple from './ui-components/images/ImageUploadFieldMultiple'
import ImageUploadFieldSingle from './ui-components/images/ImageUploadFieldSingle'
import TextareaFieldForDescriptionEditor from './ui-components/rich-text-editor/TextareaFieldForDescription'
import NumberInputFieldInteger from './ui-components/NumberInputFieldInteger'
import NumberInputFieldFloat from './ui-components/NumberInputFieldFloat'
import { CheckboxField } from './ui-components/CheckboxField'
import { BooleanInputField } from './ui-components/BooleanInputField'
import { DateField } from './ui-components/DateField'

interface DataTypeItem {
    name: string
    mongooseSchema: string
    ui: string
}

const allDataType: DataTypeItem[] = [
    {
        name: 'STRING',
        mongooseSchema: `STRING: {
      type: String,
      trim: true
    }`,
        ui: '<InputFieldForString />',
    },
    {
        name: 'EMAIL',
        mongooseSchema: `EMAIL: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }`,
        ui: '<InputFieldForEmail />',
    },
    {
        name: 'PASSWORD',
        mongooseSchema: `PASSWORD: {
      type: String,
      select: false
    }`,
        ui: '<InputFieldForPassword />',
    },
    {
        name: 'PASSCODE',
        mongooseSchema: `PASSCODE: {
      type: String,
      select: false
    }`,
        ui: '<InputFieldForPasscode />',
    },
    {
        name: 'SELECT',
        mongooseSchema: `SELECT: {
      type: String,
      enum: ['Option 1', 'Option 2', 'Option 3']
    }`,
        ui: '<SelectField />',
    },
    {
        name: 'DYNAMICSELECT',
        mongooseSchema: `DYNAMICSELECT: {
      type: Schema.Types.ObjectId,
      ref: 'AnotherModel'
    }`,
        ui: '<DynamicSelectField />',
    },
    {
        name: 'IMAGES',
        mongooseSchema: `IMAGES: [{
      type: String
    }]`,
        ui: '<ImageUploadFieldMultiple />',
    },
    {
        name: 'IMAGE ', // Note: Trailing space here. If intentional, keep. Otherwise, consider removing.
        mongooseSchema: `IMAGE: {
      type: String
    }`,
        ui: '<ImageUploadFieldSingle />',
    },
    {
        name: 'DESCRIPTION',
        mongooseSchema: `DESCRIPTION: {
      type: String,
      trim: true
    }`,
        ui: '<TextareaFieldForDescription />',
    },
    {
        name: 'INTNUMBER',
        mongooseSchema: `INTNUMBER: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }
    }`,
        ui: '<NumberInputFieldInteger />',
    },
    {
        name: 'FLOATNUMBER',
        mongooseSchema: `FLOATNUMBER: {
      type: Number
    }`,
        ui: '<NumberInputFieldFloat />',
    },
    {
        name: 'BOOLEAN',
        mongooseSchema: `BOOLEAN: {
      type: Boolean,
      default: false
    }`,
        ui: '<BooleanInputField />',
    },
    {
        name: 'DATE ', // Note: Trailing space here. If intentional, keep. Otherwise, consider removing.
        mongooseSchema: `DATE: {
      type: Date,
      default: Date.now
    }`,
        ui: '<DateField />',
    },
    {
        name: 'TIME',
        mongooseSchema: `TIME: {
      type: String
    }`,
        ui: '<TimeField />',
    },
    {
        name: 'DATERANGE',
        mongooseSchema: `DATERANGE: {
      start: { type: Date },
      end: { type: Date }
    }`,
        ui: '<DateRangePickerField />',
    },
    {
        name: 'TIMERANGE',
        mongooseSchema: `TIMERANGE: {
      start: { type: String },
      end: { type: String }
    }`,
        ui: '<TimeRangePickerField />',
    },
    {
        name: 'COLORPICKER', // Corrected typo from COLOEPICKER
        mongooseSchema: `COLORPICKER: {
      type: String,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please fill a valid color hex code']
    }`,
        ui: '<ColorPickerField />',
    },
    {
        name: 'PHONE',
        mongooseSchema: `PHONE: {
      type: String,
      validate: {
        validator: function(v) {
          return /\\d{3}-\\d{3}-\\d{4}/.test(v);
        },
        message: props => \`\${props.value} is not a valid phone number!\`
      }
    }`,
        ui: '<PhoneInputField />',
    },
    {
        name: 'URL',
        mongooseSchema: `URL: {
      type: String,
      trim: true
    }`,
        ui: '<UrlInputField />',
    },
    {
        name: 'RICHTEXT',
        mongooseSchema: `RICHTEXT: {
      type: String
    }`,
        ui: '<RichTextEditorField />',
    },
    {
        name: 'AUTOCOMPLETE',
        mongooseSchema: `AUTOCOMPLETE: {
      type: String
    }`,
        ui: '<AutocompleteField />',
    },
    {
        name: 'RADIOBUTTON',
        mongooseSchema: `RADIOBUTTON: {
      type: String,
      enum: ['Choice A', 'Choice B', 'Choice C']
    }`,
        ui: '<RadioButtonGroupField />',
    },
    {
        name: 'CHECKBOX', // This typically implies a single checkbox (boolean)
        mongooseSchema: `CHECKBOX: {
      type: Boolean,
      default: false
    }`,
        ui: '<CheckboxField />',
    },
    {
        name: 'MULTICHECKBOX', // This implies multiple selections (array of strings)
        mongooseSchema: `MULTICHECKBOX: [{
      type: String
    }]`,
        ui: '<MultiCheckboxGroupField />',
    },
]

const ViewDataType = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [showPreviewDialog, setShowPreviewDialog] = useState(false)
    const [currentPreviewItem, setCurrentPreviewItem] =
        useState<DataTypeItem | null>(null)

    const copyToClipboard = (data: string, type: 'schema' | 'ui' | 'name') => {
        navigator.clipboard
            .writeText(data)
            .then(() => {
                if (type === 'name') {
                    toast.success(`Copied "${data}" to clipboard!`)
                } else {
                    toast.success(
                        `Copied ${type === 'schema' ? 'Mongoose Schema' : 'UI Component name'} to clipboard!`
                    )
                }
            })
            .catch((err) => {
                console.error('Failed to copy: ', err)
                toast.error('Failed to copy to clipboard.')
            })
    }

    const getComponentForPreview = (item: DataTypeItem): React.ReactNode => {
        switch (item.ui) {
            case '<InputFieldForString />':
                return <InputFieldForString />
            case '<InputFieldForEmail />':
                return <InputFieldForEmail />
            case '<InputFieldForPassword />':
                return <InputFieldForPassword />
            case '<InputFieldForPasscode />':
                return <InputFieldForPasscode />
            case '<SelectField />':
                return <SelectField />
            case '<DynamicSelectField />':
                return <DynamicSelectField />
            case '<ImageUploadFieldMultiple />':
                return <ImageUploadFieldMultiple />
            case '<ImageUploadFieldSingle />':
                return <ImageUploadFieldSingle />
            case '<TextareaFieldForDescription />':
                return <TextareaFieldForDescriptionEditor />
            case '<NumberInputFieldInteger />':
                return <NumberInputFieldInteger />
            case '<NumberInputFieldFloat />':
                return <NumberInputFieldFloat />
            case '<CheckboxField />':
                return <CheckboxField />
            case '<BooleanInputField />':
                return <BooleanInputField />
            case '<DateField />':
                return <DateField />
            // case '<TimeField />':
            //     return <TimeField />
            // case '<DateRangePickerField />':
            //     return <DateRangePickerField />
            // case '<TimeRangePickerField />':
            //     return <TimeRangePickerField />
            // case '<ColorPickerField />':
            //     return <ColorPickerField />
            // case '<PhoneInputField />':
            //     return <PhoneInputField />
            // case '<UrlInputField />':
            //     return <UrlInputField />
            // case '<RichTextEditorField />':
            //     return <RichTextEditorField />
            // case '<AutocompleteField />':
            //     return <AutocompleteField />
            // case '<RadioButtonGroupField />':
            //     return <RadioButtonGroupField />
            // case '<SingleCheckboxField />':
            //     return <SingleCheckboxField />
            // case '<MultiCheckboxGroupField />':
            //     return <MultiCheckboxGroupField />
            default:
                return (
                    <p className="text-muted-foreground">
                        No preview available for {item.name}
                    </p>
                )
        }
    }

    const handleViewDetails = (item: DataTypeItem) => {
        setCurrentPreviewItem(item)
        setShowPreviewDialog(true)
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="border-1 text-sm hover:bg-slate-800 text-white px-4 py-2 rounded-md cursor-pointer">
                    DataType
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Data Types Overview</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <div className="w-full grid grid-cols-1 gap-3 pt-2">
                        {allDataType.map((curr) => (
                            <div
                                key={curr.name}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 border dark:border-slate-700"
                            >
                                <span className="font-semibold text-lg mb-2 sm:mb-0 sm:mr-4 flex-grow">
                                    {curr.name}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewDetails(curr)}
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(curr.name, 'name')
                                        }
                                    >
                                        Copy Name
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>

            {/* Preview Dialog with Schema and UI */}
            <Dialog
                open={showPreviewDialog}
                onOpenChange={setShowPreviewDialog}
            >
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between mt-2">
                            <span>Details: {currentPreviewItem?.name}</span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        currentPreviewItem &&
                                        copyToClipboard(
                                            currentPreviewItem.mongooseSchema,
                                            'schema'
                                        )
                                    }
                                >
                                    Copy Schema
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        currentPreviewItem &&
                                        copyToClipboard(
                                            currentPreviewItem.ui,
                                            'ui'
                                        )
                                    }
                                >
                                    Copy UI Code
                                </Button>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="h-full">
                        <Tabs defaultValue="both" className="w-full h-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="both">Both</TabsTrigger>
                                <TabsTrigger value="schema">
                                    Schema Only
                                </TabsTrigger>
                                <TabsTrigger value="ui">UI Only</TabsTrigger>
                            </TabsList>

                            <TabsContent value="both" className="mt-4">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
                                    {/* Schema Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">
                                                Mongoose Schema
                                            </h3>
                                        </div>
                                        <ScrollArea className="h-[220px] w-full rounded-md border">
                                            <pre className="p-4 text-sm bg-muted/50 rounded-md overflow-x-auto">
                                                <code>
                                                    {
                                                        currentPreviewItem?.mongooseSchema
                                                    }
                                                </code>
                                            </pre>
                                        </ScrollArea>
                                    </div>

                                    {/* UI Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">
                                                UI Component
                                            </h3>
                                        </div>
                                        <div className="space-y-3">
                                            {/* Component Preview */}
                                            <div className="p-4 border rounded-md bg-background min-h-[120px] flex items-center justify-center">
                                                {currentPreviewItem &&
                                                    getComponentForPreview(
                                                        currentPreviewItem
                                                    )}
                                            </div>
                                            {/* Component Code */}
                                            <ScrollArea className="h-[80px] w-full rounded-md border">
                                                <pre className="p-3 text-sm bg-muted/50 rounded-md">
                                                    <code>
                                                        {currentPreviewItem?.ui}
                                                    </code>
                                                </pre>
                                            </ScrollArea>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="schema" className="mt-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">
                                            Mongoose Schema
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                currentPreviewItem &&
                                                copyToClipboard(
                                                    currentPreviewItem.mongooseSchema,
                                                    'schema'
                                                )
                                            }
                                        >
                                            Copy
                                        </Button>
                                    </div>
                                    <ScrollArea className="h-[450px] w-full rounded-md border">
                                        <pre className="p-4 text-sm bg-muted/50 rounded-md overflow-x-auto">
                                            <code>
                                                {
                                                    currentPreviewItem?.mongooseSchema
                                                }
                                            </code>
                                        </pre>
                                    </ScrollArea>
                                </div>
                            </TabsContent>

                            <TabsContent value="ui" className="mt-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">
                                            UI Component
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                currentPreviewItem &&
                                                copyToClipboard(
                                                    currentPreviewItem.ui,
                                                    'ui'
                                                )
                                            }
                                        >
                                            Copy Code
                                        </Button>
                                    </div>

                                    {/* Component Preview */}
                                    <div className="p-6 border rounded-md bg-background min-h-[200px] flex items-center justify-center">
                                        {currentPreviewItem &&
                                            getComponentForPreview(
                                                currentPreviewItem
                                            )}
                                    </div>

                                    {/* Component Code */}
                                    <ScrollArea className="h-[200px] w-full rounded-md border">
                                        <pre className="p-4 text-sm bg-muted/50 rounded-md">
                                            <code>
                                                {currentPreviewItem?.ui}
                                            </code>
                                        </pre>
                                    </ScrollArea>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>
        </Dialog>
    )
}

export default ViewDataType

/*
|-----------------------------------------
| setting up ViewDataType for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: template-generator, August, 2025
|-----------------------------------------
*/
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

const ViewDataType = () => {
    const allDataType = [
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
            name: 'PASSWOR', // Note: Corrected to PASSWORD in schema, keep consistent if possible
            mongooseSchema: `PASSWORD: {
                    type: String,
                    select: false
                }`,
            ui: '<InputFieldForPassword />',
        },
        {
            name: 'PASSCOD', // Note: Corrected to PASSCODE in schema, keep consistent if possible
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
                    enum: ['Option 1', 'Option 2', 'Option 3'] // Example options
                }`,
            ui: '<SelectField />',
        },
        {
            name: 'DYNAMICSELECT',
            mongooseSchema: `DYNAMICSELECT: {
                    type: Schema.Types.ObjectId,
                    ref: 'AnotherModel' // Example of a dynamic reference to another model
                }`,
            ui: '<DynamicSelectField />',
        },
        {
            name: 'IMAGES',
            mongooseSchema: `IMAGES: [{
                     type: String // Array of URLs to images
                }]`,
            ui: '<ImageUploadFieldMultiple />',
        },
        {
            name: 'IMAGE ', // Note the trailing space, consider standardizing
            mongooseSchema: `IMAGE: {
                    type: String // URL to a single image
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
            ui: '<CheckboxField />',
        },
        {
            name: 'DATE ', // Note the trailing space, consider standardizing
            mongooseSchema: `DATE: {
                    type: Date,
                    default: Date.now
                }`,
            ui: '<DateField />',
        },
        {
            name: 'TIME',
            mongooseSchema: `TIME: {
                    type: String // Can be stored as a string in 'HH:MM:SS' format
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
                    start: { type: String }, // 'HH:MM:SS'
                    end: { type: String }   // 'HH:MM:SS'
                }`,
            ui: '<TimeRangePickerField />',
        },
        {
            name: 'COLOEPICKER', // Corrected to COLORPICKER in schema, keep consistent if possible
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
                        return /\\d{3}-\\d{3}-\\d{4}/.test(v); // Escaped backslashes for string literal
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
                    enum: ['Choice A', 'Choice B', 'Choice C'] // Example choices
                }`,
            ui: '<RadioButtonGroupField />',
        },
        {
            name: 'CHECKBOX',
            mongooseSchema: `CHECKBOX: {
                    type: Boolean,
                    default: false
                }`,
            ui: '<SingleCheckboxField />',
        },
        {
            name: 'MULTICHECKBOX',
            mongooseSchema: `MULTICHECKBOX: [{
                    type: String // An array of strings representing the selected options
                }]`,
            ui: '<MultiCheckboxGroupField />',
        },
    ]

    const copyToClipboard = (data: string) => {
        navigator.clipboard
            .writeText(data)
            .then(() => {
                toast.success('Copied to clipboard')
            })
            .catch((err) => {
                console.error('Failed to copy: ', err)
                toast.error('Failed to copy to clipboard')
            })
    }

    return (
        <Dialog>
            <DialogTrigger className="border-1 text-sm hover:bg-slate-800 text-white px-4 py-2 rounded-md cursor-pointer">
                DataType
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Click to copy</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <div className="w-full gap-2 flex flex-col pt-4">
                        {allDataType.map((curr) => (
                            <span
                                key={curr.name}
                                onClick={() => copyToClipboard(curr.name)}
                                className="cursor-pointer p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                {curr.name}
                            </span>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default ViewDataType

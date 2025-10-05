act as a seniour webapp developer in NextJs with Typescript and tailwindCss.

here is an example of a file. I want to modify this code.


generate-view.tsx
```
/**
 * Defines the structure for the schema object, allowing for nested properties.
 */
interface Schema {
    [key: string]: string | Schema
}

/**
 * Generates the content for a dynamic View.tsx component file based on a JSON schema.
 *
 * @param {InputJsonFile} inputJsonFile The JSON object with schema and naming conventions.
 * @returns {string} The complete View.tsx file content as a string.
 */
export const generateViewComponentFile = (inputJsonFile: string): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile)

    const pluralPascalCase = namingConvention.Users_1_000___ // e.g., "Posts"
    const singularLowerCase = namingConvention.user_4_000___ // e.g., "post"
    const interfaceName = `I${pluralPascalCase}` // e.g., "IPosts"
    const defaultInstanceName = `default${pluralPascalCase}` // e.g., "defaultPosts"

    /**
     * Generates the JSX for displaying each field from the schema.
     */
    const generateDetailRowsJsx = (currentSchema: Schema): string => {
        const imageKeys = Object.keys(currentSchema).filter((key) =>
            ['IMAGE', 'IMAGES'].includes(
                (currentSchema[key] as string).toUpperCase()
            )
        )

        return Object.entries(currentSchema)
            .filter(([key]) => !imageKeys.includes(key)) // Exclude image fields from the main list
            .map(([key, type]) => {
                const label = key
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())

                switch ((type as string).toUpperCase()) {
                    case 'BOOLEAN':
                    case 'CHECKBOX':
                        return `<DetailRow label="${label}" value={formatBoolean(selected${pluralPascalCase}['${key}'])} />`
                    case 'DATE':
                        return `<DetailRow label="${label}" value={formatDate(selected${pluralPascalCase}['${key}'])} />`
                    case 'IMAGES':
                    case 'MULTICHECKBOX':
                    case 'MULTISELECT':
                    case 'MULTIDYNAMICSELECT':
                        return `<DetailRowArray label="${label}" values={selected${pluralPascalCase}['${key}']} />`
                    case 'DATERANGE':
                        return `<DetailRow label="${label}" value={\`\${formatDate(selected${pluralPascalCase}['${key}']?.start)} to \${formatDate(selected${pluralPascalCase}['${key}']?.end)}\`} />`
                    case 'TIMERANGE':
                        return `<DetailRow label="${label}" value={\`\${selected${pluralPascalCase}['${key}']?.start || 'N/A'} to \${selected${pluralPascalCase}['${key}']?.end || 'N/A'}\`} />`
                    case 'COLORPICKER':
                        return `<DetailRow
                                label="${label}"
                                value={
                                    <div className="flex items-center gap-2">
                                        <span>{selected${pluralPascalCase}['${key}']}</span>
                                        <div
                                            className="w-5 h-5 rounded-full border"
                                            style={{ backgroundColor: selected${pluralPascalCase}['${key}'] }}
                                        />
                                    </div>
                                }
                            />`
                    default:
                        return `<DetailRow label="${label}" value={selected${pluralPascalCase}['${key}']} />`
                }
            })
            .join('\n                            ')
    }

    /**
     * Generates dedicated JSX for IMAGE and IMAGES fields.
     */
    const generateImageViewerJsx = (currentSchema: Schema): string => {
        return Object.entries(currentSchema)
            .map(([key, type]) => {
                const label = key
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                if ((type as string).toUpperCase() === 'IMAGE') {
                    return `
                        <div className="mt-4">
                            <h3 className="font-semibold text-md mb-2">${label}</h3>
                            {selected${pluralPascalCase}['${key}'] ? (
                                <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                                    <Image
                                        src={selected${pluralPascalCase}['${key}']}
                                        layout="fill"
                                        objectFit="cover"
                                        alt="${label}"
                                    />
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No image provided.</p>
                            )}
                        </div>`
                }
                if ((type as string).toUpperCase() === 'IMAGES') {
                    return `
                        <div className="mt-4">
                            <h3 className="font-semibold text-md mb-2">${label}</h3>
                            {Array.isArray(selected${pluralPascalCase}['${key}']) && selected${pluralPascalCase}['${key}'].length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {selected${pluralPascalCase}['${key}'].map((image: string, index: number) => (
                                        <div
                                            key={\`\${index}-\${image}\`}
                                            className="relative w-full h-32 border rounded-lg overflow-hidden"
                                        >
                                            <Image
                                                src={image}
                                                layout="fill"
                                                objectFit="cover"
                                                alt={\`Image \${index + 1}\`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No images provided.</p>
                            )}
                        </div>`
                }
                return ''
            })
            .join('')
    }

    const detailRowsJsx = generateDetailRowsJsx(schema)
    const imageViewerJsx = generateImageViewerJsx(schema)

    return `import Image from 'next/image'
import { format } from 'date-fns'
import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { ${interfaceName}, ${defaultInstanceName} } from '../store/data/data'
import { use${pluralPascalCase}Store } from '../store/store'
import { useGet${pluralPascalCase}ByIdQuery } from '../redux/rtk-api'

const ViewNextComponents: React.FC = () => {
    const {
        isViewModalOpen,
        selected${pluralPascalCase},
        toggleViewModal,
        setSelected${pluralPascalCase},
    } = use${pluralPascalCase}Store()

    const { data: ${singularLowerCase}Data, refetch } = useGet${pluralPascalCase}ByIdQuery(
        selected${pluralPascalCase}?._id,
        { skip: !selected${pluralPascalCase}?._id }
    )

    useEffect(() => {
        if (selected${pluralPascalCase}?._id) {
            refetch()
        }
    }, [selected${pluralPascalCase}?._id, refetch])

    useEffect(() => {
        if (${singularLowerCase}Data?.data) {
            setSelected${pluralPascalCase}(${singularLowerCase}Data.data)
        }
    }, [${singularLowerCase}Data, setSelected${pluralPascalCase}])

    const formatDate = (date?: Date | string) => {
        if (!date) return 'N/A'
        try {
            return format(new Date(date), 'MMM dd, yyyy')
        } catch (error) {
            return 'Invalid Date'
        }
    }

    const formatBoolean = (value?: boolean) => (value ? 'Yes' : 'No')

    const DetailRow: React.FC<{
        label: string
        value: React.ReactNode
    }> = ({ label, value }) => (
        <div className="grid grid-cols-3 gap-2 py-2 border-b">
            <div className="font-semibold text-sm text-gray-600">{label}</div>
            <div className="col-span-2 text-sm">{value || 'N/A'}</div>
        </div>
    )
    
    const DetailRowArray: React.FC<{
        label: string
        values?: (string | number)[]
    }> = ({ label, values }) => (
        <DetailRow label={label} value={values?.join(', ') || 'N/A'} />
    )

    return (
        <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>${pluralPascalCase} Details</DialogTitle>
                </DialogHeader>
                {selected${pluralPascalCase} && (
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="grid gap-1">
                            ${detailRowsJsx}
                            <DetailRow label="Created At" value={formatDate(selected${pluralPascalCase}.createdAt)} />
                            <DetailRow label="Updated At" value={formatDate(selected${pluralPascalCase}.updatedAt)} />
                        </div>
                        ${imageViewerJsx}
                    </ScrollArea>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toggleViewModal(false)
                            setSelected${pluralPascalCase}(${defaultInstanceName} as ${interfaceName})
                        }}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ViewNextComponents
`
}

```

and here is old inputJson
```
{
  "uid": "000",
  "templateName": "Basic Template",
  "schema": {
    "title": "STRING",
    "email": "EMAIL",
    "password": "PASSWORD",
    "passcode": "PASSCODE",
    "area": "SELECT#Bangladesh, India, Pakistan, Canada",
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
    "hobbies": "MULTICHECKBOX",
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

here is updated inputJson 
```
{
  "uid": "000",
  "templateName": "Basic Template",
  "schema": {
    "title": "STRING",
    "email": "EMAIL",
    "password": "PASSWORD",
    "passcode": "PASSCODE",
    "area": "SELECT#Bangladesh, India, Pakistan, Canada",
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
    "hobbies": "MULTICHECKBOX",
    "ideas": "MULTIOPTIONS#O 1, O 2, O 3, O 4",
    "students": "STRINGARRAY#Name, Class, Roll",
    "complexValue": {
      "id": "1234",
      "title": " The Name of Country",
      "parent": {
        "id": "111234",
        "title": " The Name of Parent",
        "child": {
          "id": "1234",
          "title": " The Name of Child",
          "child": "",
          "note": "The Note"
        },
        "note": "The Note"
      },
      "note": "The Note"
    }
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


Now please Update generate-edit.tsx so it can generate with STRINGARRAY and "{
      "id": "1234",
      "title": " The Name of Country",
      "parent": {
        "id": "111234",
        "title": " The Name of Parent",
        "child": {
          "id": "1234",
          "title": " The Name of Child",
          "child": "",
          "note": "The Note"
        },
        "note": "The Note"
      },
      "note": "The Note"
    }"


Now please update the generate-edit.tsx
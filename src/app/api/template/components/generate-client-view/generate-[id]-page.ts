/**
 * Defines the structure for the schema object, allowing for recursive nesting.
 */
interface Schema {
    [key: string]: string | Schema
}

/**
 * Generates the content for a dynamic client-side details page (page.tsx).
 *
 * @param {InputJsonFile} inputJsonFile The JSON object with schema and naming conventions.
 * @returns {string} The complete page.tsx file content as a string.
 */
export const generateClientDetailPageFile = (inputJsonFile: string): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile) || {}

    const pluralLowerCase = namingConvention.users_2_000___ // e.g., "posts"
    const singularLowerCase = namingConvention.user_4_000___ // e.g., "post"

    // --- Helper Functions ---

    /**
     * Maps a schema type string to a TypeScript type string.
     */
    const mapSchemaTypeToTsType = (type: string): string => {
        switch (type.toUpperCase()) {
            case 'INTNUMBER':
            case 'FLOATNUMBER':
                return 'number'
            case 'BOOLEAN':
            case 'CHECKBOX':
                return 'boolean'
            case 'IMAGES':
            case 'MULTICHECKBOX':
            case 'MULTISELECT':
            case 'MULTIDYNAMICSELECT':
                return 'string[]'
            case 'DATE':
                return 'Date | string'
            case 'DATERANGE':
                return '{ start: Date | string; end: Date | string }'
            case 'TIMERANGE':
                return '{ start: string; end: string }'
            default:
                return 'string'
        }
    }

    /**
     * Recursively generates TypeScript type properties from the schema.
     */
    const generateTsTypeProperties = (
        currentSchema: Schema,
        depth: number
    ): string => {
        const indent = '    '.repeat(depth)
        return Object.entries(currentSchema)
            .map(([key, value]) => {
                const quotedKey = `"${key}"`
                if (typeof value === 'object' && !Array.isArray(value)) {
                    return `${indent}${quotedKey}?: {\n${generateTsTypeProperties(value, depth + 1)}\n${indent}}`
                }
                return `${indent}${quotedKey}?: ${mapSchemaTypeToTsType(value as string)}`
            })
            .join(';\n')
    }

    /**
     * Generates the JSX to display all data fields.
     */
    const generateDetailsJsx = (currentSchema: Schema): string => {
        return Object.entries(currentSchema)
            .map(([key, value]) => {
                const isObject = typeof value === 'object'
                const isArray = [
                    'IMAGES',
                    'MULTICHECKBOX',
                    'MULTISELECT',
                    'MULTIDYNAMICSELECT',
                ].includes((value as string).toUpperCase())

                let displayValue
                if (isObject) {
                    displayValue = `<pre>{JSON.stringify(data?.["${key}"], null, 2)}</pre>`
                } else if (isArray) {
                    displayValue = `{(data?.["${key}"] as string[])?.join(', ')}`
                } else {
                    displayValue = `{data?.["${key}"]?.toString()}`
                }

                return `
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">${key.replace(/-/g, ' ')}:</strong> ${displayValue}
            </div>`
            })
            .join('')
    }

    const tsTypeProperties = generateTsTypeProperties(schema, 1)
    const detailsJsx = generateDetailsJsx(schema)

    // --- Final Template ---
    return `'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Dynamically generated type for the data state
type Data = {
${tsTypeProperties}
}

const Page = () => {
    const [data, setData] = useState<Data | null>(null)
    const pathname = usePathname()
    const id = pathname.split('/')[5]

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                const token = process.env.NEXT_PUBLIC_Token
                if (!token) {
                  
                    return
                }

                const url = \`http://localhost:3000/dashboard/${singularLowerCase}/all/api/v1?id=\${id}\`
                
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            Authorization: \`Bearer \${token}\`,
                        },
                    })

                    const responseData = await response.json()
                    setData(responseData?.data)
                } catch (error) {
                }
            }
            fetchData()
        }
    }, [id])
    
    return (
        <div className="w-full flex flex-col md:p-4 p-1 gap-4">
            <div className="border border-slate-400 rounded-md overflow-hidden">
                ${detailsJsx.trim()}
            </div>
            <Link
                href="/dashboard/${pluralLowerCase}"
                className="w-full text-center hover:bg-slate-400 bg-slate-300 p-2 border border-slate-400 rounded-md"
            >
                Back to List
            </Link>
        </div>
    )
}
export default Page
`
}

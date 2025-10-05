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
    }
}

/**
 * Generates the content for a dynamic client-side details page (page.tsx).
 *
 * @param {string} inputJsonString The JSON string with schema and naming conventions.
 * @returns {string} The complete page.tsx file content as a string.
 */
export const generateClientDetailPageFile = (
    inputJsonFile: string
): string => {
    const { schema, namingConvention }: InputConfig =
        JSON.parse(inputJsonFile) || {}

    const pluralLowerCase = namingConvention.users_2_000___ // e.g., "posts"
    const singularUpperCase = namingConvention.User_3_000___ // e.g., "Post"

    // --- Helper Functions ---

    /**
     * Maps a schema type string to a TypeScript type string.
     */
    const mapSchemaTypeToTsType = (type: string): string => {
        const [typeName, options] = type.split('#')

        switch (typeName.toUpperCase()) {
            case 'INTNUMBER':
            case 'FLOATNUMBER':
                return 'number'
            case 'BOOLEAN':
            case 'CHECKBOX':
                return 'boolean'
            case 'IMAGES':
            case 'MULTICHECKBOX':
            case 'MULTIOPTIONS':
            case 'DYNAMICSELECT':
                return 'string[]'
            case 'DATE':
                return 'Date | string'
            case 'DATERANGE':
                return '{ start: Date | string; end: Date | string }'
            case 'TIMERANGE':
                return '{ start: string; end: string }'
            // --- START: NEW CASE FOR STRINGARRAY ---
            case 'STRINGARRAY':
                if (options) {
                    const fields = options
                        .split(',')
                        .map((field) => `${field.trim()}: string`)
                        .join('; ')
                    return `Array<{ ${fields} }>`
                }
                return 'Array<{ [key: string]: string }>' // Fallback
            // --- END: NEW CASE FOR STRINGARRAY ---
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
                    return `${indent}${quotedKey}?: {\n${generateTsTypeProperties(
                        value,
                        depth + 1
                    )}\n${indent}}`
                }
                return `${indent}${quotedKey}?: ${mapSchemaTypeToTsType(
                    value as string
                )}`
            })
            .join(';\n')
    }

    /**
     * Generates the JSX to display all data fields.
     */
    const generateDetailsJsx = (currentSchema: Schema): string => {
        return Object.entries(currentSchema)
            .map(([key, value]) => {
                const isNestedObject =
                    typeof value === 'object' && !Array.isArray(value)
                const [baseType = ''] =
                    typeof value === 'string'
                        ? (value as string).toUpperCase().split('#')
                        : []

                const isSimpleArray = [
                    'IMAGES',
                    'MULTICHECKBOX',
                    'MULTIOPTIONS',
                    'DYNAMICSELECT',
                ].includes(baseType)
                const isObjectArray = baseType === 'STRINGARRAY'

                let displayValue
                if (isNestedObject || isObjectArray) {
                    displayValue = `<pre className="text-sm bg-slate-200 dark:bg-slate-900 p-2 rounded-md whitespace-pre-wrap">{JSON.stringify(data?.["${key}"], null, 2)}</pre>`
                } else if (isSimpleArray) {
                    displayValue = `{(data?.["${key}"] as string[])?.join(', ')}`
                } else {
                    displayValue = `{data?.["${key}"]?.toString()}`
                }

                return `
            <div className="w-full hover:bg-slate-200 bg-slate-100 block p-2 border-b border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-500">
                <strong className="capitalize">${key.replace(
                    /-/g,
                    ' '
                )}:</strong> ${displayValue}
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
    _id: string; // Assuming an ID field from the database
${tsTypeProperties}
}

const Page = () => {
    const [data, setData] = useState<Data | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const pathname = usePathname()

    // This logic is brittle and assumes a fixed URL structure.
    // Consider using Next.js dynamic route parameters for more robust ID extraction.
    const id = pathname.split('/').pop()

    useEffect(() => {
        if (!id) {
            setLoading(false)
            setError("No ID found in the URL.")
            return
        }

        const fetchData = async () => {
            setLoading(true)
            setError(null)
            
            // It's best practice to use environment variables for API URLs.
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const url = \`\${baseUrl}/generate/${pluralLowerCase}/all/api/v1?id=\${id}\`;
            
            try {
                // Using a generic token from env for auth example.
                const token = process.env.NEXT_PUBLIC_Token
                if (!token) {
                    throw new Error("API token is not configured.");
                }

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: \`Bearer \${token}\`,
                        'Content-Type': 'application/json',
                    },
                })

                if (!response.ok) {
                    throw new Error(\`Failed to fetch data: \${response.statusText}\`);
                }

                const responseData = await response.json()
                if (responseData && responseData.data) {
                    setData(responseData.data)
                } else {
                    throw new Error("No data found in the response.");
                }

            } catch (err) {
                setError((err as Error).message || 'An unknown error occurred.')
            } finally {
                setLoading(false)
            }
        }
        
        fetchData()
    }, [id])

    if (loading) {
        return <div className="text-center p-8">Loading ${singularUpperCase} details...</div>
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">Error: {error}</div>
    }
    
    if (!data) {
        return <div className="text-center p-8">No data available for this ${singularUpperCase}.</div>
    }

    return (
        <div className="w-full flex flex-col md:p-4 p-1 gap-4">
            <h1 className="text-2xl font-bold">${singularUpperCase} Details</h1>
            <div className="border border-slate-300 rounded-md overflow-hidden dark:border-slate-600">
                ${detailsJsx.trim()}
            </div>
            <Link
                href="/dashboard/${pluralLowerCase}"
                className="w-full text-center hover:bg-slate-400 bg-slate-300 p-2 border border-slate-400 rounded-md dark:bg-slate-600 dark:hover:bg-slate-500"
            >
                Back to List
            </Link>
        </div>
    )
}
export default Page
`
}
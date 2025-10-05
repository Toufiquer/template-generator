/**
 * Defines the structure for the schema object, allowing for recursive nesting.
 */
interface Schema {
    [key:string]: string | Schema
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
 * Generates the content for a dynamic details page (page.tsx) based on a JSON schema.
 *
 * @param {string} inputJsonString The JSON string containing the schema and naming conventions.
 * @returns {string} The complete page.tsx file content as a string.
 */
export const generateDetailPageFile = (inputJsonFile: string): string => {
    const { schema, namingConvention }: InputConfig =
        JSON.parse(inputJsonFile) || {}

    const modelName = namingConvention.User_3_000___ // e.g., "Post"
    const interfaceName = `I${modelName}` // e.g., "IPost"

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
                return 'Array<{ [key: string]: string }>' // Fallback for empty options
            // --- END: NEW CASE FOR STRINGARRAY ---
            default:
                return 'string'
        }
    }

    /**
     * Recursively generates TypeScript interface properties from the schema.
     * This now correctly handles both string-defined types and nested objects.
     */
    const generateTsInterfaceProperties = (
        currentSchema: Schema,
        depth: number
    ): string => {
        const indent = '    '.repeat(depth)
        return Object.entries(currentSchema)
            .map(([key, value]) => {
                const quotedKey = `"${key}"`
                // If the value is an object, recurse to build a nested interface.
                if (typeof value === 'object' && !Array.isArray(value)) {
                    return `${indent}${quotedKey}: {\n${generateTsInterfaceProperties(
                        value,
                        depth + 1
                    )}\n${indent}}`
                }
                // Otherwise, map the string type to a TS type.
                return `${indent}${quotedKey}: ${mapSchemaTypeToTsType(
                    value as string
                )}`
            })
            .join(';\n')
    }

    /**
     * Generates the JSX for displaying the data fields within the DataDetails component.
     * This version intelligently formats simple arrays, object arrays, and nested objects.
     */
    const generateDetailsJsx = (currentSchema: Schema): string => {
        return Object.entries(currentSchema)
            .map(([key, value]) => {
                const isNestedObject =
                    typeof value === 'object' && !Array.isArray(value)

                // Get the base type (e.g., "IMAGES", "STRINGARRAY") from the string value.
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
                    // For nested objects OR arrays of objects, pretty-print the JSON.
                    displayValue = `<pre className="text-sm">{JSON.stringify(data?.["${key}"], null, 2)}</pre>`
                } else if (isSimpleArray) {
                    // For arrays of primitives, join the elements.
                    displayValue = `{data?.["${key}"]?.join(', ')}`
                } else {
                    // For all other primitive values, convert to string.
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

    // Find a primary display key (e.g., 'title', 'name') for the metadata
    const displayKey =
        Object.keys(schema).find(
            (k) => k.toLowerCase() === 'title' || k.toLowerCase() === 'name'
        ) || Object.keys(schema)[0]

    const interfaceProperties = generateTsInterfaceProperties(schema, 1)
    const detailsJsx = generateDetailsJsx(schema)
    const pluralName = namingConvention.users_2_000___ // e.g., "posts"

    // --- Final Template ---

    return `import { notFound } from 'next/navigation'
import HomeButton from './HomeButton'

// Dynamically generated interface based on the schema
interface ${interfaceName} {
${interfaceProperties};
    _id: string;
}

interface ApiResponse {
    data: ${interfaceName};
    message: string;
    status: number;
}

const DataDetails = ({ data }: { data: ${interfaceName} }) => {
    return (
        <div className="w-full flex flex-col md:p-4 p-1 gap-4">
            <h1 className="text-2xl font-bold">${modelName} Details</h1>
            <div className="border border-slate-300 rounded-md overflow-hidden dark:border-slate-600">
                ${detailsJsx.trim()}
            </div>
            <HomeButton />
        </div>
    )
}

const getDataById = async (id: string): Promise<ApiResponse> => {
    // Ensure the backend URL is correctly configured, especially for production.
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const backendUrl = \`\${baseUrl}/generate/${pluralName}/all/api/v1?id=\${id}\`

    try {
        const res = await fetch(backendUrl, { next: { revalidate: 3600 } }) // 1 hour cache
        if (!res.ok) {
            // Log the error for debugging purposes on the server.
            console.error('API fetch failed with status:', res.status);
            // Gracefully handle not found errors from the API.
            if (res.status === 404) {
                notFound();
            }
            throw new Error('Failed to fetch data');
        }
        const responseData: ApiResponse = await res.json()
        if (!responseData || !responseData.data) {
             notFound()
        }
        return responseData
    } catch (error) {
        console.error('Failed to fetch ${modelName}:', error)
        notFound();
    }
}

async function getData(id: string) {
    const data = await getDataById(id)
    // The notFound() call is handled within getDataById, so this check is redundant
    // but safe to keep.
    if (!data) notFound()
    return data
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const { id } = params
    const data = await getData(id)

    // Safely access the display key, providing a fallback title.
    return {
        title: data?.data?.["${displayKey}"]?.toString() || '${modelName}',
    }
}

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params
    const data = await getData(id)
    return (
        <div className="py-12 flex flex-col w-full">
            <DataDetails data={data.data} />
        </div>
    )
}
`
}
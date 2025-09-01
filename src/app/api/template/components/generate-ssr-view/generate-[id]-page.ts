/**
 * Defines the structure for the schema object, allowing for recursive nesting.
 */
interface Schema {
    [key: string]: string | Schema
}

/**
 * Generates the content for a dynamic details page (page.tsx) based on a JSON schema.
 *
 * @param {InputJsonFile} inputJsonFile The JSON object containing the schema and naming conventions.
 * @returns {string} The complete page.tsx file content as a string.
 */
export const generateDetailPageFile = (inputJsonFile: string): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile) || {}

    const singularName = namingConvention.user_4_000___ // e.g., "post"
    const modelName = namingConvention.User_3_000___ // e.g., "Post"
    const interfaceName = `I${modelName}` // e.g., "IPost"

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
                return 'Date | string' // Can be a Date object or string representation
            case 'DATERANGE':
                return '{ start: Date | string; end: Date | string }'
            case 'TIMERANGE':
                return '{ start: string; end: string }'
            default:
                return 'string'
        }
    }

    /**
     * Recursively generates TypeScript interface properties from the schema.
     */
    const generateTsInterfaceProperties = (
        currentSchema: Schema,
        depth: number
    ): string => {
        const indent = '    '.repeat(depth)
        return Object.entries(currentSchema)
            .map(([key, value]) => {
                const quotedKey = `"${key}"`
                if (typeof value === 'object' && !Array.isArray(value)) {
                    return `${indent}${quotedKey}: {\n${generateTsInterfaceProperties(value, depth + 1)}\n${indent}}`
                }
                return `${indent}${quotedKey}: ${mapSchemaTypeToTsType(value as string)}`
            })
            .join(';\n')
    }

    /**
     * Generates the JSX for displaying the data fields within the DataDetails component.
     * This version ensures all non-object values are safely converted to strings for rendering.
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
                    // For nested objects, pretty-print the JSON. This is already a string.
                    displayValue = `<pre>{JSON.stringify(data?.["${key}"], null, 2)}</pre>`
                } else if (isArray) {
                    // For arrays, join the elements to create a renderable string.
                    displayValue = `{data?.["${key}"]?.join(', ')}`
                } else {
                    // For all other primitive-like values (string, number, boolean, Date),
                    // explicitly convert them to a string to ensure they are valid React children.
                    displayValue = `{data?.["${key}"]?.toString()}`
                }

                return `
            <div className="w-full hover:bg-slate-400 bg-slate-300 block p-2 border-b border-slate-400">
                <strong className="capitalize">${key.replace(/-/g, ' ')}:</strong> ${displayValue}
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
            <div className="border border-slate-400 rounded-md overflow-hidden">
                ${detailsJsx.trim()}
            </div>
            <HomeButton />
        </div>
    )
}

const getDataById = async (id: string): Promise<ApiResponse> => {
    const backendUrl = \`http://localhost:3000/dashboard/${singularName}/all/api/v1?id=\${id}\`

    try {
        const res = await fetch(backendUrl, { next: { revalidate: 3600 } }) // 1 hour cache
        if (!res.ok) {
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
    if (!data) notFound()
    return data
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const { id } = params
    const data = await getData(id)

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

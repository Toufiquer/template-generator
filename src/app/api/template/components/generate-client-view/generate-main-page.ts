/**
 * Defines the structure for the schema object.
 */
interface Schema {
    [key: string]: string | Schema
}

/**
 * Defines the structure for the naming convention object.
 */
interface NamingConvention {
    Users_1_000___: string
    users_2_000___: string
    User_3_000___: string
    user_4_000___: string
    [key: string]: string // Allows for additional keys
}

/**
 * Defines the structure for the main input JSON file.
 */
interface InputJsonFile {
    uid: string
    templateName: string
    schema: Schema
    namingConvention: NamingConvention
}

/**
 * Generates the content for a client-side list page (page.tsx).
 *
 * @param {InputJsonFile} inputJsonFile The JSON object with schema and naming conventions.
 * @returns {string} The complete page.tsx file content as a string.
 */
export const generateClientListPageFile = (inputJsonFile: string): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile) || {}

    // 1. Extract the required names for API paths and data keys.
    const pluralLowerCase = namingConvention.users_2_000___ // e.g., "posts"
    const singularLowerCase = namingConvention.user_4_000___ // e.g., "post"

    // 2. Intelligently find the display key.
    // It looks for a top-level field named 'title' or 'name', falling back to the first 'STRING' field.
    const schemaKeys = Object.keys(schema)
    const displayKey =
        schemaKeys.find((key) => key.toLowerCase() === 'title') ||
        schemaKeys.find((key) => key.toLowerCase() === 'name') ||
        schemaKeys.find((key) => schema[key] === 'STRING') ||
        'name' // Default fallback

    // 3. Construct the file content using a template literal.
    return `'use client'

import { useEffect, useState } from 'react'

import CustomLInk from './CustomButton'

// Define a type for the data items for better type safety
type DataItem = {
    ${displayKey}: string;
    _id: string;
    [key: string]: any; // Allow other properties
};

const Page = () => {
    const [data, setData] = useState<DataItem[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const token = process.env.NEXT_PUBLIC_Token
            if (!token) {
                console.error(
                    'Authentication token not found. Unable to fetch data.'
                )
                return
            }
            const url =
                'http://localhost:3000/dashboard/${singularLowerCase}/all/api/v1?page=1&limit=4'

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: \`Bearer \${token}\`,
                    },
                })

                const responseData = await response.json()
                // Use optional chaining for safer access
                setData(responseData?.data?.${pluralLowerCase} || [])
            } catch (error) {
                console.error('Failed to fetch data:', error)
                setData([]) // Ensure data is an array on error
            }
        }
        fetchData()
    }, [])

    return (
        <main className="w-full flex flex-col gap-2 p-1 md:p-4">
            {data?.map((item: DataItem, idx: number) => (
                <div key={idx + item?._id}>
                    <CustomLInk
                        name={item.${displayKey}}
                        url={\`/dashboard/${singularLowerCase}/client-view/details/\${item._id}\`}
                    />
                </div>
            ))}
        </main>
    )
}
export default Page
`
}

/**
 * Generates the entire Controller.ts file content as a string based on a JSON configuration.
 *
 * This function parses the JSON to extract naming conventions and a data schema. It then
 * uses a template to build the controller's TypeScript code, dynamically inserting the correct
 * names for models, variables, and functions. It also recursively traverses the schema to
 * build a comprehensive search filter that includes all specified fields, including nested ones.
 *
 * @param {string} inputJsonString - A JSON string containing the schema and naming conventions.
 * @returns {string} The complete, formatted Controller.ts file as a string.
 */
export const generateMainPage = (inputJsonFile: string): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile) || {}

    // 1. Extract the required names for API paths and data keys.
    const pluralName = namingConvention.users_2_000___ // e.g., "posts"

    // 2. Intelligently find the display key.
    // It looks for the first top-level 'STRING' field in the schema to use as the item's name/title.
    // If none is found, it defaults to 'name'.
    const displayKey =
        Object.keys(schema).find((key) => schema[key] === 'STRING') || 'name'

    // 3. Construct the file content using a template literal.
    return `import CustomLInk from './CustomButton'

const Page = async () => {
    const fetchData = async () => {
        const token = process.env.NEXT_PUBLIC_Token
        if (!token) {
            console.error(
                'Authentication token not found. Unable to fetch data.'
            )
            return
        }

        const url =
            'http://localhost:3000/generate/${pluralName}/all/api/v1?page=1&limit=4'

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: \`Bearer \${token}\`,
                },
            })

            const responseData = await response.json()
            return responseData.data?.${pluralName}
        } catch (error) {
            console.error('Failed to fetch data:', error)
            return []
        }
    }
    const data: { ${displayKey}: string; _id: string }[] = await fetchData()
    return (
        <main className="w-full flex flex-col gap-2 p-1 md:p-4">
            {data &&
                data.length > 0 &&
                data.map((i: { ${displayKey}: string; _id: string }, idx: number) => (
                    <div key={idx + i?.${displayKey}}>
                        <CustomLInk
                            name={i.${displayKey}}
                            url={\`/generate/${pluralName}/ssr-view/details/\${i._id}\`}
                        />
                    </div>
                ))}
        </main>
    )
}
export default Page
`
}

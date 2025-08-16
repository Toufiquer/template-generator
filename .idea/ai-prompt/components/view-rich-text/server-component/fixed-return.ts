interface Schema {
    [key: string]: string | Schema
}

/**
 * Defines the structure for the naming conventions provided in the JSON.
 */
interface NamingConvention {
    Users_1_000___: string
    users_2_000___: string
    User_3_000___: string
    user_4_000___: string
}

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
export const generateViewRichTextEditorServerComponent = (
    inputJsonFile: string
): string => {
    const { schema, namingConvention } = JSON.parse(inputJsonFile) || {}
    const folderName = namingConvention.users_2_000___
    return `  
import { ViewRichText } from './ViewRichText'

const ServerComponent = ({ data }: { data: string }) => {
    return (
        <main className="w-full min-h-[200px] border-1 border-slate-200">
            <h2 className="text-xl text-center w-full border-b-2 p-2 border-slate-200">
                Server Component
            </h2>
            <ViewRichText data={data} />
        </main>
    )
}
export default ServerComponent

`
}

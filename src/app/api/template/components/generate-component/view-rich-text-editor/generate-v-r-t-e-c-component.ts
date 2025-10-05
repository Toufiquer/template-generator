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
export const generateViewRichTextEditorClientComponent = (
    inputJsonFile: string
): string => {
    return `  
    import { ViewRichText } from './ViewRichText'
    
    const ClientComponent = ({ data }: { data: string }) => {
        return (
            <main className="w-full min-h-[200px] border-1 border-slate-200">
                <h2 className="text-xl text-center w-full border-b-2 p-2 border-slate-200">
                    Client Component
                </h2>
                <ViewRichText data={data} />
            </main>
        )
    }
    export default ClientComponent
    
`
}

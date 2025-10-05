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
export const generateViewRichTextViewComponent = (
    inputJsonFile: string
): string => {
    return `  
export const ViewRichText = ({ data }: { data: string }) => {
    return (
        <main
            className="rich-text-content 
    [&_s]:line-through [&_del]:line-through 
    [&_u]:underline 
    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-2 
    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-2 
    [&_li]:mb-2 
    [&_mark]:bg-yellow-200 [&_mark]:px-0.5 [&_mark]:rounded-sm
    [&_.text-left]:text-left 
    [&_.text-center]:text-center 
    [&_.text-right]:text-right 
    [&_.text-justify]:text-justify"
            dangerouslySetInnerHTML={{ __html: data }}
        />
    )
}


`
}

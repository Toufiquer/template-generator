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
export const generateTypeUtils = (inputJsonFile: string): string => {

    return `
    
export interface ApiErrorDataPayload {
  data: null;
  message: string;
  status: number;
}

export interface ApiErrorResponse {
  status: number;
  data: ApiErrorDataPayload;
}
    
`
}

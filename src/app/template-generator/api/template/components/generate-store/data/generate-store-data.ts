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
 * Defines the overall structure of the input JSON configuration.
 */
interface InputConfig {
    uid: string
    templateName: string
    schema: Schema
    namingConvention: NamingConvention
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
export const generateStoreData = (inputJsonFile: string): string => {
    const config: InputConfig = JSON.parse(inputJsonFile)
    const { namingConvention, schema } = config

    // --- 1. Extract Naming Conventions ---
    const interfaceName = namingConvention.Users_1_000___ || 'Items'

    // Maps schema types to TypeScript interface types
    const mapToInterfaceType = (type: string): string => {
        // --- FIX: Isolate the base type name from options (e.g., "MULTIOPTIONS" from "MULTIOPTIONS#O 1...") ---
        const [typeName] = type.split('#')

        // --- FIX: Switch on the base type name ---
        switch (typeName.toUpperCase()) {
            case 'INTNUMBER':
            case 'FLOATNUMBER':
                return 'number'
            case 'BOOLEAN':
            case 'CHECKBOX':
                return 'boolean'
            case 'IMAGES':
            case 'MULTICHECKBOX':
            case 'DYNAMICSELECT':
            case 'MULTIOPTIONS': // Now this case will be matched correctly
                return 'string[]'
            case 'DATE':
                return 'Date'
            case 'DATERANGE':
                return '{ from: Date; to: Date }'
            case 'TIMERANGE':
                return '{ start: string; end: string }'
            default:
                return 'string'
        }
    }

    // Maps schema types to default values for the default object
    const mapToDefaultValue = (type: string): string => {
        // --- FIX: Isolate the base type name from options ---
        const [typeName] = type.split('#')

        // --- FIX: Switch on the base type name ---
        switch (typeName.toUpperCase()) {
            case 'INTNUMBER':
            case 'FLOATNUMBER':
                return '0'
            case 'BOOLEAN':
            case 'CHECKBOX':
                return 'false'
            case 'IMAGES':
            case 'MULTICHECKBOX':
            case 'DYNAMICSELECT':
            case 'MULTIOPTIONS': // Now this case will be matched correctly
                return '[]'
            case 'DATE':
                return 'new Date()'
            case 'DATERANGE':
                return '{ from: new Date(), to: new Date() }'
            case 'TIMERANGE':
                return '{ start: "", end: "" }'
            default:
                return "''"
        }
    }

    /**
     * Recursively generates the TypeScript interface definition.
     * All keys are quoted to handle special characters.
     */
    const generateInterfaceFields = (
        currentSchema: Schema,
        depth: number
    ): string => {
        const indent = '    '.repeat(depth)
        return Object.entries(currentSchema)
            .map(([key, value]) => {
                const quotedKey = `"${key}"` // Always quote the key
                if (typeof value === 'object' && !Array.isArray(value)) {
                    return `${indent}${quotedKey}: {\n${generateInterfaceFields(value, depth + 1)}\n${indent}}`
                }
                return `${indent}${quotedKey}: ${mapToInterfaceType(value as string)}`
            })
            .join(';\n')
    }

    /**
     * Recursively generates the default object definition.
     * All keys are quoted to handle special characters.
     */
    const generateDefaultObjectFields = (
        currentSchema: Schema,
        depth: number
    ): string => {
        const indent = '    '.repeat(depth)
        return Object.entries(currentSchema)
            .map(([key, value]) => {
                const quotedKey = `"${key}"` // Always quote the key
                if (typeof value === 'object' && !Array.isArray(value)) {
                    return `${indent}${quotedKey}: {\n${generateDefaultObjectFields(value, depth + 1)}\n${indent}}`
                }
                return `${indent}${quotedKey}: ${mapToDefaultValue(value as string)}`
            })
            .join(',\n')
    }

    // --- 4. Assemble the Final File Content ---

    const interfaceContent = generateInterfaceFields(schema, 1)
    const defaultObjectContent = generateDefaultObjectFields(schema, 1)

    return `

    import { DateRange } from 'react-day-picker'

export interface I${interfaceName} {
${interfaceContent};
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const default${interfaceName} = {
${defaultObjectContent},
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
`
}

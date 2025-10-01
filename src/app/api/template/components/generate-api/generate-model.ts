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
 * Generates the entire Model.ts file content as a string based on a JSON configuration.
 *
 * This function parses the JSON to extract naming conventions and a data schema. It then
 * uses a template to build the model's TypeScript code, dynamically inserting the correct
 * names for models, variables, and also recursively traverses the schema to
 * build a comprehensive Mongoose schema. It handles complex types by parsing options
 * directly from the schema string (e.g., "SELECT#Option1,Option2").
 *
 * @param {string} inputJsonString - A JSON string containing the schema and naming conventions.
 * @returns {string} The complete, formatted Model.ts file as a string.
 */
export const generateModel = (inputJsonFile: string): string => {
    const config: InputConfig = JSON.parse(inputJsonFile)
    const { namingConvention, schema } = config

    // --- 1. Extract Naming Conventions ---
    const modelName = namingConvention.User_3_000___ || 'Item'
    const schemaVarName = `${namingConvention.user_4_000___ || 'item'}Schema`

    // --- 2. Type Mapping Helpers ---

    // Maps schema types to Mongoose schema definitions
    const mapToMongooseSchema = (type: string): string => {
        const [typeName, options] = type.split('#')

        // Helper function to generate enum schema for a single string
        const createEnumSchema = (
            optionsStr: string | undefined,
            defaultOptions: string[]
        ): string => {
            const enumValues = optionsStr
                ? optionsStr
                      .split(',')
                      .map((option) => `'${option.trim()}'`)
                      .join(', ')
                : defaultOptions.map((opt) => `'${opt}'`).join(', ')
            return `{ type: String, enum: [${enumValues}] }`
        }

        // Helper function to generate enum schema for an array of strings
        const createMultiEnumSchema = (
            optionsStr: string | undefined,
            defaultOptions: string[]
        ): string => {
            const enumValues = optionsStr
                ? optionsStr
                      .split(',')
                      .map((option) => `'${option.trim()}'`)
                      .join(', ')
                : defaultOptions.map((opt) => `'${opt}'`).join(', ')
            return `{ type: [String], enum: [${enumValues}] }`
        }

        switch (typeName.toUpperCase()) {
            case 'STRING':
                return `{ type: String, }`
            case 'EMAIL':
                return `{
                    type: String,
                     match:  [/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/, 'Please enter a valid email'],
                }`
            case 'PASSWORD':
                return `{ type: String, select: false }`
            case 'PASSCODE':
                return `{ type: String, select: false }`
            case 'SELECT':
                return createEnumSchema(options, ['Option 1', 'Option 2'])
            case 'DYNAMICSELECT':
                return `[{  type: String }]`
            case 'IMAGES':
                return `[{ type: String }]`
            case 'IMAGE':
                return `{ type: String }`
            case 'DESCRIPTION':
                return `{ type: String, trim: true }`
            case 'INTNUMBER':
                return `{ type: Number, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } }`
            case 'FLOATNUMBER':
                return `{ type: Number }`
            case 'BOOLEAN':
                return `{ type: Boolean, default: false }`
            case 'DATE':
                return `{ type: Date, default: Date.now }`
            case 'TIME':
                return `{ type: String }`
            case 'DATERANGE':
                return `{ start: { type: Date }, end: { type: Date } }`
            case 'TIMERANGE':
                return `{ start: { type: String }, end: { type: String } }`
            case 'COLORPICKER':
                return `{ type: String, match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please fill a valid color hex code'] }`
            case 'PHONE':
                return `{
                    type: String
                }`
            case 'URL':
                return `{ type: String, trim: true }`
            case 'RICHTEXT':
            case 'AUTOCOMPLETE':
                return `{ type: String }`
            case 'RADIOBUTTON':
                return `[{ type: String }]`
            case 'CHECKBOX':
                return `{ type: Boolean, default: false }`
            case 'MULTICHECKBOX':
                return `[{ type: String }]`
            case 'MULTIOPTIONS':
                return createMultiEnumSchema(options, [
                    'Default Option A',
                    'Default Option B',
                ])
            default:
                return `{ type: String }`
        }
    }

    /**
     * Recursively generates the Mongoose schema definition.
     * All keys are quoted to handle special characters.
     */
    const generateSchemaFields = (
        currentSchema: Schema,
        depth: number
    ): string => {
        const indent = '    '.repeat(depth)
        return Object.entries(currentSchema)
            .map(([key, value]) => {
                const quotedKey = `"${key}"` // Always quote the key
                if (typeof value === 'object' && !Array.isArray(value)) {
                    return `${indent}${quotedKey}: {\n${generateSchemaFields(value, depth + 1)}\n${indent}}`
                }
                return `${indent}${quotedKey}: ${mapToMongooseSchema(value as string)}`
            })
            .join(',\n')
    }

    // --- 4. Assemble the Final File Content ---

    const schemaContent = generateSchemaFields(schema, 1)

    return `import mongoose, { Schema } from 'mongoose'

const ${schemaVarName} = new Schema({
${schemaContent}
}, { timestamps: true })

export default mongoose.models.${modelName} || mongoose.model('${modelName}', ${schemaVarName})
 
`
}

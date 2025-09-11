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

    // --- 2. Type Mapping Helpers ---

    // Maps schema types to Mongoose schema definitions
    const mapToMongooseSchema = (type: string): string => {
        switch (type.toUpperCase()) {
            case 'STRING':
                return `{ type: String, required: true }`
            case 'EMAIL':
                return `{
                    type: String,
                    required: true,
                    unique: true,
                    match: [/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                }`
            case 'PASSWORD':
                return `{ type: String, required: true, select: false }`
            case 'PASSCODE':
                return `{ type: String, required: true, select: false }`
            case 'SELECT':
                return `{ type: String, required: true, enum: ['Option 1', 'Option 2'] }`
            case 'DYNAMICSELECT':
                return `{ type: Schema.Types.ObjectId, ref: 'AnotherModel' }`
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
                    type: String,
                    validate: {
                      validator: function(v: string) {
                        return /\d{3}-\d{3}-\d{4}/.test(v);
                      },
                      message: (props: { value: string }) => \`\${props.value} is not a valid phone number!\`
                    }
                }`
            case 'URL':
                return `{ type: String, trim: true }`
            case 'RICHTEXT':
            case 'AUTOCOMPLETE':
                return `{ type: String }`
            case 'RADIOBUTTON':
                return `{ type: String, enum: ['Choice A', 'Choice B'] }`
            case 'CHECKBOX':
                return `{ type: Boolean, default: false }`
            case 'MULTICHECKBOX':
                return `[{ type: String }]`
            default:
                return `{ type: String, required: true }`
        }
    }

    // Maps schema types to TypeScript interface types
    const mapToInterfaceType = (type: string): string => {
        switch (type.toUpperCase()) {
            case 'INTNUMBER':
            case 'FLOATNUMBER':
                return 'number'
            case 'BOOLEAN':
            case 'CHECKBOX':
                return 'boolean'
            case 'IMAGES':
            case 'MULTICHECKBOX':
                return 'string[]'
            case 'DATE':
                return 'Date'
            case 'DATERANGE':
                return '{ start: Date; end: Date }'
            case 'TIMERANGE':
                return '{ start: string; end: string }'
            default:
                return 'string'
        }
    }

    // Maps schema types to default values for the default object
    const mapToDefaultValue = (type: string): string => {
        switch (type.toUpperCase()) {
            case 'INTNUMBER':
            case 'FLOATNUMBER':
                return '0'
            case 'BOOLEAN':
            case 'CHECKBOX':
                return 'false'
            case 'IMAGES':
            case 'MULTICHECKBOX':
                return '[]'
            case 'DATE':
                return 'new Date()'
            case 'DATERANGE':
                return '{ start: new Date(), end: new Date() }'
            case 'TIMERANGE':
                return '{ start: "", end: "" }'
            default:
                return "''"
        }
    }

    // --- 3. Recursive Generation Functions (Corrected) ---

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

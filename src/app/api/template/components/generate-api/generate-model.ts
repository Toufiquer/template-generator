/**
 * A type definition for the schema object, allowing for infinitely nested structures.
 */
type SchemaObject = {
    [key: string]: string | SchemaObject
}

/**
 * A type definition for the main JSON configuration object.
 */
interface InputConfig {
    schema: SchemaObject
    namingConvention: {
        Users_1_000___: string
        User_3_000___: string
        user_4_000___: string
    }
}

// Maps JSON data types to their corresponding Mongoose schema definitions.
const mongooseTypeMap: Record<string, any> = {
    STRING: '{ type: String, required: true, trim: true }',
    EMAIL: `{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\\.\w{2,3})+$/, 'Please fill a valid email address']
    }`,
    PASSWORD: '{ type: String, required: true, select: false }',
    PASSCODE: '{ type: String, required: true, select: false }',
    SELECT: '{ type: String, required: true }',
    DYNAMICSELECT: "{ type: Schema.Types.ObjectId, ref: 'AnotherModel' }", // Example reference
    IMAGES: '[{ type: String }]',
    IMAGE: '{ type: String }',
    DESCRIPTION: '{ type: String, trim: true }',
    INTNUMBER: `{
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }
    }`,
    FLOATNUMBER: '{ type: Number }',
    BOOLEAN: '{ type: Boolean, default: false }',
    DATE: '{ type: Date, default: Date.now }',
    TIME: '{ type: String }',
    DATERANGE: '{ start: { type: Date }, end: { type: Date } }',
    TIMERANGE: '{ start: { type: String }, end: { type: String } }',
    COLORPICKER: `{ type: String, match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please fill a valid color hex code'] }`,
    PHONE: '{ type: String }', // Simplified for generator
    URL: '{ type: String, trim: true }',
    RICHTEXT: '{ type: String }',
    AUTOCOMPLETE: '{ type: String }',
    RADIOBUTTON: '{ type: String }',
    CHECKBOX: '{ type: Boolean, default: false }',
    MULTICHECKBOX: '[{ type: String }]',
    MULTISELECT: '[{ type: String }]',
    MULTIDYNAMICSELECT:
        "[{ type: Schema.Types.ObjectId, ref: 'AnotherModel' }]", // Example reference
}

// Maps JSON data types to their TypeScript interface equivalents.
const typescriptTypeMap: Record<string, string> = {
    STRING: 'string',
    EMAIL: 'string',
    PASSWORD: 'string',
    PASSCODE: 'string',
    SELECT: 'string',
    DYNAMICSELECT: 'any', // Or a more specific ObjectId type
    IMAGES: 'string[]',
    IMAGE: 'string',
    DESCRIPTION: 'string',
    INTNUMBER: 'number',
    FLOATNUMBER: 'number',
    BOOLEAN: 'boolean',
    DATE: 'Date',
    TIME: 'string',
    DATERANGE: '{ start: Date; end: Date; }',
    TIMERANGE: '{ start: string; end: string; }',
    COLORPICKER: 'string',
    PHONE: 'string',
    URL: 'string',
    RICHTEXT: 'string',
    AUTOCOMPLETE: 'string',
    RADIOBUTTON: 'string',
    CHECKBOX: 'boolean',
    MULTICHECKBOX: 'string[]',
    MULTISELECT: 'string[]',
    MULTIDYNAMICSELECT: 'any[]',
}

/**
 * Recursively generates the Mongoose schema definition from a schema object.
 * @param {SchemaObject} schema - The schema object to process.
 * @param {number} indentLevel - The current level of indentation for formatting.
 * @returns {string} A string representing the Mongoose schema definition.
 */
const generateMongooseSchema = (
    schema: SchemaObject,
    indentLevel = 1
): string => {
    const indent = '    '.repeat(indentLevel)
    const entries = Object.entries(schema).map(([key, value]) => {
        const quotedKey = key.includes('-') ? `'${key}'` : key
        if (typeof value === 'string') {
            const typeDefinition = mongooseTypeMap[value] || '{ type: String }'
            return `${indent}${quotedKey}: ${typeDefinition}`
        } else {
            const nestedSchema = generateMongooseSchema(value, indentLevel + 1)
            return `${indent}${quotedKey}: {\n${nestedSchema}\n${indent}}`
        }
    })
    return entries.join(',\n')
}

/**
 * Recursively generates the TypeScript interface definition from a schema object.
 * @param {SchemaObject} schema - The schema object to process.
 * @param {number} indentLevel - The current level of indentation for formatting.
 * @returns {string} A string representing the TypeScript interface properties.
 */
const generateTypeScriptInterface = (
    schema: SchemaObject,
    indentLevel = 1
): string => {
    const indent = '    '.repeat(indentLevel)
    const entries = Object.entries(schema).map(([key, value]) => {
        const quotedKey = key.includes('-') ? `'${key}'` : key
        if (typeof value === 'string') {
            // All fields are considered mandatory for the interface as per the example.
            // A '?' could be added before the colon for optional fields.
            const tsType = typescriptTypeMap[value] || 'any'
            return `${indent}${quotedKey}: ${tsType}`
        } else {
            const nestedInterface = generateTypeScriptInterface(
                value,
                indentLevel + 1
            )
            return `${indent}${quotedKey}: {\n${nestedInterface}\n${indent}}`
        }
    })
    return entries.join(';\n')
}

/**
 * Generates the entire model.ts file content as a string based on a JSON configuration.
 *
 * @param {string} inputJsonString - The JSON configuration as a string.
 * @returns {string} The complete content of the model.ts file.
 */
export function generateModel(inputJsonString: string): string {
    const config: InputConfig = JSON.parse(inputJsonString)
    const { schema, namingConvention } = config

    const schemaName = `${namingConvention.user_4_000___}Schema`
    const modelName = namingConvention.User_3_000___
    const interfaceName = `I${namingConvention.Users_1_000___}`

    const mongooseSchemaString = generateMongooseSchema(schema)
    const tsInterfaceString = generateTypeScriptInterface(schema)

    const modelTemplate = `
import mongoose, { Schema, Document } from 'mongoose';

const ${schemaName} = new Schema(
    {
${mongooseSchemaString}
    },
    { timestamps: true }
);

export default mongoose.models.${modelName} ||
    mongoose.model('${modelName}', ${schemaName});

export interface ${interfaceName} extends Document {
${tsInterfaceString};
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}
`

    return modelTemplate.trim()
}

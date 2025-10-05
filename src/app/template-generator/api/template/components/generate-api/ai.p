act as a seniour webapp developer in NextJs with Typescript and tailwindCss.

here is an example of I want to modify this code.

generate-model.ts
```
// generate-model.ts 

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
    // You might want to make these optional or add a more generic way to handle them
    ISelect_6_000___?: string
    select_5_000___?: string
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
                return `{ type: String }`
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
                return `[{ type: String }]` // Assuming an array of strings for dynamic select
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
                return `{ type: String }`
            case 'URL':
                return `{ type: String, trim: true }`
            case 'RICHTEXT':
            case 'AUTOCOMPLETE':
                return `{ type: String }`
            case 'RADIOBUTTON':
                return `[{ type: String }]` // Assuming array for radio buttons if multiple can be selected, otherwise just String
            case 'CHECKBOX':
                return `{ type: Boolean, default: false }`
            case 'MULTICHECKBOX':
                return `[{ type: String }]`
            case 'MULTIOPTIONS':
                return createMultiEnumSchema(options, [
                    'Default Option A',
                    'Default Option B',
                ])
            case 'STRINGARRAY':
                // Handles "STRINGARRAY#NAME,CLASS,ROLL"
                if (options) {
                    const fields = options
                        .split(',')
                        .map((field) => field.trim())
                        .filter(Boolean) // Remove any empty strings
                    if (fields.length > 0) {
                        const subSchemaFields = fields
                            .map(
                                (field) =>
                                    `                "${field}": { type: String }`
                            )
                            .join(',\n')
                        return `[\n            {\n${subSchemaFields}\n            }\n        ]`
                    }
                }
                return `[{ type: String }]` // Default to array of strings if no valid fields provided
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
                    // Nested object
                    return `${indent}${quotedKey}: {\n${generateSchemaFields(value, depth + 1)}\n${indent}}`
                }
                // Handle complex types directly in mapToMongooseSchema
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
```


I want input the old json file which look like 
```
{
  "uid": "000",
  "templateName": "Basic Template",
  "schema": {
    "title": "STRING",
    "email": "EMAIL",
    "password": "PASSWORD",
    "passcode": "PASSCODE",
    "area": "SELECT#Bangladesh, India, Pakistan, Canada",
    "sub-area": "DYNAMICSELECT",
    "products-images": "IMAGES",
    "personal-image": "IMAGE",
    "description": "DESCRIPTION",
    "age": "INTNUMBER",
    "amount": "FLOATNUMBER",
    "isActive": "BOOLEAN",
    "start-date": "DATE",
    "start-time": "TIME",
    "schedule-date": "DATERANGE",
    "schedule-time": "TIMERANGE",
    "favorite-color": "COLORPICKER",
    "number": "PHONE",
    "profile": "URL",
    "test": "RICHTEXT",
    "info": "AUTOCOMPLETE",
    "shift": "RADIOBUTTON#OP 1, OP 2, OP 3, OP 4",
    "policy": "CHECKBOX",
    "hobbies": "MULTICHECKBOX",
    "ideas": "MULTIOPTIONS#O 1, O 2, O 3, O 4",
    "students": "STRINGARRAY#Name, Class, Roll",
  },
  "namingConvention": {
    "Users_1_000___": "Posts",
    "users_2_000___": "posts",
    "User_3_000___": "Post",
    "user_4_000___": "post",
    "ISelect_6_000___": "ISelect",
    "select_5_000___": "select"
  }
}
```


I want input the updated json file which look like 
```
{
  "uid": "000",
  "templateName": "Basic Template",
  "schema": {
    "title": "STRING",
    "email": "EMAIL",
    "password": "PASSWORD",
    "passcode": "PASSCODE",
    "area": "SELECT#Bangladesh, India, Pakistan, Canada",
    "sub-area": "DYNAMICSELECT",
    "products-images": "IMAGES",
    "personal-image": "IMAGE",
    "description": "DESCRIPTION",
    "age": "INTNUMBER",
    "amount": "FLOATNUMBER",
    "isActive": "BOOLEAN",
    "start-date": "DATE",
    "start-time": "TIME",
    "schedule-date": "DATERANGE",
    "schedule-time": "TIMERANGE",
    "favorite-color": "COLORPICKER",
    "number": "PHONE",
    "profile": "URL",
    "test": "RICHTEXT",
    "info": "AUTOCOMPLETE",
    "shift": "RADIOBUTTON#OP 1, OP 2, OP 3, OP 4",
    "policy": "CHECKBOX",
    "hobbies": "MULTICHECKBOX",
    "ideas": "MULTIOPTIONS#O 1, O 2, O 3, O 4",
    "students": "STRINGARRAY#Name, Class, Roll",
    "complexValue": PUREJSON#{
      "id": "1234",
      "title": " The Name of Country",
      "parent": {
        "id": "111234",
        "title": " The Name of Parent",
        "child": {
          "id": "1234",
          "title": " The Name of Child",
          "child": "",
          "note": "The Note"
        },
        "note": "The Note"
      },
      "note": "The Note"
    }
  },
  "namingConvention": {
    "Users_1_000___": "Posts",
    "users_2_000___": "posts",
    "User_3_000___": "Post",
    "user_4_000___": "post",
    "ISelect_6_000___": "ISelect",
    "select_5_000___": "select"
  }
}
```


here is old output model.ts 
```
import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
    "title": { type: String },
    "email": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                },
    "password": { type: String, select: false },
    "passcode": { type: String, select: false },
    "area": { type: String, enum: ['Bangladesh', 'India', 'Pakistan', 'Canada'] },
    "sub-area": [{ type: String }],
    "products-images": [{ type: String }],
    "personal-image": { type: String },
    "description": { type: String, trim: true },
    "age": { type: Number, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } },
    "amount": { type: Number },
    "isActive": { type: Boolean, default: false },
    "start-date": { type: Date, default: Date.now },
    "start-time": { type: String },
    "schedule-date": { start: { type: Date }, end: { type: Date } },
    "schedule-time": { start: { type: String }, end: { type: String } },
    "favorite-color": { type: String, match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please fill a valid color hex code'] },
    "number": { type: String },
    "profile": { type: String, trim: true },
    "test": { type: String },
    "info": { type: String },
    "shift": [{ type: String }],
    "policy": { type: Boolean, default: false },
    "hobbies": [{ type: String }],
    "ideas": { type: [String], enum: ['O 1', 'O 2', 'O 3', 'O 4'] },
    "students": [
            {
                "Name": { type: String },
                "Class": { type: String },
                "Roll": { type: String }
            }
        ]
}, { timestamps: true })

export default mongoose.models.Post || mongoose.model('Post', postSchema)
```

here is update output model.ts 
```
import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
    "title": { type: String },
    "email": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                },
    "password": { type: String, select: false },
    "passcode": { type: String, select: false },
    "area": { type: String, enum: ['Bangladesh', 'India', 'Pakistan', 'Canada'] },
    "sub-area": [{ type: String }],
    "products-images": [{ type: String }],
    "personal-image": { type: String },
    "description": { type: String, trim: true },
    "age": { type: Number, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } },
    "amount": { type: Number },
    "isActive": { type: Boolean, default: false },
    "start-date": { type: Date, default: Date.now },
    "start-time": { type: String },
    "schedule-date": { start: { type: Date }, end: { type: Date } },
    "schedule-time": { start: { type: String }, end: { type: String } },
    "favorite-color": { type: String, match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please fill a valid color hex code'] },
    "number": { type: String },
    "profile": { type: String, trim: true },
    "test": { type: String },
    "info": { type: String },
    "shift": [{ type: String }],
    "policy": { type: Boolean, default: false },
    "hobbies": [{ type: String }],
    "ideas": { type: [String], enum: ['O 1', 'O 2', 'O 3', 'O 4'] },
    "students": [
            {
                "Name": { type: String },
                "Class": { type: String },
                "Roll": { type: String }
            }
        ],
     "complexValue": {
      "id": "1234",
      "title": " The Name of Country",
      "parent": {
        "id": "111234",
        "title": " The Name of Parent",
        "child": {
          "id": "1234",
          "title": " The Name of Child",
          "child": "",
          "note": "The Note"
        },
        "note": "The Note"
      },
      "note": "The Note"
    }
}, { timestamps: true })

export default mongoose.models.Post || mongoose.model('Post', postSchema)
```


Now you have to update generate-model.ts so that it could be handle PUREJSON and I will provide JSON file after # tag. 
 
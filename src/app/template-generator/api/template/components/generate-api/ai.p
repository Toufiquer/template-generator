act as a seniour webapp developer in NextJs with Typescript and tailwindCss.

look at those code 

generate-model.ts 
```
// generate-model.ts

interface Schema {
    [key: string]: string | Schema
}


interface NamingConvention {
    Users_1_000___: string
    users_2_000___: string
    User_3_000___: string
    user_4_000___: string
    ISelect_6_000___?: string
    select_5_000___?: string
}

interface InputConfig {
    uid: string
    templateName: string
    schema: Schema
    namingConvention: NamingConvention
}

export const generateModel = (inputJsonFile: string): string => {
    const config: InputConfig = JSON.parse(inputJsonFile)
    const { namingConvention, schema } = config

    const modelName = namingConvention.User_3_000___ || 'Item'
    const schemaVarName = `${namingConvention.user_4_000___ || 'item'}Schema`

    const mapToMongooseSchema = (type: string): string => {
        const [typeName, options] = type.split('#')

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
                return `[{ type: String }]` 
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
            case 'STRINGARRAY':
                if (options) {
                    const fields = options
                        .split(',')
                        .map((field) => field.trim())
                        .filter(Boolean) 
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
                return `[{ type: String }]` 
            case 'PUREJSON':
                if (options) {
                    try {
                        JSON.parse(options)
                        return options
                    } catch (e) {
                        console.error(
                            'Invalid JSON provided for PUREJSON type:',
                            options,
                            e
                        )
                        return '{}'
                    }
                }
                return '{}'
            default:
                return `{ type: String }`
        }
    }

 
    const generateSchemaFields = (
        currentSchema: Schema,
        depth: number
    ): string => {
        const indent = '    '.repeat(depth)
        return Object.entries(currentSchema)
            .map(([key, value]) => {
                const quotedKey = `"${key}"`
                if (typeof value === 'object' && !Array.isArray(value)) {
        
                    return `${indent}${quotedKey}: {\n${generateSchemaFields(
                        value,
                        depth + 1
                    )}\n${indent}}`
                }
               
                return `${indent}${quotedKey}: ${mapToMongooseSchema(
                    value as string
                )}`
            })
            .join(',\n')
    }

    const schemaContent = generateSchemaFields(schema, 1)

    return `import mongoose, { Schema } from 'mongoose'

const ${schemaVarName} = new Schema({
${schemaContent}
}, { timestamps: true })

export default mongoose.models.${modelName} || mongoose.model('${modelName}', ${schemaVarName})
`
}```

here is example of inputJsonFile 
```
{
  "uid": "27687d59-c8ca-4a5b-adac-b622aada1cb7",
  "templateName": "Basic Template",
  "schema": {
    "title": "STRING",
    "students": "STRINGARRAY#Name:STRING, Class:STRING, Roll:NUMBER"
  },
  "namingConvention": {
    "Users_1_000___": "Testa",
    "users_2_000___": "testa",
    "User_3_000___": "Testa",
    "user_4_000___": "testa",
    "ISelect_6_000___": "ISelect",
    "select_5_000___": "select",
    "use_generate_folder": false
  }
}
```

some times it look like 
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
    "complexValue": {
      "id": "STRING",
      "title": "STRING",
      "parent": {
        "id": "STRING",
        "title": "STRING",
        "child": {
          "id": "STRING",
          "title": "STRING",
          "child": "STRING",
          "note": "STRING"
        },
        "note": "STRING"
      },
      "note": "STRING"
    }
  },
  "namingConvention": {
    "Users_1_000___": "Posts",
    "users_2_000___": "posts",
    "User_3_000___": "Post",
    "user_4_000___": "post",
    "ISelect_6_000___": "ISelect",
    "select_5_000___": "select",
    "use_generate_folder": false
  }
}
```


and here is the output for model 

model.ts 
```
import mongoose, { Schema } from 'mongoose'

const testaSchema = new Schema(
    {
        title: { type: String },
        students: [
            {
                Name: { type: String },
                Class: { type: String },
                Roll: { type: Number },
            },
        ],
    },
    { timestamps: true }
)

export default mongoose.models.Testa || mongoose.model('Testa', testaSchema)
```

You have to update STRINGARRAY case so it can return """[
            {
                Name: { type: String },
                Class: { type: String },
                Roll: { type: Number },
            },
        ],""" 

Now please update generate-model.ts
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
function generateRtkApiFile(inputJson: string): string {
    const config: InputConfig = JSON.parse(inputJson)
    const { namingConvention } = config
    console.log('')
    console.log('')
    console.log('')
    console.log('inputJson', inputJson)

    // The template for the rtk-api.ts file with placeholders.
    const template = `// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const users_2_000___Api = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers_1_000___: builder.query({
            query: ({ page, limit, q }) => {
                let url = \`/generate/users_2_000___/all/api/v1?page=\${page || 1}&limit=\${limit || 10}\`
                if (q) {
                    url += \`&q=\${encodeURIComponent(q)}\`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeUsers_1_000___', id: 'LIST' }],
        }),
        getUsers_1_000___ById: builder.query({
            query: (id) => \`/generate/users_2_000___/all/api/v1?id=\${id}\`,
        }),
        addUsers_1_000___: builder.mutation({
            query: (newUsers_1_000___) => ({
                url: '/generate/users_2_000___/all/api/v1',
                method: 'POST',
                body: newUsers_1_000___,
            }),
            invalidatesTags: [{ type: 'tagTypeUsers_1_000___' }],
        }),
        updateUsers_1_000___: builder.mutation({
            query: ({ id, ...data }) => ({
                url: \`/generate/users_2_000___/all/api/v1\`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeUsers_1_000___' }],
        }),
        deleteUsers_1_000___: builder.mutation({
            query: ({ id }) => ({
                url: \`/generate/users_2_000___/all/api/v1\`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeUsers_1_000___' }],
        }),
        bulkUpdateUsers_1_000___: builder.mutation({
            query: (bulkData) => ({
                url: \`/generate/users_2_000___/all/api/v1?bulk=true\`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeUsers_1_000___' }],
        }),
        bulkDeleteUsers_1_000___: builder.mutation({
            query: (bulkData) => ({
                url: \`/generate/users_2_000___/all/api/v1?bulk=true\`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeUsers_1_000___' }],
        }),
    }),
})

export const {
    useGetUsers_1_000___Query,
    useAddUsers_1_000___Mutation,
    useUpdateUsers_1_000___Mutation,
    useDeleteUsers_1_000___Mutation,
    useBulkUpdateUsers_1_000___Mutation,
    useBulkDeleteUsers_1_000___Mutation,
    useGetUsers_1_000___ByIdQuery,
} = users_2_000___Api
`

    // Perform the replacements using the naming convention.
    // It's important to replace the most specific keys first to avoid conflicts.
    let result = template.replaceAll(
        'tagTypeUsers_1_000___',
        `tagType${namingConvention.Users_1_000___}`
    )
    result = result.replaceAll(
        'newUsers_1_000___',
        `new${namingConvention.User_3_000___}`
    )
    result = result.replaceAll(
        'Users_1_000___',
        namingConvention.Users_1_000___
    )
    result = result.replaceAll(
        'users_2_000___',
        namingConvention.users_2_000___
    )
    result = result.replaceAll(
        'users_2_000___',
        namingConvention.users_2_000___
    )

    return result
}

export default generateRtkApiFile

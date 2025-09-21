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
 * build a schema-aware search filter for string and number fields.
 *
 * @param {string} inputJsonString - A JSON string containing the schema and naming conventions.
 * @returns {string} The complete, formatted Controller.ts file as a string.
 */
function generateController(inputJsonString: string): string {
    const config: InputConfig = JSON.parse(inputJsonString)
    const { namingConvention, schema } = config

    /**
     * Recursively finds all field keys from the schema that match a given list of types.
     * Uses dot notation for nested objects.
     * @param {Schema} obj - The schema object or a nested part of it.
     * @param {string[]} types - An array of uppercase schema types to match (e.g., ['STRING', 'EMAIL']).
     * @param {string} [prefix=''] - The prefix for dot notation, used in recursive calls.
     * @returns {string[]} An array of matching field keys (e.g., ['title', 'author.name']).
     */
    const findAllKeysByTypes = (
        obj: Schema,
        types: string[],
        prefix = ''
    ): string[] => {
        let keys: string[] = []
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const newPrefix = prefix ? `${prefix}.${key}` : key
                const value = obj[key]

                if (
                    typeof value === 'object' &&
                    value !== null &&
                    !Array.isArray(value)
                ) {
                    keys = keys.concat(
                        findAllKeysByTypes(value as Schema, types, newPrefix)
                    )
                } else if (
                    typeof value === 'string' &&
                    types.includes(value.toUpperCase()) // Check if the schema type is in the allowed list
                ) {
                    keys.push(newPrefix)
                }
            }
        }
        return keys
    }

    // Define which schema types should be treated as strings or numbers for searching.
    const stringLikeTypes = [
        'STRING',
        'EMAIL',
        'URL',
        'PHONE',
        'DESCRIPTION',
        'RICHTEXT',
        'SELECT',
        'RADIOBUTTON',
    ]
    const numberLikeTypes = ['INTNUMBER', 'FLOATNUMBER']

    // Get the actual field names from the schema that match these types.
    const stringFields = findAllKeysByTypes(schema, stringLikeTypes)
    const numberFields = findAllKeysByTypes(schema, numberLikeTypes)

    // Prepare all naming replacements.
    const replacements = {
        Users_1_000___: namingConvention.Users_1_000___,
        users_2_000___: namingConvention.users_2_000___,
        totalUsers_1_000___: `total${namingConvention.Users_1_000___}`,
        User_3_000___: namingConvention.User_3_000___,
        user_4_000___: namingConvention.user_4_000___,
    }

    // Use a template literal to construct the final file content.
    const controllerTemplate = `import { withDB } from '@/app/api/utils/db'
import { FilterQuery } from 'mongoose'

import ${replacements.User_3_000___} from './model'

interface IResponse {
    data: unknown
    message: string
    status: number
}

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
    data,
    message,
    status,
})

// CREATE ${replacements.User_3_000___}
export async function create${replacements.User_3_000___}(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const ${replacements.user_4_000___}Data = await req.json()
            const new${replacements.User_3_000___} = await ${replacements.User_3_000___}.create({
                ...${replacements.user_4_000___}Data,
            })
            return formatResponse(
                new${replacements.User_3_000___},
                '${replacements.User_3_000___} created successfully',
                201
            )
        } catch (error: unknown) {
            if ((error as { code?: number }).code === 11000) {
                const err = error as { keyValue?: Record<string, unknown> }
                return formatResponse(
                    null,
                    \`Duplicate key error: \${JSON.stringify(err.keyValue)}\`,
                    400
                )
            }
            throw error // Re-throw other errors to be handled by \`withDB\`
        }
    })
}

// GET single ${replacements.User_3_000___} by ID
export async function get${replacements.User_3_000___}ById(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id)
            return formatResponse(null, '${replacements.User_3_000___} ID is required', 400)

        const ${replacements.user_4_000___} = await ${replacements.User_3_000___}.findById(id)
        if (!${replacements.user_4_000___})
            return formatResponse(null, '${replacements.User_3_000___} not found', 404)

        return formatResponse(
            ${replacements.user_4_000___},
            '${replacements.User_3_000___} fetched successfully',
            200
        )
    })
}

// GET all ${replacements.Users_1_000___} with pagination and intelligent search
export async function get${replacements.Users_1_000___}(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const url = new URL(req.url)
        const page = parseInt(url.searchParams.get('page') || '1', 10)
        const limit = parseInt(url.searchParams.get('limit') || '10', 10)
        const skip = (page - 1) * limit
        const searchQuery = url.searchParams.get('q')

        let searchFilter: FilterQuery<any> = {}

        if (searchQuery) {
            const orConditions: FilterQuery<any>[] = []

            // Add regex search conditions for all string-like fields
            const stringFields = ${JSON.stringify(stringFields)};
            stringFields.forEach(field => {
                orConditions.push({ [field]: { $regex: searchQuery, $options: 'i' } });
            });

            // If the query is a valid number, add equality checks for all number fields
            const numericQuery = parseFloat(searchQuery);
            if (!isNaN(numericQuery)) {
                const numberFields = ${JSON.stringify(numberFields)};
                numberFields.forEach(field => {
                    orConditions.push({ [field]: numericQuery });
                });
            }

            if (orConditions.length > 0) {
                searchFilter = { $or: orConditions };
            }
        }

        const ${replacements.users_2_000___} = await ${replacements.User_3_000___}.find(searchFilter)
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const ${replacements.totalUsers_1_000___} =
            await ${replacements.User_3_000___}.countDocuments(searchFilter)

        return formatResponse(
            {
                ${replacements.users_2_000___}: ${replacements.users_2_000___} || [],
                total: ${replacements.totalUsers_1_000___},
                page,
                limit,
            },
            '${replacements.Users_1_000___} fetched successfully',
            200
        )
    })
}

// UPDATE single ${replacements.User_3_000___} by ID
export async function update${replacements.User_3_000___}(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updated${replacements.User_3_000___} = await ${replacements.User_3_000___}.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            )

            if (!updated${replacements.User_3_000___})
                return formatResponse(null, '${replacements.User_3_000___} not found', 404)
            return formatResponse(
                updated${replacements.User_3_000___},
                '${replacements.User_3_000___} updated successfully',
                200
            )
        } catch (error: unknown) {
            if ((error as { code?: number }).code === 11000) {
                const err = error as { keyValue?: Record<string, unknown> }
                return formatResponse(
                    null,
                    \`Duplicate key error: \${JSON.stringify(err.keyValue)}\`,
                    400
                )
            }
            throw error // Re-throw other errors to be handled by \`withDB\`
        }
    })
}

// BULK UPDATE ${replacements.Users_1_000___}
export async function bulkUpdate${replacements.Users_1_000___}(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json()
        const results = await Promise.allSettled(
            updates.map(({ id, updateData }) =>
                ${replacements.User_3_000___}.findByIdAndUpdate(id, updateData, {
                    new: true,
                    runValidators: true,
                })
            )
        )

        const successfulUpdates = results
            .filter((r): r is PromiseFulfilledResult<unknown> => r.status === 'fulfilled' && r.value)
            .map((r) => r.value)
            
        const failedUpdates = results
            .map((r, i) => (r.status === 'rejected' || !('value' in r && r.value) ? updates[i].id : null))
            .filter((id): id is string => id !== null)

        return formatResponse(
            { updated: successfulUpdates, failed: failedUpdates },
            'Bulk update completed',
            200
        )
    })
}

// DELETE single ${replacements.User_3_000___} by ID
export async function delete${replacements.User_3_000___}(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { id } = await req.json()
        const deleted${replacements.User_3_000___} = await ${replacements.User_3_000___}.findByIdAndDelete(id)
        if (!deleted${replacements.User_3_000___})
            return formatResponse(
                null,
                '${replacements.User_3_000___} not found',
                404
            )
        return formatResponse(
            { deletedCount: 1 },
            '${replacements.User_3_000___} deleted successfully',
            200
        )
    })
}

// BULK DELETE ${replacements.Users_1_000___}
export async function bulkDelete${replacements.Users_1_000___}(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { ids }: { ids: string[] } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const doc = await ${replacements.User_3_000___}.findById(id)
                if (doc) {
                    const deletedDoc = await ${replacements.User_3_000___}.findByIdAndDelete(id)
                    if (deletedDoc) {
                        deletedIds.push(id)
                    }
                } else {
                    invalidIds.push(id)
                }
            } catch {
                invalidIds.push(id)
            }
        }

        return formatResponse(
            { deleted: deletedIds.length, deletedIds, invalidIds },
            'Bulk delete operation completed',
            200
        )
    })
}
`

    return controllerTemplate
}

export default generateController

/**
 * Defines the structure for the naming conventions required by the route generator.
 */
interface NamingConvention {
    Users_1_000___: string
    User_3_000___: string
}

/**
 * Defines the structure of the input JSON configuration.
 */
interface InputConfig {
    namingConvention: NamingConvention
}

/**
 * Generates the entire route.ts file content as a string based on a JSON configuration.
 *
 * This function reads the naming conventions from the provided JSON and generates the
 * corresponding Next.js API route handlers (GET, POST, PUT, DELETE). It dynamically
 * creates the names for controller functions to be imported and called, ensuring that
 * the routes correctly delegate logic for single and bulk operations.
 *
 * @param {string} inputJsonString - A JSON string containing the naming conventions.
 * @returns {string} The complete, formatted route.ts file as a string.
 */
export function generateRoute(inputJsonString: string): string {
    // Parse the JSON to access naming conventions.
    const config: InputConfig = JSON.parse(inputJsonString)
    const { namingConvention } = config

    // Generate dynamic names for entities and functions.
    const pluralName = namingConvention.Users_1_000___ // e.g., "Posts"
    const singularName = namingConvention.User_3_000___ // e.g., "Post"

    const getPlural = `get${pluralName}`
    const createSingular = `create${singularName}`
    const updateSingular = `update${singularName}`
    const deleteSingular = `delete${singularName}`
    const getSingularById = `get${singularName}ById`
    const bulkUpdatePlural = `bulkUpdate${pluralName}`
    const bulkDeletePlural = `bulkDelete${pluralName}`

    // Use a template literal to construct the final file content.
    const routeTemplate = `
import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    ${getPlural},
    ${createSingular},
    ${updateSingular},
    ${deleteSingular},
    ${getSingularById},
    ${bulkUpdatePlural},
    ${bulkDeletePlural},
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all ${pluralName}
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await ${getSingularById}(req)
        : await ${getPlural}(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE ${singularName}
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await ${createSingular}(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE ${singularName}
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await ${bulkUpdatePlural}(req)
        : await ${updateSingular}(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE ${singularName}
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await ${bulkDeletePlural}(req)
        : await ${deleteSingular}(req);

    return formatResponse(result.data, result.message, result.status);
}
`
    // Return the formatted string.
    return routeTemplate.trim()
}
